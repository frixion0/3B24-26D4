import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/ai/flows/generate-image-from-telegram-prompt';
import { sendMessage, sendPhoto } from '@/lib/telegram';

export const runtime = 'nodejs';
// Increase timeout for image generation
export const maxDuration = 120;


export async function POST(req: NextRequest) {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not set.');
    return NextResponse.json({ error: 'Bot is not configured.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    
    // Check for message and text
    if (!body.message || !body.message.text || !body.message.chat || !body.message.chat.id) {
      // Not a message we can handle, ignore.
      return NextResponse.json({ ok: true });
    }

    const chatId = body.message.chat.id;
    const text = body.message.text as string;

    if (text.startsWith('/start') || text.startsWith('/help')) {
      const welcomeMessage = `
Hello! I'm TeleImage Bot. 🤖

Send me a text prompt and I'll generate an image for you.

For example, try sending:
"A cute cat wearing a wizard hat"
or
"A futuristic city skyline at sunset, cinematic lighting"

Let your imagination run wild!
      `;
      await sendMessage(chatId, welcomeMessage.trim());
      return NextResponse.json({ ok: true });
    }

    // Acknowledge the request
    await sendMessage(chatId, '🎨 Generating your masterpiece... this might take a moment.');

    try {
      const { imageDataUri } = await generateImage({ prompt: text });
      await sendPhoto(chatId, imageDataUri, `Here is your image for: "${text}"`);
    } catch (error) {
      console.error('Error generating or sending image:', error);
      await sendMessage(chatId, '😔 Sorry, I had trouble creating an image for that prompt. Please try a different one or try again later.');
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Error handling webhook:', error);
    // In case of parsing error or other issues, we might not have a chatId to respond to.
    // So we just log the error and return a generic server error.
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
