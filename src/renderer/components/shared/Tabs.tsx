import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  children: (activeTab: string) => React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          gap: '2px',
          padding: '4px',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          margin: '0 8px',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '6px 4px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease',
              backgroundColor: activeTab === tab.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activeTab === tab.id ? '#e2e8f0' : '#64748b',
              border: 'none',
              cursor: 'pointer',
              WebkitAppRegion: 'no-drag' as any,
            }}
          >
            {tab.icon && <span style={{ marginRight: '3px' }}>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px',
        }}
      >
        {children(activeTab)}
      </div>
    </div>
  );
};
