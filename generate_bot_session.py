"""
Generate Telegram Bot Session String
-------------------------------------
This script generates a Pyrogram session string for a bot account.
You'll need a bot token from BotFather.

Usage:
    python generate_bot_session.py

Bot Token Format: 123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi
"""
import os
from dotenv import load_dotenv
from pyrogram import Client

load_dotenv()

api_id = int(os.environ.get("TELEGRAM_API_ID"))
api_hash = os.environ.get("TELEGRAM_API_HASH")

if not api_id or not api_hash:
    print("ERROR: TELEGRAM_API_ID or TELEGRAM_API_HASH not found in .env file")
    exit(1)

bot_token = input("Enter your Telegram Bot Token (from BotFather): ").strip()

if not bot_token or ":" not in bot_token:
    print("ERROR: Invalid bot token format")
    exit(1)

print(f"\nAPI ID: {api_id}")
print(f"API Hash: {api_hash[:10]}...")
print(f"Bot Token: {bot_token[:20]}...")
print("\nGenerating bot session...\n")

try:
    app = Client("axon_bot", api_id=api_id, api_hash=api_hash, bot_token=bot_token)
    
    with app:
        session_string = app.export_session_string()
        print("\n" + "="*60)
        print("Your Telegram Bot Session String:")
        print("="*60)
        print(session_string)
        print("="*60)
        print("\nCopy the session string above and add it to your .env file as:")
        print("TELEGRAM_SESSION=<session_string_here>")
        print("\nThen update the .env file and run: python worker.py")
except Exception as e:
    print(f"ERROR: Failed to generate session - {e}")
    print("\nMake sure:")
    print("1. Your bot token is correct (from BotFather)")
    print("2. TELEGRAM_API_ID and TELEGRAM_API_HASH are valid")
    exit(1)
