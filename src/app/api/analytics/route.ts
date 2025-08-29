
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const logFilePath = path.join('/tmp', 'telegram_log.jsonl');

  try {
    const fileContent = await fs.readFile(logFilePath, 'utf-8');
    const lines = fileContent.trim().split('\n');
    const logs = lines.map(line => JSON.parse(line)).reverse(); // Show most recent first
    return NextResponse.json(logs);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, which is fine. It means no logs yet.
      return NextResponse.json([]);
    }
    console.error('Failed to read log file:', error);
    return NextResponse.json({ error: 'Failed to retrieve analytics data.' }, { status: 500 });
  }
}
