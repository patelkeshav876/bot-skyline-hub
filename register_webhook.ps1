# Register Telegram Bot Webhook - PowerShell Script
# This script sets up the webhook for your Telegram bot

$BOT_TOKEN = "8317168943:AAHZ3mZ9Fpmwz0s74uwOKD_qwEN2Sdcqeh4"
$WEBHOOK_URL = "https://project--ea63f92c-5e43-47e7-899c-fb3e6722fd7f-dev.lovable.app/api/public/telegram/webhook"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Telegram Bot Webhook Registration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Bot Token: $($BOT_TOKEN.Substring(0, 20))..." -ForegroundColor Yellow
Write-Host "Webhook URL: $WEBHOOK_URL" -ForegroundColor Yellow
Write-Host ""

# Compute the secret token
Write-Host "Computing secret token..." -ForegroundColor Green
$securityString = "axon-tg-webhook:$BOT_TOKEN"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($securityString)
$hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
$SECRET = [Convert]::ToBase64String($hash).TrimEnd('=').Replace('+', '-').Replace('/', '_')

Write-Host "Secret Token: $($SECRET.Substring(0, 20))..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Registering webhook with Telegram..." -ForegroundColor Green
Write-Host ""

# Register the webhook
$body = @{
    url = $WEBHOOK_URL
    secret_token = $SECRET
    allowed_updates = @("message", "edited_message", "my_chat_member")
} | ConvertTo-Json

$response = Invoke-RestMethod `
  -Uri "https://api.telegram.org/bot$BOT_TOKEN/setWebhook" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Response from Telegram:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$response | ConvertTo-Json | Write-Host -ForegroundColor Green
Write-Host ""

if ($response.ok -eq $true) {
    Write-Host "Webhook registered successfully!" -ForegroundColor Green
} else {
    Write-Host "Webhook registration failed!" -ForegroundColor Red
    Write-Host ("Error: " + $response.description) -ForegroundColor Red
}

Write-Host ""
