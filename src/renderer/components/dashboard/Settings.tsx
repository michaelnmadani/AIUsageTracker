import React, { useState, useEffect } from 'react';
import type { DiagnosticInfo, SettingsInfo } from '../../types/usage';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsInfo | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [customPathInput, setCustomPathInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!window.usageAPI) return;
    const [settingsData, diagData] = await Promise.all([
      window.usageAPI.getSettings(),
      window.usageAPI.getDiagnostics(),
    ]);
    setSettings(settingsData);
    setDiagnostics(diagData);
    if (settingsData.customPaths.length > 0) {
      setCustomPathInput(settingsData.customPaths.join('\n'));
    }
  };

  const handleSaveApiKey = async () => {
    if (!window.usageAPI) return;
    setSaving(true);
    setMessage(null);

    const key = apiKeyInput.trim() || null;
    const result = await window.usageAPI.setApiKey(key);

    if (result.success) {
      setMessage({
        text: key
          ? `API key saved. Fetched ${result.fetched || 0} usage entries.`
          : 'API key removed.',
        type: 'success',
      });
      setApiKeyInput('');
      loadData();
    } else {
      setMessage({ text: result.error || 'Failed to save API key', type: 'error' });
    }
    setSaving(false);
  };

  const handleSaveCustomPaths = async () => {
    if (!window.usageAPI) return;
    const paths = customPathInput
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    await window.usageAPI.setCustomPaths(paths);
    setMessage({ text: 'Custom paths saved. Data re-scanned.', type: 'success' });
    loadData();
  };

  const handleRefresh = async () => {
    if (!window.usageAPI) return;
    setSaving(true);
    await window.usageAPI.refresh();
    await loadData();
    setMessage({ text: 'Data refreshed from all sources.', type: 'success' });
    setSaving(false);
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '14px',
    padding: '10px 12px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.06)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    color: '#94a3b8',
    marginBottom: '6px',
    display: 'block',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 8px',
    fontSize: '11px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '4px',
    color: '#e2e8f0',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const btnStyle: React.CSSProperties = {
    padding: '5px 12px',
    fontSize: '11px',
    fontWeight: 600,
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    backgroundColor: '#3b82f6',
  };

  return (
    <div style={{ padding: '8px 12px', overflowY: 'auto', maxHeight: '100%' }}>
      {/* Message banner */}
      {message && (
        <div
          style={{
            padding: '6px 10px',
            marginBottom: '10px',
            borderRadius: '6px',
            fontSize: '11px',
            backgroundColor: message.type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            color: message.type === 'success' ? '#4ade80' : '#f87171',
            border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* API Key */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Anthropic Admin API Key</span>
        <p style={{ fontSize: '10px', color: '#64748b', margin: '0 0 8px 0', lineHeight: '1.4' }}>
          Connect your Anthropic Admin API key to track ALL Claude usage across Desktop, Web, API,
          and Code. Get your key from console.anthropic.com under Settings &gt; Admin API Keys.
        </p>
        {settings?.apiKeySet && (
          <div
            style={{
              fontSize: '10px',
              color: '#4ade80',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ade80', display: 'inline-block' }} />
            Connected: {settings.apiKeyPreview}
          </div>
        )}
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type="password"
            placeholder={settings?.apiKeySet ? 'Replace existing key...' : 'sk-ant-admin-...'}
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button onClick={handleSaveApiKey} disabled={saving} style={btnStyle}>
            {saving ? '...' : 'Save'}
          </button>
          {settings?.apiKeySet && (
            <button
              onClick={() => { setApiKeyInput(''); handleSaveApiKey(); }}
              style={{ ...btnStyle, backgroundColor: '#ef4444' }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Data Sources */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Detected Data Sources</span>
        {diagnostics?.sources.map((source, i) => (
          <div
            key={i}
            style={{
              fontSize: '10px',
              padding: '4px 0',
              color: source.exists ? '#94a3b8' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderBottom: i < diagnostics.sources.length - 1 ? '1px solid rgba(255,255,255,0.03)' : undefined,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: source.exists ? '#4ade80' : '#475569',
                flexShrink: 0,
              }}
            />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {source.label}
            </span>
            <span style={{ color: '#475569', fontSize: '9px' }}>
              {source.kind}
            </span>
          </div>
        ))}
        {diagnostics && (
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '8px' }}>
            {diagnostics.totalEntries} usage entries from {diagnostics.totalSessions} sessions
            {diagnostics.apiConnected && (
              <span style={{ color: '#4ade80' }}> + API data (last sync: {diagnostics.lastApiSync ? new Date(diagnostics.lastApiSync).toLocaleTimeString() : 'never'})</span>
            )}
          </div>
        )}
      </div>

      {/* Custom Paths */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Custom Scan Paths</span>
        <p style={{ fontSize: '10px', color: '#64748b', margin: '0 0 6px 0' }}>
          Add extra directories to scan for Claude usage JSONL files (one per line).
        </p>
        <textarea
          placeholder="/path/to/custom/claude/data"
          value={customPathInput}
          onChange={(e) => setCustomPathInput(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }}
        />
        <button onClick={handleSaveCustomPaths} style={{ ...btnStyle, marginTop: '6px' }}>
          Save Paths
        </button>
      </div>

      {/* Errors */}
      {diagnostics?.errors && diagnostics.errors.length > 0 && (
        <div style={sectionStyle}>
          <span style={{ ...labelStyle, color: '#f87171' }}>Errors</span>
          {diagnostics.errors.map((err, i) => (
            <div key={i} style={{ fontSize: '10px', color: '#f87171', padding: '2px 0' }}>
              {err}
            </div>
          ))}
        </div>
      )}

      {/* Refresh */}
      <button onClick={handleRefresh} disabled={saving} style={{ ...btnStyle, width: '100%', marginTop: '4px' }}>
        {saving ? 'Refreshing...' : 'Refresh All Data'}
      </button>
    </div>
  );
};
