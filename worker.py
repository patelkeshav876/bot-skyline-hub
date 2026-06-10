"""
AXON Audio Worker
-----------------
Runs on any machine (VPS, Replit, your laptop) and streams audio into Telegram
voice chats based on the queue + commands tables managed by your AXON website.

Requirements:
  pip install pyrogram tgcrypto py-tgcalls yt-dlp supabase python-dotenv

Env (.env next to this file):
  TELEGRAM_API_ID=...
  TELEGRAM_API_HASH=...
  TELEGRAM_SESSION=        # Pyrogram session string for a USER account (not bot)
  SUPABASE_URL=https://ubpmrjcukhnussfpuezi.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=...   # from Lovable Cloud > Backend > Settings

Generate TELEGRAM_SESSION once:
  python -c "from pyrogram import Client; Client('axon', api_id=..., api_hash='...').run()"
  # then in the REPL: app.export_session_string()

Run:
  python worker.py
"""
import asyncio, os, time
from dotenv import load_dotenv
from pyrogram import Client
from pytgcalls import PyTgCalls
from pytgcalls.types import MediaStream
from supabase import create_client
import yt_dlp

load_dotenv()
SB = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])
app = Client("axon", api_id=int(os.environ["TELEGRAM_API_ID"]),
             api_hash=os.environ["TELEGRAM_API_HASH"],
             session_string=os.environ["TELEGRAM_SESSION"])
calls = PyTgCalls(app)

def resolve(url: str) -> tuple[str, str, int]:
    """Return (stream_url, title, duration_sec) using yt-dlp."""
    ydl_opts = {"format": "bestaudio/best", "quiet": True, "noplaylist": True}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        return info["url"], info.get("title") or url, int(info.get("duration") or 0)

async def play_next(group_id: str, chat_id: int):
    nxt = SB.table("queue").select("*").eq("group_id", group_id)\
        .eq("status", "queued").order("position").limit(1).execute().data
    if not nxt:
        try: await calls.leave_call(chat_id)
        except: pass
        SB.table("now_playing").upsert({"group_id": group_id, "queue_id": None,
            "is_paused": False, "position_sec": 0}).execute()
        return
    track = nxt[0]
    try:
        stream_url, title, dur = resolve(track["url"])
        SB.table("queue").update({"status": "playing", "title": title,
            "duration_sec": dur}).eq("id", track["id"]).execute()
        await calls.play(chat_id, MediaStream(stream_url))
        SB.table("now_playing").upsert({"group_id": group_id, "queue_id": track["id"],
            "is_paused": False, "position_sec": 0,
            "started_at": "now()"}).execute()
        print(f"[+] Playing in {chat_id}: {title}")
    except Exception as e:
        print(f"[!] Failed {track['url']}: {e}")
        SB.table("queue").update({"status": "failed"}).eq("id", track["id"]).execute()
        await play_next(group_id, chat_id)

async def handle_command(cmd):
    g = SB.table("groups").select("chat_id").eq("id", cmd["group_id"]).single().execute().data
    chat_id = g["chat_id"]
    t = cmd["type"]
    try:
        if t in ("reload", "play"):  await play_next(cmd["group_id"], chat_id)
        elif t == "pause":           await calls.pause_stream(chat_id)
        elif t == "resume":          await calls.resume_stream(chat_id)
        elif t == "skip":
            now = SB.table("now_playing").select("queue_id").eq("group_id", cmd["group_id"]).single().execute().data
            if now and now["queue_id"]:
                SB.table("queue").update({"status": "skipped"}).eq("id", now["queue_id"]).execute()
            await play_next(cmd["group_id"], chat_id)
        elif t == "stop":
            try: await calls.leave_call(chat_id)
            except: pass
        elif t == "volume":
            vol = int(cmd.get("payload", {}).get("volume", 100))
            await calls.change_volume_call(chat_id, vol)
    except Exception as e:
        print(f"[!] cmd {t}: {e}")

async def poll():
    while True:
        try:
            cmds = SB.table("commands").select("*").eq("status", "pending")\
                .order("created_at").limit(10).execute().data
            for c in cmds:
                await handle_command(c)
                SB.table("commands").update({"status": "consumed",
                    "consumed_at": "now()"}).eq("id", c["id"]).execute()
        except Exception as e:
            print(f"[!] Poll error: {e}")
        await asyncio.sleep(1.5)

async def main():
    await app.start(); await calls.start()
    print("AXON worker online")
    await poll()

if __name__ == "__main__":
    asyncio.run(main())
