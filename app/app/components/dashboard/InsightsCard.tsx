'use client';

import type { Insight } from '@/app/lib/billing/insights';

const badgeColors: Record<
  Insight['severity'],
  string
> = {
  info: 'bg-sky-500/10 text-sky-300 border-sky-500/40',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/40',
  critical: 'bg-rose-500/10 text-rose-300 border-rose-500/40',
};

export function InsightsCard({ insights }: { insights: Insight[] }) {
  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-100">
          Actionable insights
        </h2>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300 border border-emerald-500/30">
          AI recommender
        </span>
      </div>

      <div className="mt-3 space-y-3 overflow-y-auto text-sm">
        {insights.map((insight, idx) => (
          <article
            key={idx}
            className="rounded-lg border border-slate-800 bg-slate-900/70 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-slate-100">
                {insight.title}
              </h3>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide border ${badgeColors[insight.severity]}`}
              >
                {insight.severity}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              {insight.description}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-3 text-[10px] text-slate-500">
        Recommendations are heuristic for now. You can wire this to an LLM
        later for deeper cost optimization suggestions.
      </p>
    </section>
  );
}

