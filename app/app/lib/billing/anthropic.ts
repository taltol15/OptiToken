import { prisma } from '../prisma';

const ANTHROPIC_ADMIN_KEY = process.env.ANTHROPIC_ADMIN_API_KEY;
const ANTHROPIC_BASE = 'https://api.anthropic.com/v1/organizations';

if (!ANTHROPIC_ADMIN_KEY) {
  console.warn(
    '[Anthropic Billing] ANTHROPIC_ADMIN_API_KEY not set. /api/sync-billing will be a no-op for Anthropic.'
  );
}

type AnthropicCostBucket = {
  timestamp: string;
  total_cost_usd: number;
  input_tokens?: number;
  output_tokens?: number;
};

type AnthropicCostReportResponse = {
  data: AnthropicCostBucket[];
};

export async function syncAnthropicBillingForRange(start: Date, end: Date) {
  if (!ANTHROPIC_ADMIN_KEY) return;

  const provider = await prisma.provider.upsert({
    where: { slug: 'anthropic' },
    update: {},
    create: {
      slug: 'anthropic',
      name: 'Anthropic',
      type: 'ANTHROPIC',
    },
  });

  const body = {
    starting_at: start.toISOString(),
    ending_at: end.toISOString(),
    bucket_width: '1d',
  };

  const res = await fetch(`${ANTHROPIC_BASE}/cost_report`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ANTHROPIC_ADMIN_KEY}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic billing fetch failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as AnthropicCostReportResponse;

  for (const bucket of json.data) {
    const date = new Date(bucket.timestamp);
    const day = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    );

    await prisma.dailyUsage.upsert({
      where: {
        providerId_date: {
          providerId: provider.id,
          date: day,
        },
      },
      update: {
        totalCostUsd: bucket.total_cost_usd,
        totalInputTokens: bucket.input_tokens ?? 0,
        totalOutputTokens: bucket.output_tokens ?? 0,
      },
      create: {
        providerId: provider.id,
        date: day,
        totalCostUsd: bucket.total_cost_usd,
        totalInputTokens: bucket.input_tokens ?? 0,
        totalOutputTokens: bucket.output_tokens ?? 0,
      },
    });
  }
}

