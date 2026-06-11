import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8317168943:AAHZ3mZ9Fpmwz0s74uwOKD_qwEN2Sdcqeh4';

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Telegram webhook handler
app.post('/api/telegram/webhook', async (req: Request, res: Response) => {
  try {
    const update = req.body;
    console.log('📨 Telegram webhook received:', JSON.stringify(update, null, 2));

    // Handle text messages
    if (update.message) {
      const message = update.message;
      const chatId = message.chat.id;
      const text = message.text || '';
      const userId = message.from.id;
      const userName = message.from.username || message.from.first_name || 'User';

      console.log(`💬 Message from ${userName} (${userId}) in chat ${chatId}: ${text}`);

      // Handle commands (e.g., /play, /stop, /skip)
      if (text.startsWith('/')) {
        const parts = text.slice(1).split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        console.log(`🎯 Command: /${command}, Args: ${args}`);

        // Ensure group exists
        const { data: groupData } = await supabase
          .from('groups')
          .select('id')
          .eq('chat_id', chatId)
          .single();

        let groupId = groupData?.id;

        if (!groupId) {
          // Create group if doesn't exist
          const { data: newGroup } = await supabase
            .from('groups')
            .insert({
              chat_id: chatId,
              title: message.chat.title || `Chat ${chatId}`,
            })
            .select('id')
            .single();
          groupId = newGroup?.id;
        }

        // Store command in database
        if (groupId) {
          const { error: cmdError } = await supabase.from('commands').insert({
            group_id: groupId,
            type: command,
            payload: args ? { url: args } : null,
            status: 'pending',
            created_at: new Date().toISOString(),
          });

          if (cmdError) {
            console.error('❌ Failed to store command:', cmdError);
          } else {
            console.log('✅ Command stored in database');
            // Send acknowledgment
            await sendMessage(chatId, `✅ Command /${command} received!`);
          }
        }
      }
    }

    // Handle group join/leave
    if (update.my_chat_member) {
      const status = update.my_chat_member.new_chat_member.status;
      if (status === 'member' || status === 'administrator') {
        const groupChat = update.my_chat_member.chat;
        console.log(`🤖 Bot added to group: ${groupChat.title}`);

        // Store group
        await supabase.from('groups').upsert({
          chat_id: groupChat.id,
          title: groupChat.title,
        });

        await sendMessage(
          groupChat.id,
          '🎵 Ghost Music Bot activated!\n\nAvailable commands:\n/play <YouTube URL> - Play a song\n/stop - Stop playback\n/pause - Pause playback\n/resume - Resume playback\n/skip - Skip current song'
        );
      }
    }

    // Always return 200 OK to Telegram
    res.json({ ok: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.json({ ok: true, error: String(error) });
  }
});

// Helper function to send Telegram messages
async function sendMessage(chatId: number | string, text: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Failed to send Telegram message:', error);
      return false;
    }

    console.log(`✅ Message sent to ${chatId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending Telegram message:', error);
    return false;
  }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
