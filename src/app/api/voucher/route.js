import { NextResponse } from 'next/server';

export async function POST(request) {
  const { voucherCode, isSlowConnection } = await request.json();

  if (voucherCode.toUpperCase() === 'FREE-SHIPPING') {
    if (isSlowConnection) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return NextResponse.json({
      success: true,
      message: 'Voucher applied!',
      voucher: {
        isApplied: true,
        discountPercentage: 0.2
      }
    });
  }

  return NextResponse.json({ success: false, message: 'Invalid voucher' }, { status: 400 });
}