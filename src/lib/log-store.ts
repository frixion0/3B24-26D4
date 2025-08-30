import { createClient } from 'redis';

const redisUrl = "redis://default:VU0EYlurxIV54I1RUDz4aqlRp78dHfUu@redis-17968.c83.us-east-1-2.ec2.redns.redis-cloud.com:17968";

const LOG_KEY = 'telegram_logs';

interface LogEntry {
  chatId: number;
  username: string;
  firstName: string;
  lastName: string;
  text: string;
  timestamp: string;
}

export async function appendLog(logEntry: object): Promise<void> {
  const client = createClient({ url: redisUrl });
  try {
    await client.connect();
    await client.lPush(LOG_KEY, JSON.stringify(logEntry));
  } catch (error) {
    console.error('Error appending log to Redis:', error);
    // We don't re-throw here because logging shouldn't crash the main application flow.
  } finally {
    if (client.isOpen) {
      await client.disconnect();
    }
  }
}

export async function getAllLogsFromList(): Promise<LogEntry[]> {
  const client = createClient({ url: redisUrl });
  try {
    await client.connect();
    // lrange(key, 0, -1) fetches all items from the list.
    const logStrings = await client.lRange(LOG_KEY, 0, -1);
    // The logs are stored as strings, so we need to parse them back into objects.
    const logs = logStrings.map(log => JSON.parse(log));
    return logs || [];
  } catch (error) {
    console.error('Error getting logs from Redis list:', error);
    return [];
  } finally {
     if (client.isOpen) {
      await client.disconnect();
    }
  }
}
