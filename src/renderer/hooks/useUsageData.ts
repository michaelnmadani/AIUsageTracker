import { useState, useEffect, useCallback } from 'react';
import type {
  CurrentSessionInfo,
  HistoricalUsage,
  ProjectStats,
  ModelStats,
  UsageData,
} from '../types/usage';

const defaultCurrent: CurrentSessionInfo = {
  isActive: false,
  sessionId: null,
  projectName: null,
  model: null,
  totalInputTokens: 0,
  totalOutputTokens: 0,
  totalCacheTokens: 0,
  tokensPerMinute: 0,
  startedAt: null,
  recentEntries: [],
};

const defaultHistory: HistoricalUsage = {
  hourly: {},
  daily: {},
};

export function useUsageData() {
  const [current, setCurrent] = useState<CurrentSessionInfo>(defaultCurrent);
  const [history, setHistory] = useState<HistoricalUsage>(defaultHistory);
  const [projects, setProjects] = useState<ProjectStats[]>([]);
  const [models, setModels] = useState<ModelStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      if (window.usageAPI) {
        const [currentData, historyData, projectsData, modelsData] = await Promise.all([
          window.usageAPI.getCurrent(),
          window.usageAPI.getHistory(),
          window.usageAPI.getProjects(),
          window.usageAPI.getModels(),
        ]);

        setCurrent(currentData || defaultCurrent);
        setHistory(historyData || defaultHistory);
        setProjects(projectsData || []);
        setModels(modelsData || []);
      }
    } catch (err) {
      console.error('Failed to fetch usage data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();

    // Listen for real-time updates from the watcher
    let cleanup: (() => void) | undefined;

    if (window.usageAPI) {
      cleanup = window.usageAPI.onUsageUpdate((data: UsageData) => {
        if (data.current) setCurrent(data.current);
        if (data.history) setHistory(data.history);
        if (data.projects) setProjects(data.projects);
        if (data.models) setModels(data.models);
      });
    }

    // Also poll every 10 seconds as a fallback
    const interval = setInterval(fetchAll, 10000);

    return () => {
      cleanup?.();
      clearInterval(interval);
    };
  }, [fetchAll]);

  const totalTokens = current.totalInputTokens + current.totalOutputTokens + current.totalCacheTokens;

  return {
    current,
    history,
    projects,
    models,
    loading,
    totalTokens,
    refresh: fetchAll,
  };
}
