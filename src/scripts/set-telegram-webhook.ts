import { config } from 'dotenv';
config();

async function setWebhook() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = `${process.env.WEBHOOK_BASE_URL}/api/telegram/webhook`;

  if (!botToken) {
    console.error('Error: TELEGRAM_BOT_TOKEN is not set in your .env file.');
    process.exit(1);
  }

  if (!process.env.WEBHOOK_BASE_URL) {
    console.error('Error: WEBHOOK_BASE_URL is not set in your .env file.');
    process.exit(1);
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
      console.log('✅ Webhook set successfully!');
      console.log(`Bot will send updates to: ${webhookUrl}`);
      console.log(`Description: ${result.description}`);
    } else {
      console.error('❌ Failed to set webhook:');
      console.error(`Error Code: ${result.error_code}`);
      console.error(`Description: ${result.description}`);
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
}

setWebhook();
