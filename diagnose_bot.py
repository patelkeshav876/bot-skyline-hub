"""
Telegram Bot Diagnostics
------------------------
This script checks if your bot is properly configured and receiving messages.
"""
import os
from dotenv import load_dotenv
from pyrogram import Client

load_dotenv()

bot_token = os.environ.get("TELEGRAM_BOT_TOKEN") or "8317168943:AAHZ3mZ9Fpmwz0s74uwOKD_qwEN2Sdcqeh4"
api_id = int(os.environ.get("TELEGRAM_API_ID"))
api_hash = os.environ.get("TELEGRAM_API_HASH")

print("=" * 60)
print("Telegram Bot Diagnostics")
print("=" * 60)
print()

print("1. Configuration Check:")
print(f"   ✓ Bot Token: {bot_token[:20]}..." if bot_token else "   ✗ Bot Token: MISSING")
print(f"   ✓ API ID: {api_id}" if api_id else "   ✗ API ID: MISSING")
print(f"   ✓ API Hash: {api_hash[:10]}..." if api_hash else "   ✗ API Hash: MISSING")
print()

print("2. Bot Connection Check:")
try:
    app = Client("axon_bot", api_id=api_id, api_hash=api_hash, bot_token=bot_token)
    with app:
        me = app.get_me()
        print(f"   ✓ Connected to bot: @{me.username}")
        print(f"   ✓ Bot ID: {me.id}")
        print(f"   ✓ Bot Name: {me.first_name}")
        print()
        
        print("3. Bot Information:")
        print(f"   ✓ Is Bot: {me.is_bot}")
        print(f"   ✓ Is Premium: {me.is_premium}")
        print()
        
        print("4. Webhook Status Check:")
        webhook_info = app.get_webhook()
        print(f"   Webhook URL: {webhook_info.url if webhook_info else 'Not set'}")
        print()
        
except Exception as e:
    print(f"   ✗ Connection failed: {e}")
    print()
    print("   Troubleshooting:")
    print("   - Verify your bot token is correct")
    print("   - Verify TELEGRAM_API_ID and TELEGRAM_API_HASH are correct")
    print("   - Check your internet connection")
    exit(1)

print("=" * 60)
print("Bot is properly configured!")
print("=" * 60)
print()
print("Next steps to fix 'no reply' issue:")
print()
print("1. Ensure worker.py is running (if using polling):")
print("   cd c:\\Users\\Asus\\Desktop\\lov_mus\\bot-skyline-hub")
print("   python worker.py")
print()
print("2. OR ensure webhook is receiving requests:")
print("   - Check your backend logs at:")
print("   - https://project--ea63f92c-5e43-47e7-899c-fb3e6722fd7f-dev.lovable.app")
print()
print("3. Ensure the bot:")
print("   - Is added to the group")
print("   - Has permission to send messages")
print("   - Has permission to join voice calls (for audio streaming)")
print()
print("4. Verify Supabase tables exist:")
print("   - groups")
print("   - commands")
print("   - queue")
print("   - now_playing")
print()
