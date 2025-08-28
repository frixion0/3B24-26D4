import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

async function setWebhook() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = `${process.env.WEBHOOK_BASE_URL}/api/telegram/webhook`;

  if (!botToken) {
    return { ok: false, error: 'TELEGRAM_BOT_TOKEN is not set in your .env file.', status: 500 };
  }

  if (!process.env.WEBHOOK_BASE_URL) {
    return { ok: false, error: 'WEBHOOK_BASE_URL is not set in your .env file.', status: 500 };
  }
  
  const apiUrl = `https://api.telegram.org/bot${botToken}/setWebhook`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
      }),
    });

    const result = await response.json();

    if (result.ok) {
        return { ok: true, data: result, status: 200 };
    } else {
        return { ok: false, error: `Failed to set webhook: ${result.description}`, status: result.error_code || 500 };
    }
  } catch (error) {
    console.error('An unexpected error occurred while setting webhook:', error);
    return { ok: false, error: 'An unexpected error occurred.', status: 500 };
  }
}


export async function POST(req: NextRequest) {
    const result = await setWebhook();
    return NextResponse.json(result, { status: result.status });
}
