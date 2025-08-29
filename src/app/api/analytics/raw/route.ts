
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
// This line is crucial to prevent Next.js from caching the response.
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const logFilePath = path.join('/tmp', 'telegram_log.jsonl');

  try {
    const fileContent = await fs.readFile(logFilePath, 'utf-8');
    return new NextResponse(fileContent, {
        headers: {
            'Content-Type': 'text/plain',
        }
    });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, which is fine. It means no logs yet.
      return new NextResponse('Log file does not exist.', { status: 200, headers: {'Content-Type': 'text/plain'} });
    }
    console.error('Failed to read log file:', error);
    return new NextResponse('Failed to retrieve analytics data.', { status: 500, headers: {'Content-Type': 'text/plain'} });
  }
}
