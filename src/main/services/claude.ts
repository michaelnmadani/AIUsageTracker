import type {
  ClaudeApiUsage,
  ClaudeBucket,
  ClaudeConfig,
  ClaudeData,
  ClaudeModelSlice,
  ClaudeSubscriptionUsage,
} from '../../shared/types';
import type { UsageEntry, UsageParser } from '../parser';
import type { Store } from '../store';

const ADMIN_BASE = 'https://api.anthropic.com/v1/organizations';
const ANTHROPIC_VERSION = '2023-06-01';
const USER_AGENT = 'CommandCentre/2.0 (desktop dashboard)';

/** USD per million tokens. Cache writes bill at 1.25x input, cache reads at 0.1x. */
interface Price {
  input: number;
  output: number;
  label: string;
  colour: string;
}

const PRICING: Record<string, Price> = {
  'claude-fable-5': { input: 10, output: 50, label: 'Fable 5', colour: '#ff8fb3' },
  'claude-mythos-5': { input: 10, output: 50, label: 'Mythos 5', colour: '#c78dff' },
  'claude-opus-5': { input: 5, output: 25, label: 'Opus 5', colour: '#b6efff' },
  'claude-opus-4-8': { input: 5, output: 25, label: 'Opus 4.8', colour: '#5ed6ff' },
  'claude-opus-4-7': { input: 5, output: 25, label: 'Opus 4.7', colour: '#3fb6e8' },
  'claude-opus-4-6': { input: 5, output: 25, label: 'Opus 4.6', colour: '#1c8fc4' },
  'claude-sonnet-5': { input: 3, output: 15, label: 'Sonnet 5', colour: '#ffb547' },
  'claude-sonnet-4-6': { input: 3, output: 15, label: 'Sonnet 4.6', colour: '#e09a2e' },
  'claude-haiku-4-5': { input: 1, output: 5, label: 'Haiku 4.5', colour: '#3fe0a8' },
};

const FAMILY_FALLBACK: { match: RegExp; price: Price }[] = [
  { match: /fable|mythos/, price: PRICING['claude-fable-5'] },
  { match: /opus/, price: PRICING['claude-opus-5'] },
  { match: /sonnet/, price: PRICING['claude-sonnet-5'] },
  { match: /haiku/, price: PRICING['claude-haiku-4-5'] },
];

export function priceFor(model: string): Price {
  const exact = PRICING[model];
  if (exact) return exact;
  // Dated snapshots ("claude-opus-4-5-20251101") and unknown ids fall back to family.
  const known = Object.keys(PRICING).find((id) => model.startsWith(id));
  if (known) return PRICING[known];
  const family = FAMILY_FALLBACK.find((f) => f.match.test(model));
  if (family) return { ...family.price, label: model };
  return { input: 3, output: 15, label: model || 'unknown', colour: '#4d7188' };
}

function costOf(entry: UsageEntry): number {
  const price = priceFor(entry.model);
  const { inputTokens, outputTokens, cacheCreationTokens, cacheReadTokens } = entry.usage;
  return (
    (inputTokens * price.input +
      cacheCreationTokens * price.input * 1.25 +
      cacheReadTokens * price.input * 0.1 +
      outputTokens * price.output) /
    1_000_000
  );
}

function tokensOf(entry: UsageEntry): number {
  const u = entry.usage;
  return u.inputTokens + u.outputTokens + u.cacheCreationTokens + u.cacheReadTokens;
}

function startOfLocalDay(offsetDays = 0): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime() - offsetDays * 86_400_000;
}

/* ------------------------------------------------------ Pro / Max (local) */

