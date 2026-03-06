'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

type ChartRow = {
  date: string;
  [providerSlug: string]: string | number;
};

export function DailyCostChart({ data }: { data: ChartRow[] }) {
  const providerSlugs = Array.from(
    data.reduce((set, row) => {
      Object.keys(row).forEach((key) => {
        if (key !== 'date') set.add(key);
      });
      return set;
    }, new Set<string>())
  );

  const colors = ['#22c55e', '#38bdf8', '#f97316', '#a855f7'];

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
      <h2 className="text-sm font-medium text-slate-100">
        Daily cost by provider
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Current month, grouped by UTC date.
      </p>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} stackOffset="none">
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `$${Number(v).toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#1f2937',
              }}
              formatter={(v: any) => `$${Number(v).toFixed(2)}`}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {providerSlugs.map((slug, idx) => (
              <Bar
                key={slug}
                dataKey={slug}
                stackId="providers"
                fill={colors[idx % colors.length]}
                radius={idx === providerSlugs.length - 1 ? [4, 4, 0, 0] : 0}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

