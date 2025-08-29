// This is a free, anonymous bin from JSONBin.io.
// It's a simple way to have a persistent data store without any setup.
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/669fddc0e41b4d34e4171348';
const MASTER_KEY = '$2a$10$w8iZBi2C992xG2GdSgqJpeQmfjM2Vl92JvO2LwAifA.uLoa2mGTf6'; // Read/Write key for this specific bin

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
    const response = await fetch(`${JSONBIN_URL}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': MASTER_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If the bin is empty, it might return a 404, which is okay.
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to fetch logs: ${response.statusText}`);
    }

    const data: any = await response.json();
    return data.record.logs || [];
  } catch (error) {
    console.error('Error getting logs from JSONBin:', error);
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
    const response = await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'X-Master-Key': MASTER_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ logs: updatedLogs }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update logs: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error appending log to JSONBin:', error);
    // We don't re-throw here because logging shouldn't crash the main application flow.
  }
}