function buildSubscription(
  parser: UsageParser,
  config: ClaudeConfig
): ClaudeSubscriptionUsage {
  const entries = parser.getEntries();
  const now = Date.now();
  const windowStart = now - config.sessionWindowHours * 3_600_000;
  const todayStart = startOfLocalDay();
  const weekStart = startOfLocalDay(6);

  const empty: ClaudeSubscriptionUsage = {
    available: entries.length > 0,
    reason: entries.length > 0 ? null : 'No Claude Code transcripts found under ~/.claude.',
    isActive: false,
    activeProject: null,
    activeModel: null,
    window: {
      hours: config.sessionWindowHours,
      startedAt: null,
      endsAt: null,
      tokens: 0,
      budget: config.windowTokenBudget,
      percentUsed: 0,
      costUsd: 0,
    },
    today: { tokens: 0, costUsd: 0, messages: 0 },
    last7Days: { tokens: 0, costUsd: 0 },
    tokensPerMinute: 0,
    models: [],
    topProjects: [],
    hourly: [],
  };
  if (entries.length === 0) return empty;

  const modelTotals = new Map<string, { tokens: number; cost: number }>();
  const projectTotals = new Map<string, number>();
  const hourBuckets = new Map<string, { tokens: number; cost: number }>();

  let windowTokens = 0;
  let windowCost = 0;
  let windowFirstTs: number | null = null;
  let todayTokens = 0;
  let todayCost = 0;
  let todayMessages = 0;
  let weekTokens = 0;
  let weekCost = 0;

  for (const entry of entries) {
    const ts = new Date(entry.timestamp).getTime();
    if (Number.isNaN(ts)) continue;
    const tokens = tokensOf(entry);
    const cost = costOf(entry);

    if (ts >= weekStart) {
      weekTokens += tokens;
      weekCost += cost;
      const model = modelTotals.get(entry.model) ?? { tokens: 0, cost: 0 };
      model.tokens += tokens;
      model.cost += cost;
      modelTotals.set(entry.model, model);
      projectTotals.set(
        entry.projectName ?? 'unknown',
        (projectTotals.get(entry.projectName ?? 'unknown') ?? 0) + tokens
      );
    }
    if (ts >= todayStart) {
      todayTokens += tokens;
      todayCost += cost;
      todayMessages += 1;
    }
    if (ts >= windowStart) {
      windowTokens += tokens;
      windowCost += cost;
      if (windowFirstTs === null) windowFirstTs = ts;
    }
    if (ts >= now - 24 * 3_600_000) {
      const key = new Date(ts).toISOString().slice(0, 13);
      const bucket = hourBuckets.get(key) ?? { tokens: 0, cost: 0 };
      bucket.tokens += tokens;
      bucket.cost += cost;
      hourBuckets.set(key, bucket);
    }
  }

  const last = entries[entries.length - 1];
  const lastTs = new Date(last.timestamp).getTime();
  const elapsedMinutes = windowFirstTs ? Math.max(1, (now - windowFirstTs) / 60_000) : 1;

  const models: ClaudeModelSlice[] = [...modelTotals.entries()]
    .map(([model, totals]) => {
      const price = priceFor(model);
      return {
        model,
        displayName: price.label,
        colour: price.colour,
        totalTokens: totals.tokens,
        costUsd: totals.cost,
      };
    })
    .sort((a, b) => b.totalTokens - a.totalTokens);

  const hourly: ClaudeBucket[] = [...hourBuckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({
      label: `${new Date(`${key}:00:00Z`).getHours()}:00`,
      tokens: value.tokens,
      costUsd: value.cost,
    }));

  return {
    available: true,
    reason: null,
    isActive: now - lastTs < 120_000,
    activeProject: last.projectName ?? null,
    activeModel: last.model ?? null,
    window: {
      hours: config.sessionWindowHours,
      startedAt: windowFirstTs,
      endsAt: windowFirstTs ? windowFirstTs + config.sessionWindowHours * 3_600_000 : null,
      tokens: windowTokens,
      budget: config.windowTokenBudget,
      percentUsed:
        config.windowTokenBudget > 0
          ? Math.min(100, (windowTokens / config.windowTokenBudget) * 100)
          : 0,
      costUsd: windowCost,
    },
    today: { tokens: todayTokens, costUsd: todayCost, messages: todayMessages },
    last7Days: { tokens: weekTokens, costUsd: weekCost },
    tokensPerMinute: Math.round(windowTokens / elapsedMinutes),
    models,
    topProjects: [...projectTotals.entries()]
      .map(([name, tokens]) => ({ name, tokens }))
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 5),
    hourly,
  };
}

/* ------------------------------------------- Pay-as-you-go (Admin API) */

async function adminGet(key: string, path: string, params: URLSearchParams): Promise<any> {
  const response = await fetch(`${ADMIN_BASE}/${path}?${params.toString()}`, {
    headers: {
      'x-api-key': key,
      'anthropic-version': ANTHROPIC_VERSION,
      'user-agent': USER_AGENT,
      accept: 'application/json',
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message ?? `${response.status} ${response.statusText}`;
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        `${message} — the Usage & Cost API needs an Admin API key (sk-ant-admin01-…) and is not available on individual accounts.`
      );
    }
    throw new Error(message);
  }
  return data;
}

function unavailableApi(reason: string | null): ClaudeApiUsage {
  return {
    available: false,
    reason,
    today: { tokens: 0, costUsd: 0 },
    last7Days: { tokens: 0, costUsd: 0 },
    last30Days: { tokens: 0, costUsd: 0 },
    daily: [],
    models: [],
    webSearchRequests: 0,
    cacheHitRate: 0,
  };
}

