import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { message: 'Deprecated. Use /api/cron/master-loop instead.', status: 410 },
    { status: 410 }
  );
}
