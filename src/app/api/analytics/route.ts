
import { NextRequest, NextResponse } from 'next/server';
import { getLogs } from '@/lib/log-store';

export const runtime = 'nodejs';
// This line is crucial to prevent Next.js from caching the response.
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const logs = await getLogs();
    // Show most recent first
    return NextResponse.json(logs.reverse());
  } catch (error: any) {
    console.error('Failed to read log file:', error);
    return NextResponse.json({ error: 'Failed to retrieve analytics data.' }, { status: 500 });
  }
}
