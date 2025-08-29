// This is a free, anonymous bin from another service to ensure persistence.
// It's a simple way to have a persistent data store without any setup.
const BIN_URL = 'https://api.npoint.io/46f5b92778328639c381';

interface LogData {
  logs: LogEntry[];
}

interface LogEntry {
  chatId: number;
  username: string;
  firstName: string;
  lastName: string;
  text: string;
  timestamp: string;
}

// npoint.io doesn't have a "latest" version concept, so we work with the main URL.
// It also doesn't require API keys for public read/write bins like this one.

export async function getLogs(): Promise<LogEntry[]> {
  try {
    // Add a cache-busting query parameter to ensure we get the latest data
    const response = await fetch(`${BIN_URL}?t=${new Date().getTime()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If the bin is empty, it will return a default object.
      // If it truly fails, we'll get an error.
      if (response.status === 404) {
        // This case might not happen with npoint, but it's good practice.
        return [];
      }
      // We'll try to parse the error, but fall back to a generic message.
      const errorBody = await response.text();
      console.error(`Failed to fetch logs from npoint: ${response.statusText}`, errorBody);
      // Return empty on error to prevent crashing the analytics page.
      return [];
    }

    const data: LogData = await response.json();
    return data.logs || [];
  } catch (error) {
    console.error('Error getting logs from npoint:', error);
    return []; // Return empty on error
  }
}

export async function appendLog(logEntry: object): Promise<void> {
  // 1. Get the current logs
  const currentLogs = await getLogs();

  // 2. Add the new log
  const updatedLogs = [...currentLogs, logEntry];

  // 3. Write the entire log array back
  try {
    const response = await fetch(BIN_URL, {
      method: 'POST', // With npoint, POST will overwrite the entire bin content.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ logs: updatedLogs }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to update logs: ${response.statusText} - ${errorBody}`);
    }
  } catch (error) {
    console.error('Error appending log to npoint:', error);
    // We don't re-throw here because logging shouldn't crash the main application flow.
  }
}
