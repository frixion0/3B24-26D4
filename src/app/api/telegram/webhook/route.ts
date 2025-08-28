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
Hello there! I'm TeleImage Bot. 🤖

I can turn your text descriptions into beautiful images. It's easy to get started!

**How to use me:**
Just send me a message with a description of the image you want to create.

**For example, you could send:**
- "A serene painting of a cherry blossom tree by a river"
- "A futuristic cityscape with flying cars, neon lights, cinematic"
- "A photorealistic image of a red panda wearing a tiny chef's hat"

I'll get to work and send you back your unique creation. If I ever get stuck, I'll let you know.

Let your imagination run wild! What would you like to create first?
      `;
      await sendMessage(chatId, welcomeMessage.trim());
      return NextResponse.json({ ok: true });
    }

    // Acknowledge the request first to provide immediate feedback
    await sendMessage(chatId, '🎨 Got it! Generating your masterpiece... this might take a moment.');

    try {
      const { imageDataUri } = await generateImage({ prompt: text });
      await sendPhoto(chatId, imageDataUri, `Here is your image for: "${text}"`);
    } catch (error) {
      console.error('Error generating or sending image:', error);
      // Ensure a user-facing error is sent on failure
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
