import { prisma } from './lib/prisma';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { DailyCostChart } from './components/dashboard/DailyCostChart';
import { InsightsCard } from './components/dashboard/InsightsCard';
import { SyncButton } from './components/dashboard/SyncButton';
import { getCostInsightsForCurrentMonth } from './lib/billing/insights';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  const daily = await prisma.dailyUsage.findMany({
    where: {
      date: {
        gte: startOfMonth,
        lt: endOfMonth,
      },
    },
    include: { provider: true },
    orderBy: { date: 'asc' },
  });

  const totalSpend = daily.reduce((acc, d) => acc + d.totalCostUsd, 0);

  const byProvider: Record<
    string,
    { name: string; slug: string; total: number }
  > = {};

  for (const d of daily) {
    const key = d.provider.slug;
    if (!byProvider[key]) {
      byProvider[key] = {
        name: d.provider.name,
        slug: d.provider.slug,
        total: 0,
      };
    }
    byProvider[key].total += d.totalCostUsd;
  }

  const providerBreakdown = Object.values(byProvider);

  const chartDataMap = new Map<
    string,
    { date: string; [providerSlug: string]: number | string }
  >();

  for (const d of daily) {
    const dKey = d.date.toISOString().slice(0, 10);
    const row =
      chartDataMap.get(dKey) ?? {
        date: dKey,
      };
    row[d.provider.slug] = ((row[d.provider.slug] as number) ?? 0) + d.totalCostUsd;
    chartDataMap.set(dKey, row);
  }

  const chartData = Array.from(chartDataMap.values());

  const insights = await getCostInsightsForCurrentMonth();

  return {
    totalSpend,
    providerBreakdown,
    chartData,
    insights,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              OptiToken
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Zero-friction AI FinOps dashboard for your LLM usage.
            </p>
          </div>
          <SyncButton />
        </header>

        <SummaryCards
          totalSpend={data.totalSpend}
          providerBreakdown={data.providerBreakdown}
        />

        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <DailyCostChart data={data.chartData} />
          <InsightsCard insights={data.insights} />
        </div>
      </div>
    </main>
  );
}
