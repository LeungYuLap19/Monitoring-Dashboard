import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  PetMonitorBehaviorLogStatsResponse,
  PetMonitorBehaviorLogsQuery,
  PetMonitorBehaviorTimelineQuery,
  PetMonitorBehaviorTimelineResponse,
} from '../../types/lib/monitoring';
import type { UsePetMonitorBehaviorOptions } from '../../types';
import {
  getPetMonitorBehaviorLogs,
  getPetMonitorBehaviorTimeline,
} from '../../lib/services/petMonitorService';
import { usePetMonitorRequest } from './usePetMonitorRequest';

export function usePetMonitorBehavior(options: UsePetMonitorBehaviorOptions = {}) {
  const {
    initialLogsQuery = null,
    initialTimelineQuery = null,
    autoLoadLogs = Boolean(initialLogsQuery),
    autoLoadTimeline = Boolean(initialTimelineQuery),
  } = options;

  const [logsQuery, setLogsQuery] = useState<PetMonitorBehaviorLogsQuery | null>(initialLogsQuery);
  const [timelineQuery, setTimelineQuery] = useState<PetMonitorBehaviorTimelineQuery | null>(initialTimelineQuery);
  const [behaviorStats, setBehaviorStats] = useState<PetMonitorBehaviorLogStatsResponse | null>(null);
  const [timeline, setTimeline] = useState<PetMonitorBehaviorTimelineResponse | null>(null);
  const logsQueryRef = useRef<PetMonitorBehaviorLogsQuery | null>(initialLogsQuery);
  const timelineQueryRef = useRef<PetMonitorBehaviorTimelineQuery | null>(initialTimelineQuery);
  const logsRequest = usePetMonitorRequest();
  const timelineRequest = usePetMonitorRequest();
  const { runRequest: runLogsRequest, resetRequest: resetLogsRequest } = logsRequest;
  const { runRequest: runTimelineRequest, resetRequest: resetTimelineRequest } = timelineRequest;

  useEffect(() => {
    logsQueryRef.current = logsQuery;
  }, [logsQuery]);

  useEffect(() => {
    timelineQueryRef.current = timelineQuery;
  }, [timelineQuery]);

  const loadBehaviorStats = useCallback((nextQuery?: PetMonitorBehaviorLogsQuery) => {
    const resolvedQuery = nextQuery ?? logsQueryRef.current;

    if (!resolvedQuery) {
      return Promise.reject(new Error('Behavior logs query is required'));
    }

    logsQueryRef.current = resolvedQuery;
    setLogsQuery(resolvedQuery);

    return runLogsRequest(
      () => getPetMonitorBehaviorLogs(resolvedQuery),
      {
        fallbackMessage: 'Failed to fetch PetMonitor behavior logs',
        onSuccess: setBehaviorStats,
      },
    );
  }, [runLogsRequest]);

  const loadBehaviorTimeline = useCallback((nextQuery?: PetMonitorBehaviorTimelineQuery) => {
    const resolvedQuery = nextQuery ?? timelineQueryRef.current;

    if (!resolvedQuery) {
      return Promise.reject(new Error('Behavior timeline query is required'));
    }

    timelineQueryRef.current = resolvedQuery;
    setTimelineQuery(resolvedQuery);

    return runTimelineRequest(
      () => getPetMonitorBehaviorTimeline(resolvedQuery),
      {
        fallbackMessage: 'Failed to fetch PetMonitor behavior timeline',
        onSuccess: setTimeline,
      },
    );
  }, [runTimelineRequest]);

  const refreshBehaviorStats = useCallback(() => loadBehaviorStats(), [loadBehaviorStats]);
  const refreshBehaviorTimeline = useCallback(() => loadBehaviorTimeline(), [loadBehaviorTimeline]);

  const resetBehavior = useCallback(() => {
    setBehaviorStats(null);
    setTimeline(null);
    resetLogsRequest();
    resetTimelineRequest();
  }, [resetLogsRequest, resetTimelineRequest]);

  useEffect(() => {
    if (!autoLoadLogs || !initialLogsQuery) return;
    void loadBehaviorStats(initialLogsQuery);
  }, [autoLoadLogs, initialLogsQuery, loadBehaviorStats]);

  useEffect(() => {
    if (!autoLoadTimeline || !initialTimelineQuery) return;
    void loadBehaviorTimeline(initialTimelineQuery);
  }, [autoLoadTimeline, initialTimelineQuery, loadBehaviorTimeline]);

  return {
    logsQuery,
    timelineQuery,
    behaviorStats,
    timeline,
    isLoadingStats: logsRequest.isLoading,
    isLoadingTimeline: timelineRequest.isLoading,
    hasLoadedStats: logsRequest.hasLoaded,
    hasLoadedTimeline: timelineRequest.hasLoaded,
    statsError: logsRequest.error,
    timelineError: timelineRequest.error,
    setLogsQuery,
    setTimelineQuery,
    loadBehaviorStats,
    loadBehaviorTimeline,
    refreshBehaviorStats,
    refreshBehaviorTimeline,
    resetBehavior,
  };
}
