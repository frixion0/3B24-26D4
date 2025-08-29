
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // The `info` command is a lightweight way to check the connection.
    // As of @vercel/kv@1.0.1, info() is not a public method.
    // A simple `get` or `exists` is a reliable way to check.
    await kv.exists('db_health_check');
    return NextResponse.json({ ok: true, message: 'Connected to Vercel KV.' });
  } catch (error: any) {
    console.error('Database connection check failed:', error);
    return NextResponse.json({ ok: false, error: 'Failed to connect to Vercel KV.', details: error.message }, { status: 500 });
  }
}
