import { useCallback } from 'react';
import type { UsePetMonitorDashboardOptions } from '../../types';
import { usePetMonitorActiveCameras } from './usePetMonitorActiveCameras';
import { usePetMonitorBehavior } from './usePetMonitorBehavior';
import { usePetMonitorRecords } from './usePetMonitorRecords';
import { usePetMonitorStats } from './usePetMonitorStats';
import { usePetMonitorUrls } from './usePetMonitorUrls';

export function usePetMonitorDashboard(options: UsePetMonitorDashboardOptions = {}) {
  const {
    autoLoad = true,
    statsPollIntervalMs = 0,
    behaviorLogsQuery = null,
    behaviorTimelineQuery = null,
    recordsQuery = {},
  } = options;

  const stats = usePetMonitorStats({ autoLoad, pollIntervalMs: statsPollIntervalMs });
  const activeCameras = usePetMonitorActiveCameras({ autoLoad });
  const behavior = usePetMonitorBehavior({
    initialLogsQuery: behaviorLogsQuery,
    initialTimelineQuery: behaviorTimelineQuery,
    autoLoadLogs: autoLoad && Boolean(behaviorLogsQuery),
    autoLoadTimeline: autoLoad && Boolean(behaviorTimelineQuery),
  });
  const records = usePetMonitorRecords({
    initialQuery: recordsQuery,
    autoLoad,
  });
  const urls = usePetMonitorUrls();

  const refreshDashboard = useCallback(async () => {
    await Promise.all([
      stats.refreshStats(),
      activeCameras.refreshActiveCameras(),
      records.refreshRecords(),
      behavior.logsQuery ? behavior.refreshBehaviorStats() : Promise.resolve(null),
      behavior.timelineQuery ? behavior.refreshBehaviorTimeline() : Promise.resolve(null),
    ]);
  }, [activeCameras, behavior, records, stats]);

  const reconnectDashboard = useCallback(async () => {
    await Promise.all([
      stats.reconnectStats(),
      activeCameras.reconnectActiveCameras(),
      records.reconnectRecords(),
      behavior.logsQuery ? behavior.reconnectBehaviorStats() : Promise.resolve(null),
      behavior.timelineQuery ? behavior.reconnectBehaviorTimeline() : Promise.resolve(null),
    ]);
  }, [activeCameras, behavior, records, stats]);

  return {
    stats,
    activeCameras,
    behavior,
    records,
    urls,
    isLoading:
      stats.isLoading ||
      activeCameras.isLoading ||
      behavior.isLoadingStats ||
      behavior.isLoadingTimeline ||
      records.isLoading,
    isBlocked:
      stats.isBlocked ||
      activeCameras.isBlocked ||
      behavior.isStatsBlocked ||
      behavior.isTimelineBlocked ||
      records.isBlocked,
    error:
      stats.error ||
      activeCameras.error ||
      behavior.statsError ||
      behavior.timelineError ||
      records.error,
    refreshDashboard,
    reconnectDashboard,
  };
}
