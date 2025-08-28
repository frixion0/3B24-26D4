import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// This function checks the status of the Telegram webhook.
export async function GET(req: NextRequest) {
  const botToken = "8354841529:AAHoH88pqVExG1AcQ6mi3KjA-HO5nlsBwq0";
  const webhookBaseUrl = "https://3-b24-26-d4.vercel.app";

  if (!botToken) {
    return NextResponse.json(
      { ok: false, error: 'TELEGRAM_BOT_TOKEN is not set.' },
      { status: 500 }
    );
  }

  const apiUrl = `https://api.telegram.org/bot${botToken}/getWebhookInfo`;

  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (result.ok) {
        // We add the expected webhook URL to the response for easy comparison on the client.
        const expectedUrl = `${webhookBaseUrl}/api/telegram/webhook`;
        return NextResponse.json({ ok: true, ...result.result, expected_url: expectedUrl });
    } else {
      return NextResponse.json(
        { ok: false, error: 'Failed to get webhook info from Telegram.', details: result },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching webhook status:', error);
    return NextResponse.json(
      { ok: false, error: 'An unexpected error occurred while fetching webhook status.' },
      { status: 500 }
    );
  }
}
