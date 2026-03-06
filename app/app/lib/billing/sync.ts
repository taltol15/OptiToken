import { prisma } from '../prisma';
import { syncOpenAIBillingForRange } from './openai';
import { syncAnthropicBillingForRange } from './anthropic';

export async function syncCurrentMonthBilling() {
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  const syncRun = await prisma.syncRun.create({
    data: {
      source: 'BOTH',
    },
  });

  try {
    await Promise.all([
      syncOpenAIBillingForRange(startOfMonth, endOfMonth),
      syncAnthropicBillingForRange(startOfMonth, endOfMonth),
    ]);

    await prisma.syncRun.update({
      where: { id: syncRun.id },
      data: {
        success: true,
        finishedAt: new Date(),
        message: 'Sync completed successfully',
      },
    });
  } catch (err: any) {
    await prisma.syncRun.update({
      where: { id: syncRun.id },
      data: {
        success: false,
        finishedAt: new Date(),
        message: err?.message ?? 'Unknown error',
      },
    });
    throw err;
  }
}