async function buildApi(store: Store, config: ClaudeConfig): Promise<ClaudeApiUsage> {
  if (!config.apiUsageEnabled) {
    return unavailableApi(null);
  }
  const key = store.getSecret('anthropicAdminKey');
  if (!key) {
    return unavailableApi('Add an Anthropic Admin API key in Settings to track API spend.');
  }

  const days = 30;
  const startingAt = new Date(startOfLocalDay(days - 1)).toISOString();

  const usageParams = new URLSearchParams({
    starting_at: startingAt,
    bucket_width: '1d',
    limit: String(days),
  });
  usageParams.append('group_by[]', 'model');

  const costParams = new URLSearchParams({
    starting_at: startingAt,
    bucket_width: '1d',
    limit: String(days),
  });
  costParams.append('group_by[]', 'description');

  if (config.apiWorkspaceId) {
    usageParams.append('workspace_ids[]', config.apiWorkspaceId);
  }

  try {
    const [usage, cost] = await Promise.all([
      adminGet(key, 'usage_report/messages', usageParams),
      adminGet(key, 'cost_report', costParams).catch(() => null),
    ]);

    const modelTotals = new Map<string, { tokens: number; cost: number }>();
    const dayTokens = new Map<string, number>();
    let cacheRead = 0;
    let cacheWriteAndInput = 0;
    let webSearchRequests = 0;

    for (const bucket of usage.data ?? []) {
      const day = String(bucket.starting_at).slice(0, 10);
      let bucketTokens = 0;
      for (const result of bucket.results ?? []) {
        const creation =
          (result.cache_creation?.ephemeral_1h_input_tokens ?? 0) +
          (result.cache_creation?.ephemeral_5m_input_tokens ?? 0);
        const uncached = result.uncached_input_tokens ?? 0;
        const read = result.cache_read_input_tokens ?? 0;
        const output = result.output_tokens ?? 0;
        const total = creation + uncached + read + output;

        bucketTokens += total;
        cacheRead += read;
        cacheWriteAndInput += creation + uncached;
        webSearchRequests += result.server_tool_use?.web_search_requests ?? 0;

        const model = result.model ?? 'unknown';
        const entry = modelTotals.get(model) ?? { tokens: 0, cost: 0 };
        entry.tokens += total;
        modelTotals.set(model, entry);
      }
      dayTokens.set(day, (dayTokens.get(day) ?? 0) + bucketTokens);
    }

    // cost_report amounts are decimal strings in cents.
    const dayCost = new Map<string, number>();
    for (const bucket of cost?.data ?? []) {
      const day = String(bucket.starting_at).slice(0, 10);
      for (const result of bucket.results ?? []) {
        const amount = Number(result.amount ?? 0) / 100;
        if (!Number.isFinite(amount)) continue;
        dayCost.set(day, (dayCost.get(day) ?? 0) + amount);
        if (result.model) {
          const entry = modelTotals.get(result.model) ?? { tokens: 0, cost: 0 };
          entry.cost += amount;
          modelTotals.set(result.model, entry);
        }
      }
    }

    const daily: ClaudeBucket[] = [...new Set([...dayTokens.keys(), ...dayCost.keys()])]
      .sort()
      .map((day) => ({
        label: day,
        tokens: dayTokens.get(day) ?? 0,
        costUsd: dayCost.get(day) ?? 0,
      }));

    const sum = (from: number) =>
      daily.slice(Math.max(0, daily.length - from)).reduce(
        (acc, bucket) => ({
          tokens: acc.tokens + bucket.tokens,
          costUsd: acc.costUsd + bucket.costUsd,
        }),
        { tokens: 0, costUsd: 0 }
      );

    const models: ClaudeModelSlice[] = [...modelTotals.entries()]
      .map(([model, totals]) => {
        const price = priceFor(model);
        return {
          model,
          displayName: price.label,
          colour: price.colour,
          totalTokens: totals.tokens,
          costUsd: totals.cost,
        };
      })
      .sort((a, b) => b.costUsd - a.costUsd || b.totalTokens - a.totalTokens);

    const cacheTotal = cacheRead + cacheWriteAndInput;

    return {
      available: true,
      reason: null,
      today: sum(1),
      last7Days: sum(7),
      last30Days: sum(daily.length),
      daily,
      models,
      webSearchRequests,
      cacheHitRate: cacheTotal > 0 ? (cacheRead / cacheTotal) * 100 : 0,
    };
  } catch (error) {
    return unavailableApi(error instanceof Error ? error.message : String(error));
  }
}

export async function buildClaudeData(
  parser: UsageParser,
  store: Store
): Promise<ClaudeData> {
  const config = store.getConfig().claude;
  const [subscription, api] = await Promise.all([
    Promise.resolve(buildSubscription(parser, config)),
    buildApi(store, config),
  ]);
  return { plan: config.plan, subscription, api, updatedAt: Date.now() };
}
