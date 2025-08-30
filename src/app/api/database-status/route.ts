
import { createClient } from "redis";
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const redisUrl = "redis://default:VU0EYlurxIV54I1RUDz4aqlRp78dHfUu@redis-17968.c83.us-east-1-2.ec2.redns.redis-cloud.com:17968";
  
  try {
    const client = createClient({ url: redisUrl });
    await client.connect();
    
    // A simple ping is a reliable way to check the connection.
    await client.ping();
    await client.disconnect();
    
    return NextResponse.json({ ok: true, message: 'Connected to Redis Cloud.' });
  } catch (error: any) {
    console.error('Redis connection check failed:', error);
    return NextResponse.json({ ok: false, error: 'Failed to connect to Redis Cloud.', details: error.message }, { status: 500 });
  }
}
