import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendMessage } from "./telegram.server";

export type GroupRow = {
  id: string;
  chat_id: number;
  title: string;
  added_at: string;
};

export type QueueRow = {
  id: string;
  group_id: string;
  position: number;
  title: string;
  artist: string | null;
  url: string;
  thumbnail_url: string | null;
  duration_sec: number | null;
  requested_by: string | null;
  status: "queued" | "playing" | "played" | "skipped" | "failed";
  added_at: string;
};

export type NowPlayingRow = {
  group_id: string;
  queue_id: string | null;
  started_at: string | null;
  position_sec: number;
  is_paused: boolean;
  volume: number;
  updated_at: string;
};

export const listGroups = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("groups")
    .select("*")
    .order("added_at", { ascending: false });
  if (error) throw new Error(error.message);
  return { groups: (data ?? []) as GroupRow[] };
});

export const getGroupState = createServerFn({ method: "POST" })
  .inputValidator(z.object({ groupId: z.string().uuid() }).parse)
  .handler(async ({ data }) => {
    const [q, np] = await Promise.all([
      supabaseAdmin
        .from("queue")
        .select("*")
        .eq("group_id", data.groupId)
        .in("status", ["queued", "playing"])
        .order("position", { ascending: true })
        .limit(200),
      supabaseAdmin.from("now_playing").select("*").eq("group_id", data.groupId).maybeSingle(),
    ]);
    if (q.error) throw new Error(q.error.message);
    if (np.error) throw new Error(np.error.message);
    return {
      queue: (q.data ?? []) as QueueRow[],
      nowPlaying: (np.data ?? null) as NowPlayingRow | null,
    };
  });

export const addToQueue = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      groupId: z.string().uuid(),
      url: z.string().url().max(1000),
      title: z.string().min(1).max(300),
      artist: z.string().max(200).optional(),
      thumbnailUrl: z.string().url().max(1000).optional(),
      durationSec: z.number().int().min(0).max(36000).optional(),
      requestedBy: z.string().max(120).optional(),
    }).parse,
  )
  .handler(async ({ data }) => {
    const { data: maxRow } = await supabaseAdmin
      .from("queue")
      .select("position")
      .eq("group_id", data.groupId)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextPos = ((maxRow?.position as number | undefined) ?? 0) + 1;

    const { data: row, error } = await supabaseAdmin
      .from("queue")
      .insert({
        group_id: data.groupId,
        position: nextPos,
        title: data.title,
        artist: data.artist ?? null,
        url: data.url,
        thumbnail_url: data.thumbnailUrl ?? null,
        duration_sec: data.durationSec ?? null,
        requested_by: data.requestedBy ?? "web",
        status: "queued",
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("commands").insert({ group_id: data.groupId, type: "reload" });
    return { track: row as QueueRow };
  });

export const removeFromQueue = createServerFn({ method: "POST" })
  .inputValidator(z.object({ trackId: z.string().uuid() }).parse)
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("queue").delete().eq("id", data.trackId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const cmdType = z.enum([
  "play",
  "pause",
  "resume",
  "skip",
  "prev",
  "seek",
  "volume",
  "stop",
  "reload",
  "join",
  "leave",
]);

export const sendCommand = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      groupId: z.string().uuid(),
      type: cmdType,
      payload: z.record(z.string(), z.unknown()).optional(),
    }).parse,
  )
  .handler(async ({ data }) => {
    // Optimistic local updates for instant UI feedback
    if (data.type === "pause" || data.type === "resume") {
      await supabaseAdmin
        .from("now_playing")
        .update({ is_paused: data.type === "pause" })
        .eq("group_id", data.groupId);
    }
    if (data.type === "volume" && typeof data.payload?.volume === "number") {
      await supabaseAdmin
        .from("now_playing")
        .update({ volume: Math.max(0, Math.min(200, data.payload.volume as number)) })
        .eq("group_id", data.groupId);
    }
    const { error } = await supabaseAdmin.from("commands").insert({
      group_id: data.groupId,
      type: data.type,
      payload: (data.payload ?? {}) as never,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const announceInGroup = createServerFn({ method: "POST" })
  .inputValidator(z.object({ groupId: z.string().uuid(), text: z.string().min(1).max(2000) }).parse)
  .handler(async ({ data }) => {
    const { data: g, error } = await supabaseAdmin
      .from("groups")
      .select("chat_id")
      .eq("id", data.groupId)
      .single();
    if (error) throw new Error(error.message);
    await sendMessage(g.chat_id as number, data.text);
    return { ok: true };
  });