import { prisma } from '../prisma';

export type Insight = {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
};

export async function getCostInsightsForCurrentMonth(): Promise<Insight[]> {
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  const usage = await prisma.dailyUsage.findMany({
    where: {
      date: {
        gte: startOfMonth,
        lt: endOfMonth,
      },
    },
    include: {
      provider: true,
    },
  });

  if (usage.length === 0) {
    return [
      {
        title: 'No data yet',
        description:
          'Run a billing sync to fetch your current month usage from OpenAI and Anthropic.',
        severity: 'info',
      },
    ];
  }

  const byProvider = new Map<
    string,
    { cost: number; inputTokens: number; outputTokens: number }
  >();

  for (const u of usage) {
    const key = u.provider.slug;
    const existing = byProvider.get(key) ?? {
      cost: 0,
      inputTokens: 0,
      outputTokens: 0,
    };
    const cost = u.totalCostUsd;
    byProvider.set(key, {
      cost: existing.cost + cost,
      inputTokens: existing.inputTokens + u.totalInputTokens,
      outputTokens: existing.outputTokens + u.totalOutputTokens,
    });
  }

  const insights: Insight[] = [];

  const openai = byProvider.get('openai');
  const anthropic = byProvider.get('anthropic');

  if (openai && anthropic) {
    if (openai.cost > anthropic.cost * 1.5) {
      insights.push({
        title: 'OpenAI spend dominates',
        severity: 'warning',
        description: `OpenAI accounts for about ${(
          (openai.cost / (openai.cost + anthropic.cost)) *
          100
        ).toFixed(
          1
        )}% of your total LLM spend this month. Consider routing simpler workloads to cheaper models (e.g. GPT-4o-mini or Anthropic’s lower-cost tiers).`,
      });
    }
    if (anthropic.cost > openai.cost * 1.5) {
      insights.push({
        title: 'Anthropic spend dominates',
        severity: 'warning',
        description: `Anthropic accounts for about ${(
          (anthropic.cost / (openai.cost + anthropic.cost)) *
          100
        ).toFixed(
          1
        )}% of your total LLM spend this month. Consider shifting non-critical volume to cheaper providers or models.`,
      });
    }
  }

  if (openai && openai.inputTokens > 1_000_000) {
    insights.push({
      title: 'High input token volume on OpenAI',
      severity: 'info',
      description:
        'You have more than 1M input tokens on OpenAI this month. You may be able to save costs by using shorter prompts, caching system prompts, or switching some tasks to GPT-4o-mini.',
    });
  }

  if (insights.length === 0) {
    insights.push({
      title: 'You are in a good place',
      severity: 'info',
      description:
        'No obvious cost inefficiencies detected based on the current month data. Keep monitoring as your usage grows.',
    });
  }

  return insights;
}

