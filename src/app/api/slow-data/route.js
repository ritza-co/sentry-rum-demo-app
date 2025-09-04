import { NextResponse } from 'next/server';

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 3000));

  return NextResponse.json({ message: 'Slow data loaded successfully' });
}
