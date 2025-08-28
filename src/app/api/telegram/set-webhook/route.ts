import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

async function setWebhook(webhookUrl: string) {
  const botToken = "8354841529:AAHoH88pqVExG1AcQ6mi3KjA-HO5nlsBwq0";

  if (!botToken) {
    return { ok: false, error: 'TELEGRAM_BOT_TOKEN is not set.', status: 500 };
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
    const body = await req.json();
    const webhookBaseUrl = body.webhookBaseUrl || "https://3-b24-26-d4.vercel.app";
    const webhookUrl = `${webhookBaseUrl}/api/telegram/webhook`;

    if (!webhookBaseUrl) {
        return NextResponse.json({ ok: false, error: 'WEBHOOK_BASE_URL is not provided or configured.' }, { status: 400 });
    }

    const result = await setWebhook(webhookUrl);
    return NextResponse.json(result, { status: result.status });
}

    