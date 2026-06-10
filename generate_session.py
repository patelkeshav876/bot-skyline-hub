"""
Generate Telegram Session String
---------------------------------
This script generates a Pyrogram session string for a user account.
You'll need to authenticate with your Telegram account.

Usage:
    python generate_session.py
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

print(f"API ID: {api_id}")
print(f"API Hash: {api_hash[:10]}...")
print("\nStarting Pyrogram client...")
print("You will be asked to log in with your phone number.")
print("This will generate a session string.\n")

app = Client("axon", api_id=api_id, api_hash=api_hash)

with app:
    session_string = app.export_session_string()
    print("\n" + "="*60)
    print("Your Telegram Session String:")
    print("="*60)
    print(session_string)
    print("="*60)
    print("\nCopy the session string above and add it to your .env file as:")
    print("TELEGRAM_SESSION=<session_string_here>")
    print("\nThen update the .env file and run: python worker.py")
