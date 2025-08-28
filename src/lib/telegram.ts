const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const WEBSITE_LINK = 'https://neural-canvas-seven.vercel.app/';

if (!BOT_TOKEN) {
  console.warn("TELEGRAM_BOT_TOKEN is not set. The Telegram bot will not work.");
}

function appendLink(text: string): string {
    return `${text}\n\n${WEBSITE_LINK}`;
}

export async function sendMessage(chatId: number, text: string): Promise<Response> {
  const url = `${BASE_URL}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: appendLink(text),
    }),
  });
  
  if (!response.ok) {
    console.error('Failed to send message:', await response.json());
  }
  
  return response;
}

export async function sendPhoto(chatId: number, imageDataUri: string, caption: string): Promise<Response> {
  const url = `${BASE_URL}/sendPhoto`;
  
  const [header, base64Data] = imageDataUri.split(',');
  if (!header || !base64Data) {
    throw new Error('Invalid image data URI');
  }

  const mimeTypeMatch = header.match(/:(.*?);/);
  if (!mimeTypeMatch || !mimeTypeMatch[1]) {
    throw new Error('Could not extract MIME type from image data URI');
  }
  const mimeType = mimeTypeMatch[1];
  
  const buffer = Buffer.from(base64Data, 'base64');

  const formData = new FormData();
  formData.append('chat_id', String(chatId));
  formData.append('photo', new Blob([buffer], { type: mimeType }), 'image.png');
  formData.append('caption', appendLink(caption));

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    console.error('Failed to send photo:', await response.json());
  }

  return response;
}
