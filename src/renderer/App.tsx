import React, { useState } from 'react';
import { useDashboard } from './hooks/useDashboard';
import { api } from './lib/api';
import { ClockPanel } from './panels/ClockPanel';
import { WeatherPanel } from './panels/WeatherPanel';
import { ForecastPanel } from './panels/ForecastPanel';
import { TodoPanel } from './panels/TodoPanel';
import { NetworkPanel } from './panels/NetworkPanel';
import { MailPanel } from './panels/MailPanel';
import { CalendarPanel } from './panels/CalendarPanel';
import { ClaudePanel } from './panels/ClaudePanel';
import { PrintersPanel } from './panels/PrintersPanel';
import { SettingsSheet } from './panels/SettingsSheet';
import type { TodoData } from '../shared/types';

export function App() {
  const dashboard = useDashboard();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { config, data } = dashboard;

  const refreshAll = async () => {
    setRefreshing(true);
    try {
      await dashboard.refresh('all');
    } finally {
      setRefreshing(false);
    }
  };

  const setTodos = (todos: TodoData) =>
    dashboard.setData((current) => ({ ...current, todos }));

  if (!dashboard.ready || !config) {
    return (
      <div className="app">
        <div className="panel__empty">Starting Command Centre…</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          Command Centre <span>{config.weather.locationName}</span>
        </div>
        <div className="topbar__spacer" />
        <div className="topbar__actions">
          <button className="btn" onClick={() => void refreshAll()} disabled={refreshing}>
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
          <button className="btn" onClick={() => setSettingsOpen(true)}>
            Settings
          </button>
          <button
            className="btn btn--icon"
            title="Minimise"
            onClick={() => void api.window.minimize()}
          >
            —
          </button>
          <button
            className="btn btn--icon"
            title="Maximise"
            onClick={() => void api.window.toggleMaximize()}
          >
            ▢
          </button>
          <button
            className="btn btn--icon btn--danger"
            title="Close"
            onClick={() => void api.window.close()}
          >
            ✕
          </button>
        </div>
      </header>

      <main className="grid">
        <div className="span-3">
          <ClockPanel
            use24h={config.general.clockFormat24h}
            showSeconds={config.general.showSeconds}
          />
        </div>
        <div className="span-3">
          <WeatherPanel weather={data.weather} error={dashboard.errors.weather} />
        </div>
        <div className="span-6">
          <NetworkPanel network={data.network} />
        </div>

        <div className="span-12">
          <ForecastPanel weather={data.weather} error={dashboard.errors.weather} />
        </div>

        <div className="span-4 row-2">
          <CalendarPanel
            calendar={data.calendar}
            error={dashboard.errors.calendar}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>
        <div className="span-4 row-2">
          <MailPanel
            mail={data.mail}
            error={dashboard.errors.mail}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>
        <div className="span-4 row-2">
          <TodoPanel todos={data.todos} onChange={setTodos} />
        </div>

        <div className="span-7 row-2">
          <ClaudePanel claude={data.claude} error={dashboard.errors.claude} />
        </div>
        <div className="span-5 row-2">
          <PrintersPanel
            printers={data.printers}
            error={dashboard.errors.printers}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>
      </main>

      {settingsOpen ? (
        <SettingsSheet
          config={config}
          secrets={dashboard.secrets}
          onSaveConfig={dashboard.saveConfig}
          onSaveSecret={dashboard.saveSecret}
          onClose={() => setSettingsOpen(false)}
        />
      ) : null}

      {dashboard.lastError ? (
        <div className="toast" onClick={dashboard.dismissError}>
          <b>{dashboard.lastError.channel}</b>: {dashboard.lastError.message}
        </div>
      ) : null}
    </div>
  );
}
