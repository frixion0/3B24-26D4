
import { NextRequest, NextResponse } from 'next/server';
import { getAllLogsFromList } from '@/lib/log-store';

export const runtime = 'nodejs';
// This line is crucial to prevent Next.js from caching the response.
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const logs = await getAllLogsFromList();
    const fileContent = logs.map(log => JSON.stringify(log)).join('\n');
    
    return new NextResponse(fileContent || 'Log store is empty.', {
        headers: {
            'Content-Type': 'text/plain',
        }
    });
  } catch (error: any) {
    console.error('Failed to read logs from Vercel KV:', error);
    return new NextResponse('Failed to retrieve analytics data.', { status: 500, headers: {'Content-Type': 'text/plain'} });
  }
}
