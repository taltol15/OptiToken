import { prisma } from '../prisma';

const OPENAI_USAGE_BASE = 'https://api.openai.com/v1/organization';
const OPENAI_ORG_ID = process.env.OPENAI_ORG_ID;
const OPENAI_ADMIN_API_KEY = process.env.OPENAI_ADMIN_API_KEY;

if (!OPENAI_ADMIN_API_KEY || !OPENAI_ORG_ID) {
  console.warn(
    '[OpenAI Billing] OPENAI_ADMIN_API_KEY or OPENAI_ORG_ID not set. /api/sync-billing will be a no-op for OpenAI.'
  );
}

type OpenAIUsageBucket = {
  time: number;
  cost: number;
  input_tokens?: number;
  output_tokens?: number;
};

type OpenAICostsResponse = {
  data: {
    buckets: OpenAIUsageBucket[];
  };
};

export async function syncOpenAIBillingForRange(start: Date, end: Date) {
  if (!OPENAI_ADMIN_API_KEY || !OPENAI_ORG_ID) return;

  const provider = await prisma.provider.upsert({
    where: { slug: 'openai' },
    update: {},
    create: {
      slug: 'openai',
      name: 'OpenAI',
      type: 'OPENAI',
    },
  });

  const startTime = Math.floor(start.getTime() / 1000);
  const endTime = Math.floor(end.getTime() / 1000);

  const url = `${OPENAI_USAGE_BASE}/costs?start_time=${startTime}&end_time=${endTime}&granularity=day`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${OPENAI_ADMIN_API_KEY}`,
      'OpenAI-Organization': OPENAI_ORG_ID,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI billing fetch failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as OpenAICostsResponse;

  for (const bucket of json.data.buckets) {
    const date = new Date(bucket.time * 1000);
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
        totalCostUsd: bucket.cost,
        totalInputTokens: bucket.input_tokens ?? 0,
        totalOutputTokens: bucket.output_tokens ?? 0,
      },
      create: {
        providerId: provider.id,
        date: day,
        totalCostUsd: bucket.cost,
        totalInputTokens: bucket.input_tokens ?? 0,
        totalOutputTokens: bucket.output_tokens ?? 0,
      },
    });
  }
}

