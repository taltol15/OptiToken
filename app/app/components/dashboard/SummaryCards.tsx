'use client';

type ProviderBreakdown = {
  name: string;
  slug: string;
  total: number;
};

export function SummaryCards({
  totalSpend,
  providerBreakdown,
}: {
  totalSpend: number;
  providerBreakdown: ProviderBreakdown[];
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Total spend (this month)
        </div>
        <div className="mt-2 text-2xl font-semibold">
          ${totalSpend.toFixed(2)}
        </div>
      </div>

      {providerBreakdown.map((p) => (
        <div
          key={p.slug}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm"
        >
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {p.name} spend
          </div>
          <div className="mt-2 text-xl font-semibold">
            ${p.total.toFixed(2)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {(p.total / Math.max(totalSpend, 0.01) * 100).toFixed(1)}% of total
          </div>
        </div>
      ))}
    </section>
  );
}

