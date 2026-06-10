/**
 * Telegram Webhook Handler
 * ========================
 * Add this to your Lovable backend API routes to handle incoming Telegram bot messages
 * 
 * Endpoint: /api/public/telegram/webhook (POST)
 */

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SECRET_TOKEN = process.env.TELEGRAM_SECRET_TOKEN;

export async function handleTelegramWebhook(req, res) {
  // Verify secret token
  const receivedToken = req.headers['x-telegram-bot-api-secret-token'];
  if (receivedToken !== SECRET_TOKEN) {
    console.error('Invalid secret token');
    return res.status(403).json({ error: 'Invalid secret token' });
  }

  try {
    const update = req.body;
    console.log('Received Telegram update:', JSON.stringify(update, null, 2));

    // Handle text messages
    if (update.message) {
      const message = update.message;
      const chatId = message.chat.id;
      const text = message.text || '';

      console.log(`Message from ${chatId}: ${text}`);

      // Check if it's a command
      if (text.startsWith('/')) {
        const [command, ...args] = text.slice(1).split(' ');
        const payload = args.join(' ');

        console.log(`Command: ${command}, Payload: ${payload}`);

        // Store in Supabase commands table
        const { error: cmdError } = await supabase
          .from('commands')
          .insert({
            chat_id: chatId,
            command: command,
            payload: payload,
            status: 'pending',
            created_at: new Date().toISOString(),
          });

        if (cmdError) {
          console.error('Failed to store command:', cmdError);
          return res.status(500).json({ error: 'Failed to store command' });
        }

        // Send acknowledgment
        const acknowledgment = `✓ Command /${command} received!`;
        await sendTelegramMessage(chatId, acknowledgment);
      }

      // Handle group join
      if (update.my_chat_member) {
        const status = update.my_chat_member.new_chat_member.status;
        if (status === 'member') {
          // Bot was added to group
          const groupId = update.my_chat_member.chat.id;
          const groupTitle = update.my_chat_member.chat.title;

          // Store group in Supabase
          const { error: groupError } = await supabase
            .from('groups')
            .upsert({
              chat_id: groupId,
              title: groupTitle,
              status: 'active',
            });

          if (!groupError) {
            await sendTelegramMessage(groupId, '✓ Bot joined! Send /start to see available commands.');
          }
        }
      }
    }

    // Always return 200 to Telegram
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(200).json({ ok: true }); // Still return 200 to avoid retries
  }
}

async function sendTelegramMessage(chatId, text) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: text }),
    });

    if (!response.ok) {
      console.error('Failed to send message:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}
