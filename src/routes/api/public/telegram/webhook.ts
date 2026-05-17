import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendMessage, verifyWebhookSecret } from "@/lib/telegram.server";

type TgUser = { id: number; first_name?: string; username?: string };
type TgChat = { id: number; type: string; title?: string };
type TgMessage = {
  message_id: number;
  from?: TgUser;
  chat: TgChat;
  text?: string;
  entities?: { type: string; offset: number; length: number }[];
};
type TgUpdate = {
  update_id: number;
  message?: TgMessage;
  edited_message?: TgMessage;
  my_chat_member?: { chat: TgChat; new_chat_member: { status: string } };
};

async function upsertGroup(chat: TgChat) {
  const title = chat.title ?? `Chat ${chat.id}`;
  const { data, error } = await supabaseAdmin
    .from("groups")
    .upsert({ chat_id: chat.id, title }, { onConflict: "chat_id" })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

function parseCommand(msg: TgMessage): { cmd: string; args: string } | null {
  const text = msg.text ?? "";
  const ent = msg.entities?.find((e) => e.type === "bot_command" && e.offset === 0);
  if (!ent) return null;
  const raw = text.slice(0, ent.length);
  const cmd = raw.split("@")[0].slice(1).toLowerCase();
  const args = text.slice(ent.length).trim();
  return { cmd, args };
}

function isUrl(s: string) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

async function handleMessage(msg: TgMessage) {
  if (msg.chat.type === "private") {
    await sendMessage(
      msg.chat.id,
      "👋 Hi! Add me to a group, then use <b>/play &lt;link&gt;</b>, /pause, /resume, /skip or /queue.\n\nManage everything visually at your AXON dashboard.",
    );
    return;
  }

  const groupId = await upsertGroup(msg.chat);
  const parsed = parseCommand(msg);
  if (!parsed) return;

  const requester = msg.from?.username ? `@${msg.from.username}` : msg.from?.first_name ?? "user";

  switch (parsed.cmd) {
    case "start":
    case "help":
      await sendMessage(
        msg.chat.id,
        "🎧 <b>AXON Audio</b>\n/play &lt;url&gt; · queue a track\n/pause · /resume · /skip\n/queue · show what's next\n/stop · clear & leave",
      );
      return;
    case "play": {
      if (!parsed.args || !isUrl(parsed.args)) {
        await sendMessage(
          msg.chat.id,
          "Send a direct URL: <code>/play https://youtu.be/...</code>",
        );
        return;
      }
      const url = parsed.args;
      const title = url.length > 80 ? url.slice(0, 77) + "…" : url;
      const { data: maxRow } = await supabaseAdmin
        .from("queue")
        .select("position")
        .eq("group_id", groupId)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();
      const pos = ((maxRow?.position as number | undefined) ?? 0) + 1;
      await supabaseAdmin.from("queue").insert({
        group_id: groupId,
        position: pos,
        title,
        url,
        requested_by: requester,
        status: "queued",
      });
      await supabaseAdmin.from("commands").insert({ group_id: groupId, type: "reload" });
      await sendMessage(msg.chat.id, `✅ Queued by ${requester} · position #${pos}`);
      return;
    }
    case "pause":
      await supabaseAdmin.from("commands").insert({ group_id: groupId, type: "pause" });
      await sendMessage(msg.chat.id, "⏸ Paused");
      return;
    case "resume":
      await supabaseAdmin.from("commands").insert({ group_id: groupId, type: "resume" });
      await sendMessage(msg.chat.id, "▶️ Resumed");
      return;
    case "skip":
      await supabaseAdmin.from("commands").insert({ group_id: groupId, type: "skip" });
      await sendMessage(msg.chat.id, "⏭ Skipped");
      return;
    case "stop":
      await supabaseAdmin.from("commands").insert({ group_id: groupId, type: "stop" });
      await supabaseAdmin
        .from("queue")
        .delete()
        .eq("group_id", groupId)
        .in("status", ["queued", "playing"]);
      await sendMessage(msg.chat.id, "🛑 Stopped & cleared");
      return;
    case "queue": {
      const { data: list } = await supabaseAdmin
        .from("queue")
        .select("title, requested_by, status, position")
        .eq("group_id", groupId)
        .in("status", ["queued", "playing"])
        .order("position", { ascending: true })
        .limit(10);
      if (!list || list.length === 0) {
        await sendMessage(msg.chat.id, "📭 Queue is empty.");
        return;
      }
      const text = list
        .map(
          (t, i) =>
            `${t.status === "playing" ? "🎵" : `${i + 1}.`} ${t.title} <i>· ${t.requested_by ?? ""}</i>`,
        )
        .join("\n");
      await sendMessage(msg.chat.id, `<b>Up next</b>\n${text}`);
      return;
    }
  }
}

export const Route = createFileRoute("/api/public/telegram/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!verifyWebhookSecret(request.headers.get("X-Telegram-Bot-Api-Secret-Token"))) {
          return new Response("Unauthorized", { status: 401 });
        }
        let update: TgUpdate;
        try {
          update = (await request.json()) as TgUpdate;
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }
        try {
          const msg = update.message ?? update.edited_message;
          if (msg) await handleMessage(msg);
          if (update.my_chat_member?.new_chat_member?.status === "member") {
            await upsertGroup(update.my_chat_member.chat);
          }
        } catch (e) {
          console.error("tg webhook error", e);
        }
        return Response.json({ ok: true });
      },
    },
  },
});