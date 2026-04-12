import React, { useState, useEffect } from 'react';
import PrinterDial from './components/PrinterDial';
import SettingsOverlay from './components/SettingsOverlay';
import { useBambuStatus } from './hooks/useBambuStatus';
import { useBambuConfig } from './hooks/useBambuConfig';

declare global {
  interface Window {
    bambuAPI: any;
  }
}

const App: React.FC = () => {
  const { status, connectionState } = useBambuStatus();
  const { config, loading, saveAndConnect } = useBambuConfig();
  const [showSettings, setShowSettings] = useState(false);

  // Show settings on first launch if no config
  useEffect(() => {
    if (!loading && !config) {
      setShowSettings(true);
    }
  }, [loading, config]);

  // Listen for "show settings" from tray menu
  useEffect(() => {
    if (!window.bambuAPI) return;
    const unsub = window.bambuAPI.onShowSettings(() => {
      setShowSettings(true);
    });
    return unsub;
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSettings(true);
  };

  const handleSaveConfig = async (newConfig: { ip: string; serial: string; accessCode: string }) => {
    await saveAndConnect(newConfig);
    setShowSettings(false);
  };

  if (showSettings) {
    return (
      <SettingsOverlay
        initialConfig={config}
        onSave={handleSaveConfig}
        onCancel={config ? () => setShowSettings(false) : undefined}
      />
    );
  }

  return (
    <div onContextMenu={handleContextMenu} style={{ width: '100%', height: '100%' }}>
      <PrinterDial status={status} connectionState={connectionState} />
    </div>
  );
};

export default App;
