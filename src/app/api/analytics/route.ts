
import { NextRequest, NextResponse } from 'next/server';
import { getAllLogsFromList } from '@/lib/log-store';

export const runtime = 'nodejs';
// This line is crucial to prevent Next.js from caching the response.
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Use the new function to get all logs from the Vercel KV list
    const logs = await getAllLogsFromList();
    // The logs are pushed to the start of the list, so they are already in reverse chronological order.
    return NextResponse.json(logs);
  } catch (error: any) {
    console.error('Failed to read logs from Vercel KV:', error);
    return NextResponse.json({ error: 'Failed to retrieve analytics data.' }, { status: 500 });
  }
}
