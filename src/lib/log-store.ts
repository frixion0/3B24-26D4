import { kv } from '@vercel/kv';

const LOG_KEY = 'telegram_logs';

interface LogEntry {
  chatId: number;
  username: string;
  firstName: string;
  lastName: string;
  text: string;
  timestamp: string;
}

export async function getLogs(): Promise<LogEntry[]> {
  try {
    const logs = await kv.get<LogEntry[]>(LOG_KEY);
    return logs || [];
  } catch (error) {
    console.error('Error getting logs from Vercel KV:', error);
    return []; // Return empty on error to prevent crashing the analytics page.
  }
}

export async function appendLog(logEntry: object): Promise<void> {
  try {
    // Vercel KV doesn't have a direct append, so we use a list (lpush)
    // This is more efficient than getting and setting the whole array.
    await kv.lpush(LOG_KEY, logEntry);
  } catch (error) {
    console.error('Error appending log to Vercel KV:', error);
    // We don't re-throw here because logging shouldn't crash the main application flow.
  }
}

// We also need a way to read the list for the analytics page.
export async function getAllLogsFromList(): Promise<LogEntry[]> {
    try {
        // lrange(key, 0, -1) fetches all items from the list.
        const logs = await kv.lrange<LogEntry>(LOG_KEY, 0, -1);
        return logs || [];
    } catch (error) {
        console.error('Error getting logs from Vercel KV list:', error);
        return [];
    }
}
