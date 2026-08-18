import React, { useState } from 'react';
import { useDashboard } from './hooks/useDashboard';
import { api } from './lib/api';
import { HeaderClock } from './components/HeaderClock';
import {
  IconCalendar,
  IconClose,
  IconGauge,
  IconGear,
  IconMail,
  IconMaximise,
  IconMinimise,
  IconOverview,
  IconPin,
  IconPrinter,
  IconPulse,
  IconReactor,
  IconRefresh,
  IconTasks,
} from './components/Icons';
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

const SECTIONS = [
  { id: 'top', label: 'Overview', Icon: IconOverview },
  { id: 'panel-weather', label: 'Weather', Icon: IconPulse },
  { id: 'panel-calendar', label: 'Schedule', Icon: IconCalendar },
  { id: 'panel-mail', label: 'Mail', Icon: IconMail },
  { id: 'panel-todos', label: 'Tasks', Icon: IconTasks },
  { id: 'panel-claude', label: 'Claude', Icon: IconReactor },
  { id: 'panel-printers', label: 'Printers', Icon: IconPrinter },
];

export function App() {
  const dashboard = useDashboard();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [section, setSection] = useState('top');

  const { config, data } = dashboard;

  const jumpTo = (id: string) => {
    setSection(id);
    const target = id === 'top' ? document.querySelector('.grid') : document.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const refreshAll = async () => {
    setRefreshing(true);
    try {
      await dashboard.refresh('all');
    } finally {
      setRefreshing(false);
    }
  };

  const runSpeedTest = async () => {
    setTesting(true);
    try {
      await api.runSpeedTest();
    } finally {
      setTesting(false);
    }
  };

  const setTodos = (todos: TodoData) => dashboard.setData((current) => ({ ...current, todos }));

  if (!dashboard.ready || !config) {
    return (
      <div className="app">
        <div className="panel__empty" style={{ gridColumn: 'span 2' }}>
          Initialising Command Centre…
        </div>
      </div>
    );
  }

  const pinned = config.general.alwaysOnTop;
  const togglePin = () =>
    void dashboard.saveConfig({ general: { ...config.general, alwaysOnTop: !pinned } });

  return (
    <div className="app">
      <nav className="rail">
        <div className="rail__mark" title="Command Centre" />
        {SECTIONS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`rail__btn${section === id ? ' rail__btn--on' : ''}`}
            title={label}
            onClick={() => jumpTo(id)}
          >
            <Icon />
          </button>
        ))}
        <div className="rail__spacer" />
        <button
          className={`rail__btn${pinned ? ' rail__btn--on' : ''}`}
          title="Keep above other windows"
          onClick={togglePin}
        >
          <IconPin />
        </button>
        <button className="rail__btn" title="Settings" onClick={() => setSettingsOpen(true)}>
          <IconGear />
        </button>
      </nav>

      <div className="main">
        <header className="hud-head">
          <HeaderClock
            use24h={config.general.clockFormat24h}
            showSeconds={config.general.showSeconds}
            operator={config.general.operatorName || 'Sir'}
          />
          <div className="hud-head__win">
            <button
              className="btn btn--icon"
              title="Minimise"
              onClick={() => void api.window.minimize()}
            >
              <IconMinimise />
            </button>
            <button
              className="btn btn--icon"
              title="Maximise"
              onClick={() => void api.window.toggleMaximize()}
            >
              <IconMaximise />
            </button>
            <button
              className="btn btn--icon btn--danger"
              title="Close"
              onClick={() => void api.window.close()}
            >
              <IconClose />
            </button>
          </div>
        </header>

        <main className="grid">
          <div className="span-3 row-2" id="panel-weather">
            <WeatherPanel weather={data.weather} error={dashboard.errors.weather} />
          </div>
          <div className="span-5 row-2">
            <ForecastPanel weather={data.weather} error={dashboard.errors.weather} />
          </div>
          <div className="span-4 row-2" id="panel-network">
            <NetworkPanel network={data.network} />
          </div>

          <div className="span-4 row-2" id="panel-calendar">
            <CalendarPanel
              calendar={data.calendar}
              error={dashboard.errors.calendar}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          </div>
          <div className="span-4 row-2" id="panel-mail">
            <MailPanel
              mail={data.mail}
              error={dashboard.errors.mail}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          </div>
          <div className="span-4 row-2" id="panel-todos">
            <TodoPanel todos={data.todos} onChange={setTodos} />
          </div>

          <div className="span-7 row-2" id="panel-claude">
            <ClaudePanel claude={data.claude} error={dashboard.errors.claude} />
          </div>
          <div className="span-5 row-2" id="panel-printers">
            <PrintersPanel
              printers={data.printers}
              error={dashboard.errors.printers}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          </div>
        </main>

        <div className="dock">
          <div className="dock__inner">
            <button
              className="dock__btn"
              disabled={refreshing}
              onClick={() => void refreshAll()}
            >
              <IconRefresh size={15} />
              {refreshing ? 'Syncing' : 'Sync all'}
            </button>
            <button className="dock__btn" disabled={testing} onClick={() => void runSpeedTest()}>
              <IconGauge size={15} />
              {testing ? 'Testing' : 'Speed test'}
            </button>
            <div className="dock__sep" />
            <button
              className={`dock__btn${pinned ? ' dock__btn--on' : ''}`}
              onClick={togglePin}
            >
              <IconPin size={15} />
              {pinned ? 'Pinned' : 'Pin'}
            </button>
            <button className="dock__btn" onClick={() => setSettingsOpen(true)}>
              <IconGear size={15} />
              Settings
            </button>
          </div>
        </div>
      </div>

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
          <b>{dashboard.lastError.channel} fault</b>
          <div>{dashboard.lastError.message}</div>
        </div>
      ) : null}
    </div>
  );
}
