@echo off
REM Register Telegram Bot Webhook - Windows Batch Script
REM This script sets up the webhook for your Telegram bot

REM Extract bot token from webhook file (if using the existing one)
set BOT_TOKEN=8317168943:AAHZ3mZ9Fpmwz0s74uwOKD_qwEN2Sdcqeh4
set WEBHOOK_URL=https://project--ea63f92c-5e43-47e7-899c-fb3e6722fd7f-dev.lovable.app/api/public/telegram/webhook

echo.
echo ========================================
echo Telegram Bot Webhook Registration
echo ========================================
echo Bot Token: %BOT_TOKEN%
echo Webhook URL: %WEBHOOK_URL%
echo.

REM For Windows, we'll use a Node.js script to compute the secret
echo Computing secret token...
node -e "const crypto = require('crypto'); const secret = crypto.createHash('sha256').update('axon-tg-webhook:%BOT_TOKEN%').digest('base64url'); console.log(secret);" > secret.txt
set /p SECRET=<secret.txt
del secret.txt

echo Secret Token: %SECRET%
echo.
echo Registering webhook with Telegram...
echo.

curl -X POST "https://api.telegram.org/bot%BOT_TOKEN%/setWebhook" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\":\"%WEBHOOK_URL%\",\"secret_token\":\"%SECRET%\",\"allowed_updates\":[\"message\",\"edited_message\",\"my_chat_member\"]}"

echo.
echo ========================================
echo Webhook registration complete!
echo ========================================
echo.
pause
