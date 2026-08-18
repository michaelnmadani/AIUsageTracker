import React, { useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Empty, Panel } from '../components/Panel';
import { ProgressRing } from '../components/ProgressRing';
import { compactNumber, duration, money, relativeTime } from '../lib/format';
import type { ClaudeData, ClaudeModelSlice } from '../../shared/types';

const PLAN_LABEL: Record<string, string> = {
  pro: 'Pro',
  max5: 'Max 5×',
  max20: 'Max 20×',
  team: 'Team',
  api: 'API only',
};

function ModelList({ models }: { models: ClaudeModelSlice[] }) {
  if (models.length === 0) return null;
  return (
    <div style={{ marginTop: 12 }}>
      <div className="stat__label" style={{ marginBottom: 4 }}>
        By model
      </div>
      {models.slice(0, 5).map((model) => (
        <div className="model-row" key={model.model}>
          <span className="model-row__swatch" style={{ background: model.colour }} />
          <span className="model-row__name">{model.displayName}</span>
          <span className="model-row__value">{compactNumber(model.totalTokens)}</span>
          <span className="model-row__value" style={{ color: 'var(--text-faint)', width: 62, textAlign: 'right' }}>
            {money(model.costUsd)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ClaudePanel({
  claude,
  error,
}: {
  claude: ClaudeData | null;
  error?: string | null;
}) {
  const [tab, setTab] = useState<'subscription' | 'api'>('subscription');

  if (!claude) {
    return (
      <Panel title="Claude usage" problem={error}>
        <Empty>{error ?? 'Reading Claude Code transcripts…'}</Empty>
      </Panel>
    );
  }

  const { subscription, api } = claude;
  const windowRemaining = subscription.window.endsAt
    ? Math.max(0, subscription.window.endsAt - Date.now()) / 1000
    : null;

  const chartData =
    tab === 'subscription'
      ? subscription.hourly.map((bucket) => ({ label: bucket.label, value: bucket.tokens }))
      : api.daily.map((bucket) => ({ label: bucket.label.slice(5), value: bucket.costUsd }));

  return (
    <Panel
      title="Claude usage"
      problem={error}
      pulse={claude.updatedAt}
      meta={
        <>
          <span className="tag">{PLAN_LABEL[claude.plan] ?? claude.plan}</span>
          {subscription.isActive ? (
            <>
              <span className="dot dot--live" />
              <span>live</span>
            </>
          ) : (
            <span>{relativeTime(claude.updatedAt)}</span>
          )}
          <div className="claude__tabs">
            <button
              className={`claude__tab${tab === 'subscription' ? ' claude__tab--active' : ''}`}
              onClick={() => setTab('subscription')}
            >
              Pro / Max
            </button>
            <button
              className={`claude__tab${tab === 'api' ? ' claude__tab--active' : ''}`}
              onClick={() => setTab('api')}
            >
              API
            </button>
          </div>
        </>
      }
    >
      {tab === 'subscription' ? (
        !subscription.available ? (
          <Empty>{subscription.reason}</Empty>
        ) : (
          <>
            <div className="row" style={{ gap: 16, alignItems: 'center', marginBottom: 10 }}>
              <ProgressRing
                size={104}
                stroke={6}
                progress={subscription.window.percentUsed}
                active={subscription.isActive}
                colour={subscription.window.percentUsed > 85 ? 'var(--amber)' : 'var(--hud)'}
                sublabel={`${subscription.window.hours}h window`}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
            <div className="claude__stats">
              <div className="stat">
                <div className="stat__value">{compactNumber(subscription.window.tokens)}</div>
                <div className="stat__label">{subscription.window.hours}h window</div>
              </div>
              <div className="stat">
                <div className="stat__value">{compactNumber(subscription.today.tokens)}</div>
                <div className="stat__label">Today · {subscription.today.messages} msgs</div>
              </div>
              <div className="stat">
                <div className="stat__value">{money(subscription.last7Days.costUsd)}</div>
                <div className="stat__label">7-day equivalent</div>
              </div>
              <div className="stat">
                <div className="stat__value">{compactNumber(subscription.tokensPerMinute)}</div>
                <div className="stat__label">Tokens / min</div>
              </div>
            </div>

            <div className="row" style={{ gap: 8, marginBottom: 6 }}>
              <div className="bar" style={{ flex: 1 }}>
                <div
                  className="bar__fill"
                  style={{
                    width: `${subscription.window.percentUsed}%`,
                    background:
                      subscription.window.percentUsed > 85
                        ? 'linear-gradient(90deg, var(--warn), var(--bad))'
                        : undefined,
                  }}
                />
              </div>
              <span className="item__side">
                {Math.round(subscription.window.percentUsed)}% of budget
              </span>
            </div>
            <div className="item__sub">
              {windowRemaining !== null
                ? `Window resets in ${duration(windowRemaining)}`
                : 'No activity in the current window'}
              {subscription.activeProject ? ` · ${subscription.activeProject}` : ''}
            </div>
              </div>
            </div>

            {chartData.length > 0 ? (
              <div style={{ height: 90, marginTop: 12 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#4d7188', fontSize: 9, fontFamily: 'var(--mono)' }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(94,214,255,0.07)' }}
                      contentStyle={{
                        background: 'rgba(8, 19, 31, 0.9)',
                        border: '1px solid rgba(94,214,255,0.35)',
                        borderRadius: 3,
                        fontFamily: 'var(--mono)',
                        fontSize: 11,
                      }}
                      formatter={(value: number) => [compactNumber(value), 'Tokens']}
                    />
                    <Bar dataKey="value" radius={[1, 1, 0, 0]} animationDuration={700}>
                      {chartData.map((_, index) => (
                        <Cell key={index} fill="#5ed6ff" fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : null}

            <ModelList models={subscription.models} />

            {subscription.topProjects.length > 0 ? (
              <div style={{ marginTop: 12 }}>
                <div className="stat__label" style={{ marginBottom: 4 }}>
                  Top projects (7 days)
                </div>
                {subscription.topProjects.map((project) => (
                  <div className="model-row" key={project.name}>
                    <span className="model-row__name">{project.name}</span>
                    <span className="model-row__value">{compactNumber(project.tokens)}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )
      ) : !api.available ? (
        <Empty>
          {api.reason ??
            'API usage is off. Enable it in Settings → Claude and add an Admin API key to pull real spend.'}
        </Empty>
      ) : (
        <>
          <div className="claude__stats">
            <div className="stat">
              <div className="stat__value">{money(api.today.costUsd)}</div>
              <div className="stat__label">Today</div>
            </div>
            <div className="stat">
              <div className="stat__value">{money(api.last7Days.costUsd)}</div>
              <div className="stat__label">7 days</div>
            </div>
            <div className="stat">
              <div className="stat__value">{money(api.last30Days.costUsd)}</div>
              <div className="stat__label">30 days</div>
            </div>
            <div className="stat">
              <div className="stat__value">{Math.round(api.cacheHitRate)}%</div>
              <div className="stat__label">Cache hits</div>
            </div>
          </div>

          {chartData.length > 0 ? (
            <div style={{ height: 100 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#4d7188', fontSize: 9, fontFamily: 'var(--mono)' }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(94,214,255,0.07)' }}
                    contentStyle={{
                      background: 'rgba(8, 19, 31, 0.9)',
                      border: '1px solid rgba(94,214,255,0.35)',
                      borderRadius: 3,
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                    }}
                    formatter={(value: number) => [money(value), 'Spend']}
                  />
                  <Bar dataKey="value" radius={[1, 1, 0, 0]} animationDuration={700}>
                    {chartData.map((_, index) => (
                      <Cell key={index} fill="#ffb547" fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : null}

          <ModelList models={api.models} />

          <div className="item__sub" style={{ marginTop: 10 }}>
            {compactNumber(api.last30Days.tokens)} tokens over 30 days
            {api.webSearchRequests > 0 ? ` · ${api.webSearchRequests} web searches` : ''}
          </div>
        </>
      )}
    </Panel>
  );
}
