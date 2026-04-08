import { useState, useEffect, useMemo, useRef } from 'react';
import type { ClaudeStatus, CatActivity, CurrentSessionInfo } from '../types/usage';

export function useClaudeStatus(current: CurrentSessionInfo) {
  const [status, setStatus] = useState<ClaudeStatus>('offline');
  const [celebrating, setCelebrating] = useState(false);
  const prevStatusRef = useRef<ClaudeStatus>(status);

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

  // Detect task completion (active -> idle) and trigger celebration
  useEffect(() => {
    if (prevStatusRef.current === 'active' && status === 'idle') {
      setCelebrating(true);
      const timer = setTimeout(() => setCelebrating(false), 3500);
      return () => clearTimeout(timer);
    }
    prevStatusRef.current = status;
  }, [status]);

  // Determine what cats should be doing based on recent activity
  const catActivities = useMemo((): CatActivity[] => {
    if (celebrating) {
      // During celebration, show all cats active and happy
      return ['cooking', 'typing', 'sweeping', 'reading', 'gardening', 'sleeping'];
    }

    if (status === 'idle' || status === 'offline') {
      // Show a peaceful scene with multiple cats
      return ['sleeping', 'reading', 'gardening', 'cooking'];
    }

    // When active, show ALL busy cats for a lively scene
    const recentEntries = current.recentEntries || [];
    const hasToolUse = recentEntries.some(
      (e) => e.type === 'assistant'
    );

    if (hasToolUse) {
      return ['typing', 'cooking', 'sweeping', 'gardening'];
    } else {
      return ['reading', 'cooking', 'typing', 'gardening'];
    }
  }, [status, current.recentEntries, celebrating]);

  return {
    status,
    catActivities,
    isActive: status === 'active',
    isIdle: status === 'idle',
    celebrating,
  };
}
