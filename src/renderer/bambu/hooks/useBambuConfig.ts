import { useState, useEffect } from 'react';

interface BambuConfig {
  ip: string;
  serial: string;
  accessCode: string;
  printerName?: string;
}

export function useBambuConfig() {
  const [config, setConfig] = useState<BambuConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!window.bambuAPI) {
      setLoading(false);
      return;
    }

    window.bambuAPI.getConfig().then((saved: BambuConfig | null) => {
      if (saved) {
        setConfig(saved);
        // Auto-connect with saved config
        window.bambuAPI.connect(saved);
      }
      setLoading(false);
    });
  }, []);

  const saveAndConnect = async (newConfig: { ip: string; serial: string; accessCode: string }) => {
    const fullConfig: BambuConfig = { ...newConfig };
    await window.bambuAPI.connect(fullConfig);
    setConfig(fullConfig);
  };

  return { config, loading, saveAndConnect };
}
