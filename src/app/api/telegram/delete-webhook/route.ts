import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

async function deleteWebhook() {
  const botToken = "8354841529:AAHoH88pqVExG1AcQ6mi3KjA-HO5nlsBwq0";

  if (!botToken) {
    return { ok: false, error: 'TELEGRAM_BOT_TOKEN is not set.', status: 500 };
  }

  const apiUrl = `https://api.telegram.org/bot${botToken}/deleteWebhook`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (result.ok) {
        return { ok: true, data: result, status: 200 };
    } else {
        return { ok: false, error: `Failed to delete webhook: ${result.description}`, status: result.error_code || 500 };
    }
  } catch (error) {
    console.error('An unexpected error occurred while deleting webhook:', error);
    return { ok: false, error: 'An unexpected error occurred.', status: 500 };
  }
}

export async function POST(req: NextRequest) {
    const result = await deleteWebhook();
    return NextResponse.json(result, { status: result.status });
}
