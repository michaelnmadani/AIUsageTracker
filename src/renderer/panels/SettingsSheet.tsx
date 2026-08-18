import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type {
  AppConfig,
  BambuPrinterConfig,
  ClaudePlan,
  ElegooPrinterConfig,
  ElegooProtocol,
  GeocodeResult,
} from '../../shared/types';

type Tab = 'general' | 'glass' | 'weather' | 'network' | 'google' | 'claude' | 'printers';

const TABS: { id: Tab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'glass', label: 'Glass' },
  { id: 'weather', label: 'Weather' },
  { id: 'network', label: 'Network' },
  { id: 'google', label: 'Google' },
  { id: 'claude', label: 'Claude' },
  { id: 'printers', label: 'Printers' },
];

interface Props {
  config: AppConfig;
  secrets: Record<string, boolean>;
  onSaveConfig: (patch: Partial<AppConfig>) => Promise<void>;
  onSaveSecret: (key: string, value: string) => Promise<void>;
  onClose: () => void;
}

function newId(): string {
  return globalThis.crypto.randomUUID();
}

export function SettingsSheet({ config, secrets, onSaveConfig, onSaveSecret, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('general');
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const run = async (label: string, action: () => Promise<void>) => {
    setBusy(label);
    setNote(null);
    try {
      await action();
    } catch (error) {
      setNote(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(event) => event.stopPropagation()}>
        <header className="sheet__head">
          <h2 className="sheet__title">Settings</h2>
          <div style={{ flex: 1 }} />
          <button className="btn" onClick={onClose}>
            Done
          </button>
        </header>

        <nav className="sheet__nav">
          {TABS.map((item) => (
            <button
              key={item.id}
              className={`btn${tab === item.id ? ' btn--primary' : ''}`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sheet__body">
          {note ? (
            <div className="card" style={{ borderColor: 'rgba(239,111,124,0.4)', color: '#ffd9dd' }}>
              {note}
            </div>
          ) : null}

          {tab === 'general' ? <GeneralTab config={config} onSave={onSaveConfig} /> : null}
          {tab === 'glass' ? <GlassTab config={config} onSave={onSaveConfig} /> : null}
          {tab === 'weather' ? <WeatherTab config={config} onSave={onSaveConfig} /> : null}
          {tab === 'network' ? <NetworkTab config={config} onSave={onSaveConfig} /> : null}
          {tab === 'google' ? (
            <GoogleTab config={config} secrets={secrets} onSave={onSaveConfig} onSaveSecret={onSaveSecret} busy={busy} run={run} />
          ) : null}
          {tab === 'claude' ? (
            <ClaudeTab config={config} secrets={secrets} onSave={onSaveConfig} onSaveSecret={onSaveSecret} />
          ) : null}
          {tab === 'printers' ? <PrintersTab config={config} onSave={onSaveConfig} /> : null}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- general */

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="row" style={{ cursor: 'pointer', marginBottom: 10 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
      />
      <span style={{ fontSize: 13 }}>{label}</span>
    </label>
  );
}

function GeneralTab({
  config,
  onSave,
}: {
  config: AppConfig;
  onSave: (patch: Partial<AppConfig>) => Promise<void>;
}) {
  const save = (patch: Partial<AppConfig['general']>) =>
    void onSave({ general: { ...config.general, ...patch } });

  return (
    <div className="card">
      <div className="card__head">
        <span className="card__title">Window &amp; clock</span>
      </div>
      <div className="field">
        <span className="field__label">Address me as</span>
        <input
          defaultValue={config.general.operatorName}
          placeholder="Sir"
          onBlur={(event) => save({ operatorName: event.target.value })}
        />
        <span className="field__hint">Used by the greeting in the header.</span>
      </div>
      <Toggle
        label="Keep the window above everything else"
        checked={config.general.alwaysOnTop}
        onChange={(alwaysOnTop) => save({ alwaysOnTop })}
      />
      <Toggle
        label="24-hour clock"
        checked={config.general.clockFormat24h}
        onChange={(clockFormat24h) => save({ clockFormat24h })}
      />
      <Toggle
        label="Show seconds"
        checked={config.general.showSeconds}
        onChange={(showSeconds) => save({ showSeconds })}
      />
    </div>
  );
}

function GlassTab({
  config,
  onSave,
}: {
  config: AppConfig;
  onSave: (patch: Partial<AppConfig>) => Promise<void>;
}) {
  const save = (patch: Partial<AppConfig['general']>) =>
    void onSave({ general: { ...config.general, ...patch } });
  const [pendingRestart, setPendingRestart] = useState(false);

  return (
    <div className="card">
      <div className="card__head">
        <span className="card__title">See-through window</span>
      </div>

      <Toggle
        label="Let the desktop show through the app"
        checked={config.general.transparentWindow}
        onChange={(transparentWindow) => {
          save({ transparentWindow });
          setPendingRestart(true);
        }}
      />
      <div className="field__hint" style={{ marginBottom: 12 }}>
        The window has to be created transparent, so this one takes effect on the next
        launch. Transparent windows are frameless — drag the header or the left rail to
        move the window.
      </div>
      {pendingRestart ? (
        <button
          className="btn btn--primary"
          style={{ marginBottom: 14 }}
          onClick={() => void api.relaunch()}
        >
          Restart now
        </button>
      ) : null}

      <div className="field">
        <span className="field__label">
          Panel opacity — {Math.round(config.general.glassOpacity * 100)}%
        </span>
        <input
          type="range"
          min={0}
          max={95}
          value={Math.round(config.general.glassOpacity * 100)}
          onChange={(event) => save({ glassOpacity: Number(event.target.value) / 100 })}
        />
        <span className="field__hint">
          Applies live to every panel, the rail and the dock. Lower for more wallpaper,
          higher if text is getting lost against a busy background.
        </span>
      </div>

      <Toggle
        label="Draw the HUD grid over the desktop"
        checked={config.general.showGridOverlay}
        onChange={(showGridOverlay) => save({ showGridOverlay })}
      />
    </div>
  );
}

/* ------------------------------------------------------------- weather */

function WeatherTab({
  config,
  onSave,
}: {
  config: AppConfig;
  onSave: (patch: Partial<AppConfig>) => Promise<void>;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);

  const search = async (event: React.FormEvent) => {
    event.preventDefault();
    setSearching(true);
    try {
      setResults(await api.searchLocations(query));
    } finally {
      setSearching(false);
    }
  };

  const choose = (result: GeocodeResult) => {
    const parts = [result.name, result.admin1, result.country].filter(Boolean);
    void onSave({
      weather: {
        ...config.weather,
        latitude: result.latitude,
        longitude: result.longitude,
        locationName: parts.join(', '),
      },
    });
    setResults([]);
    setQuery('');
  };

  return (
    <>
      <div className="card">
        <div className="card__head">
          <span className="card__title">Location</span>
          <span className="field__hint">{config.weather.locationName}</span>
        </div>
        <form onSubmit={search} className="row" style={{ marginBottom: 10 }}>
          <input
            placeholder="Search a town or city…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="btn btn--primary" type="submit" disabled={searching}>
            {searching ? 'Searching…' : 'Search'}
          </button>
        </form>
        <div className="results">
          {results.map((result) => (
            <button key={`${result.latitude},${result.longitude}`} onClick={() => choose(result)}>
              {[result.name, result.admin1, result.country].filter(Boolean).join(', ')}
            </button>
          ))}
        </div>
        <div className="field__hint">
          Forecasts come from Open-Meteo, which needs no API key.
        </div>
      </div>

      <div className="card">
        <div className="card__head">
          <span className="card__title">Units</span>
        </div>
        <select
          value={config.weather.units}
          onChange={(event) =>
            void onSave({
              weather: { ...config.weather, units: event.target.value as 'metric' | 'imperial' },
            })
          }
        >
          <option value="metric">Metric (°C, km/h, mm)</option>
          <option value="imperial">Imperial (°F, mph, in)</option>
        </select>
      </div>
    </>
  );
}

/* ------------------------------------------------------------- network */

function NetworkTab({
  config,
  onSave,
}: {
  config: AppConfig;
  onSave: (patch: Partial<AppConfig>) => Promise<void>;
}) {
  const [interfaces, setInterfaces] = useState<string[]>([]);

  useEffect(() => {
    void api.listInterfaces().then(setInterfaces);
  }, []);

  return (
    <div className="card">
      <div className="card__head">
        <span className="card__title">Throughput meter</span>
      </div>
      <div className="field">
        <span className="field__label">Interface</span>
        <select
          value={config.network.interfaceName ?? ''}
          onChange={(event) =>
            void onSave({
              network: { ...config.network, interfaceName: event.target.value || null },
            })
          }
        >
          <option value="">All interfaces combined</option>
          {interfaces.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <span className="field__hint">
          Live speeds come from the OS byte counters, sampled once a second.
        </span>
      </div>
      <div className="field">
        <span className="field__label">Speed test size (MB)</span>
        <input
          type="number"
          min={1}
          max={200}
          value={Math.round(config.network.speedTestBytes / 1e6)}
          onChange={(event) =>
            void onSave({
              network: {
                ...config.network,
                speedTestBytes: Math.max(1, Number(event.target.value)) * 1e6,
              },
            })
          }
        />
        <span className="field__hint">Bandwidth tests download and upload against Cloudflare.</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- google */

function GoogleTab({
  config,
  secrets,
  onSave,
  onSaveSecret,
  busy,
  run,
}: {
  config: AppConfig;
  secrets: Record<string, boolean>;
  onSave: (patch: Partial<AppConfig>) => Promise<void>;
  onSaveSecret: (key: string, value: string) => Promise<void>;
  busy: string | null;
  run: (label: string, action: () => Promise<void>) => Promise<void>;
}) {
  const [clientId, setClientId] = useState(config.google.clientId);
  const [clientSecret, setClientSecret] = useState('');

  return (
    <>
      <div className="card">
        <div className="card__head">
          <span className="card__title">OAuth client</span>
        </div>
        <div className="field">
          <span className="field__label">Client ID</span>
          <input value={clientId} onChange={(event) => setClientId(event.target.value)} />
        </div>
        <div className="field">
          <span className="field__label">
            Client secret {secrets.googleClientSecret ? '(saved)' : ''}
          </span>
          <input
            type="password"
            placeholder={secrets.googleClientSecret ? '••••••••' : 'From the Google Cloud console'}
            value={clientSecret}
            onChange={(event) => setClientSecret(event.target.value)}
          />
        </div>
        <button
          className="btn btn--primary"
          onClick={() =>
            void run('client', async () => {
              await onSave({ google: { ...config.google, clientId: clientId.trim() } });
              if (clientSecret) {
                await onSaveSecret('googleClientSecret', clientSecret.trim());
                setClientSecret('');
              }
            })
          }
        >
          Save client
        </button>
        <div className="field__hint" style={{ marginTop: 10 }}>
          Create a <b>Desktop app</b> OAuth client in the Google Cloud console, enable the Gmail and
          Calendar APIs, and add yourself as a test user. The app signs in through your browser and
          only ever requests read-only scopes.
        </div>
      </div>

      <div className="card">
        <div className="card__head">
          <span className="card__title">Accounts</span>
          <div style={{ flex: 1 }} />
          <button
            className="btn btn--primary"
            disabled={busy === 'connect'}
            onClick={() =>
              void run('connect', async () => {
                await api.connectGoogle();
              })
            }
          >
            {busy === 'connect' ? 'Waiting for browser…' : 'Connect account'}
          </button>
        </div>

        {config.google.accounts.length === 0 ? (
          <div className="field__hint">
            No accounts yet. Connect both of your Google accounts to merge their mail and calendars.
          </div>
        ) : (
          config.google.accounts.map((account) => (
            <div key={account.id} className="card" style={{ marginBottom: 8 }}>
              <div className="card__head">
                <span className="card__title">{account.email}</span>
                <div style={{ flex: 1 }} />
                <button
                  className="btn btn--danger"
                  onClick={() => void run('disconnect', async () => void (await api.disconnectGoogle(account.id)))}
                >
                  Disconnect
                </button>
              </div>
              <div className="field-row">
                <div className="field">
                  <span className="field__label">Label</span>
                  <input
                    defaultValue={account.label}
                    onBlur={(event) =>
                      void onSave({
                        google: {
                          ...config.google,
                          accounts: config.google.accounts.map((a) =>
                            a.id === account.id ? { ...a, label: event.target.value } : a
                          ),
                        },
                      })
                    }
                  />
                </div>
                <div className="field">
                  <span className="field__label">Important-mail search</span>
                  <input
                    defaultValue={account.mailQuery}
                    onBlur={(event) =>
                      void onSave({
                        google: {
                          ...config.google,
                          accounts: config.google.accounts.map((a) =>
                            a.id === account.id ? { ...a, mailQuery: event.target.value } : a
                          ),
                        },
                      })
                    }
                  />
                </div>
              </div>
              <Toggle
                label="Include this account"
                checked={account.enabled}
                onChange={(enabled) =>
                  void onSave({
                    google: {
                      ...config.google,
                      accounts: config.google.accounts.map((a) =>
                        a.id === account.id ? { ...a, enabled } : a
                      ),
                    },
                  })
                }
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}

/* -------------------------------------------------------------- claude */

function ClaudeTab({
  config,
  secrets,
  onSave,
  onSaveSecret,
}: {
  config: AppConfig;
  secrets: Record<string, boolean>;
  onSave: (patch: Partial<AppConfig>) => Promise<void>;
  onSaveSecret: (key: string, value: string) => Promise<void>;
}) {
  const [adminKey, setAdminKey] = useState('');
  const save = (patch: Partial<AppConfig['claude']>) =>
    void onSave({ claude: { ...config.claude, ...patch } });

  return (
    <>
      <div className="card">
        <div className="card__head">
          <span className="card__title">Subscription (Pro / Max)</span>
        </div>
        <div className="field-row">
          <div className="field">
            <span className="field__label">Plan</span>
            <select
              value={config.claude.plan}
              onChange={(event) => save({ plan: event.target.value as ClaudePlan })}
            >
              <option value="pro">Pro</option>
              <option value="max5">Max 5×</option>
              <option value="max20">Max 20×</option>
              <option value="team">Team</option>
              <option value="api">API only</option>
            </select>
          </div>
          <div className="field">
            <span className="field__label">Rolling window (hours)</span>
            <input
              type="number"
              min={1}
              max={24}
              value={config.claude.sessionWindowHours}
              onChange={(event) => save({ sessionWindowHours: Number(event.target.value) || 5 })}
            />
          </div>
          <div className="field">
            <span className="field__label">Window budget (million tokens)</span>
            <input
              type="number"
              min={1}
              value={Math.round(config.claude.windowTokenBudget / 1e6)}
              onChange={(event) =>
                save({ windowTokenBudget: Math.max(1, Number(event.target.value)) * 1e6 })
              }
            />
          </div>
        </div>
        <div className="field__hint">
          Subscription figures are reconstructed from the Claude Code transcripts under{' '}
          <code>~/.claude</code>. Anthropic doesn&apos;t publish plan limits as numbers, so the
          budget above is your own yardstick for the progress bar.
        </div>
      </div>

      <div className="card">
        <div className="card__head">
          <span className="card__title">API spend</span>
        </div>
        <Toggle
          label="Pull real usage and cost from the Anthropic Admin API"
          checked={config.claude.apiUsageEnabled}
          onChange={(apiUsageEnabled) => save({ apiUsageEnabled })}
        />
        <div className="field">
          <span className="field__label">
            Admin API key {secrets.anthropicAdminKey ? '(saved)' : ''}
          </span>
          <input
            type="password"
            placeholder={secrets.anthropicAdminKey ? '••••••••' : 'sk-ant-admin01-…'}
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
          />
        </div>
        <div className="field">
          <span className="field__label">Workspace ID (optional)</span>
          <input
            defaultValue={config.claude.apiWorkspaceId}
            placeholder="wrkspc_…"
            onBlur={(event) => save({ apiWorkspaceId: event.target.value.trim() })}
          />
        </div>
        <button
          className="btn btn--primary"
          onClick={async () => {
            if (adminKey.trim()) {
              await onSaveSecret('anthropicAdminKey', adminKey.trim());
              setAdminKey('');
            }
          }}
        >
          Save key
        </button>
        <div className="field__hint" style={{ marginTop: 10 }}>
          Uses the Usage &amp; Cost Admin API (<code>/v1/organizations/usage_report/messages</code>{' '}
          and <code>/v1/organizations/cost_report</code>), which needs an Admin key from the Claude
          Console. Individual accounts without an organisation can&apos;t issue one — the panel will
          say so rather than guess.
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------ printers */

function PrintersTab({
  config,
  onSave,
}: {
  config: AppConfig;
  onSave: (patch: Partial<AppConfig>) => Promise<void>;
}) {
  const [codes, setCodes] = useState<Record<string, string>>({});

  const saveBambu = (printers: BambuPrinterConfig[]) =>
    void onSave({ printers: { ...config.printers, bambu: printers } });
  const saveElegoo = (printers: ElegooPrinterConfig[]) =>
    void onSave({ printers: { ...config.printers, elegoo: printers } });

  const patchBambu = (id: string, patch: Partial<BambuPrinterConfig>) =>
    saveBambu(config.printers.bambu.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const patchElegoo = (id: string, patch: Partial<ElegooPrinterConfig>) =>
    saveElegoo(config.printers.elegoo.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  return (
    <>
      <div className="card">
        <div className="card__head">
          <span className="card__title">Bambu Lab</span>
          <div style={{ flex: 1 }} />
          <button
            className="btn btn--primary"
            onClick={() =>
              saveBambu([
                ...config.printers.bambu,
                { id: newId(), name: 'Bambu printer', host: '', serial: '', enabled: true },
              ])
            }
          >
            Add printer
          </button>
        </div>

        {config.printers.bambu.map((printer) => (
          <div key={printer.id} className="card" style={{ marginBottom: 8 }}>
            <div className="field-row">
              <div className="field">
                <span className="field__label">Name</span>
                <input
                  defaultValue={printer.name}
                  onBlur={(event) => patchBambu(printer.id, { name: event.target.value })}
                />
              </div>
              <div className="field">
                <span className="field__label">IP address</span>
                <input
                  defaultValue={printer.host}
                  placeholder="192.168.1.50"
                  onBlur={(event) => patchBambu(printer.id, { host: event.target.value.trim() })}
                />
              </div>
              <div className="field">
                <span className="field__label">Serial number</span>
                <input
                  defaultValue={printer.serial}
                  placeholder="01P00A…"
                  onBlur={(event) => patchBambu(printer.id, { serial: event.target.value.trim() })}
                />
              </div>
              <div className="field">
                <span className="field__label">LAN access code</span>
                <div className="row">
                  <input
                    type="password"
                    placeholder="8 characters"
                    value={codes[printer.id] ?? ''}
                    onChange={(event) =>
                      setCodes({ ...codes, [printer.id]: event.target.value })
                    }
                  />
                  <button
                    className="btn"
                    onClick={() =>
                      void api
                        .setPrinterAccessCode(printer.id, (codes[printer.id] ?? '').trim())
                        .then(() => setCodes({ ...codes, [printer.id]: '' }))
                    }
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <Toggle
                label="Enabled"
                checked={printer.enabled}
                onChange={(enabled) => patchBambu(printer.id, { enabled })}
              />
              <div style={{ flex: 1 }} />
              <button
                className="btn btn--danger"
                onClick={() => saveBambu(config.printers.bambu.filter((p) => p.id !== printer.id))}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="field__hint">
          Turn on <b>LAN Only Mode</b> on the printer, then copy its IP, serial and access code from
          the network settings screen. Command Centre subscribes to the printer&apos;s MQTT feed
          directly — nothing goes through Bambu Cloud.
        </div>
      </div>

      <div className="card">
        <div className="card__head">
          <span className="card__title">Elegoo</span>
          <div style={{ flex: 1 }} />
          <button
            className="btn btn--primary"
            onClick={() =>
              saveElegoo([
                ...config.printers.elegoo,
                {
                  id: newId(),
                  name: 'Elegoo printer',
                  host: '',
                  protocol: 'sdcp',
                  port: 3030,
                  enabled: true,
                },
              ])
            }
          >
            Add printer
          </button>
        </div>

        {config.printers.elegoo.map((printer) => (
          <div key={printer.id} className="card" style={{ marginBottom: 8 }}>
            <div className="field-row">
              <div className="field">
                <span className="field__label">Name</span>
                <input
                  defaultValue={printer.name}
                  onBlur={(event) => patchElegoo(printer.id, { name: event.target.value })}
                />
              </div>
              <div className="field">
                <span className="field__label">IP address</span>
                <input
                  defaultValue={printer.host}
                  placeholder="192.168.1.60"
                  onBlur={(event) => patchElegoo(printer.id, { host: event.target.value.trim() })}
                />
              </div>
              <div className="field">
                <span className="field__label">Protocol</span>
                <select
                  value={printer.protocol}
                  onChange={(event) => {
                    const protocol = event.target.value as ElegooProtocol;
                    patchElegoo(printer.id, {
                      protocol,
                      port: protocol === 'sdcp' ? 3030 : 7125,
                    });
                  }}
                >
                  <option value="sdcp">SDCP — Centauri / Saturn / Mars</option>
                  <option value="moonraker">Moonraker — Neptune 4 (Klipper)</option>
                </select>
              </div>
              <div className="field">
                <span className="field__label">Port</span>
                <input
                  type="number"
                  defaultValue={printer.port}
                  onBlur={(event) =>
                    patchElegoo(printer.id, { port: Number(event.target.value) || 3030 })
                  }
                />
              </div>
            </div>
            <div className="row">
              <Toggle
                label="Enabled"
                checked={printer.enabled}
                onChange={(enabled) => patchElegoo(printer.id, { enabled })}
              />
              <div style={{ flex: 1 }} />
              <button
                className="btn btn--danger"
                onClick={() =>
                  saveElegoo(config.printers.elegoo.filter((p) => p.id !== printer.id))
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="field__hint">
          SDCP printers are discovered over UDP on port 3000 and then polled over the websocket on
          3030. Neptune 4 machines expose Moonraker on 7125 instead.
        </div>
      </div>
    </>
  );
}
