import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Socket.IO endpoint - use WebSocket connection',
    status: 'ready'
  });
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Socket.IO endpoint - use WebSocket connection',
    status: 'ready'
  });
}