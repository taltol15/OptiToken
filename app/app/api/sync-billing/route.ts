import { NextRequest, NextResponse } from 'next/server';
import { syncCurrentMonthBilling } from '@/app/lib/billing/sync';

export async function POST(_req: NextRequest) {
  try {
    await syncCurrentMonthBilling();
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Sync billing error', error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}

