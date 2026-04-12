import React, { useState } from 'react';

interface SettingsOverlayProps {
  initialConfig: { ip: string; serial: string; accessCode: string } | null;
  onSave: (config: { ip: string; serial: string; accessCode: string }) => void;
  onCancel?: () => void;
}

const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ initialConfig, onSave, onCancel }) => {
  const [ip, setIp] = useState(initialConfig?.ip || '');
  const [serial, setSerial] = useState(initialConfig?.serial || '');
  const [accessCode, setAccessCode] = useState(initialConfig?.accessCode || '');

  const canSubmit = ip.trim() && serial.trim() && accessCode.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      onSave({ ip: ip.trim(), serial: serial.trim(), accessCode: accessCode.trim() });
    }
  };

  return (
    <div className="settings-overlay">
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-title">Bambu Printer</div>

        <label className="settings-label">
          <span>Printer IP</span>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.100"
            className="settings-input"
            autoFocus
          />
        </label>

        <label className="settings-label">
          <span>Serial Number</span>
          <input
            type="text"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            placeholder="01P00A000000000"
            className="settings-input"
          />
        </label>

        <label className="settings-label">
          <span>Access Code</span>
          <input
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="12345678"
            className="settings-input"
          />
        </label>

        <div className="settings-hint">
          Find these in your printer's settings under Network &gt; LAN Mode
        </div>

        <div className="settings-buttons">
          {onCancel && (
            <button type="button" onClick={onCancel} className="settings-btn settings-btn-cancel">
              Cancel
            </button>
          )}
          <button type="submit" disabled={!canSubmit} className="settings-btn settings-btn-save">
            Connect
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsOverlay;
