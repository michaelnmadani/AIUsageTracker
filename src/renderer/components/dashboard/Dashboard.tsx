import React from 'react';
import { Tabs } from '../shared/Tabs';
import { CurrentSession } from './CurrentSession';
import { History } from './History';
import { Projects } from './Projects';
import { Models } from './Models';
import type {
  CurrentSessionInfo,
  HistoricalUsage,
  ProjectStats,
  ModelStats,
  ClaudeStatus,
} from '../../types/usage';
import styles from './dashboard.module.css';

interface DashboardProps {
  current: CurrentSessionInfo;
  history: HistoricalUsage;
  projects: ProjectStats[];
  models: ModelStats[];
  status: ClaudeStatus;
}

const TABS = [
  { id: 'session', label: 'Session' },
  { id: 'history', label: 'History' },
  { id: 'projects', label: 'Projects' },
  { id: 'models', label: 'Models' },
];

export const Dashboard: React.FC<DashboardProps> = ({
  current,
  history,
  projects,
  models,
  status,
}) => {
  return (
    <div className={styles.dashboardContainer}>
      <Tabs tabs={TABS} defaultTab="session">
        {(activeTab) => {
          switch (activeTab) {
            case 'session':
              return <CurrentSession current={current} status={status} />;
            case 'history':
              return <History history={history} />;
            case 'projects':
              return <Projects projects={projects} />;
            case 'models':
              return <Models models={models} />;
            default:
              return null;
          }
        }}
      </Tabs>
    </div>
  );
};
