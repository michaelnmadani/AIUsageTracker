import { useState, useEffect, useMemo } from 'react';
import type { ClaudeStatus, CatActivity, CurrentSessionInfo } from '../types/usage';

export function useClaudeStatus(current: CurrentSessionInfo) {
  const [status, setStatus] = useState<ClaudeStatus>('offline');

  useEffect(() => {
    if (window.usageAPI) {
      const cleanup = window.usageAPI.onStatusChange(({ isActive }) => {
        setStatus(isActive ? 'active' : 'idle');
      });

      return cleanup;
    }
  }, []);

  // Also derive status from current data
  useEffect(() => {
    if (current.isActive) {
      setStatus('active');
    } else if (current.sessionId) {
      setStatus('idle');
    }
  }, [current.isActive, current.sessionId]);

  // Determine what cats should be doing based on recent activity
  const catActivities = useMemo((): CatActivity[] => {
    if (status === 'idle' || status === 'offline') {
      return ['sleeping', 'reading', 'gardening'];
    }

    // When active, show a mix of busy cats
    const activities: CatActivity[] = ['gardening']; // gardening cat is always present

    const recentEntries = current.recentEntries || [];
    const hasToolUse = recentEntries.some(
      (e) => e.type === 'assistant'
    );

    if (hasToolUse) {
      activities.push('typing', 'cooking', 'sweeping');
    } else {
      activities.push('reading', 'cooking', 'typing');
    }

    return activities;
  }, [status, current.recentEntries]);

  return {
    status,
    catActivities,
    isActive: status === 'active',
    isIdle: status === 'idle',
  };
}
