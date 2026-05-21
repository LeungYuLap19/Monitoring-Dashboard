import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  PetMonitorBackendStatsResponse,
  PetMonitorCameraIndex,
  PetMonitorCameraSnapshot,
} from '../../types/lib/monitoring';
import type { UsePetMonitorStatsOptions } from '../../types';
import { fetchPetMonitorCameraStats } from '../../lib/services/petMonitorService';
import { usePetMonitorRequest } from './usePetMonitorRequest';

function getCameraIdFromKey(key: string): PetMonitorCameraIndex | null {
  const match = key.match(/\d+/);
  if (!match) return null;
  const camId = Number(match[0]);
  return Number.isFinite(camId) ? camId : null;
}

export function usePetMonitorStats(options: UsePetMonitorStatsOptions = {}) {
  const { autoLoad = true, pollIntervalMs = 0 } = options;
  const [stats, setStats] = useState<PetMonitorBackendStatsResponse>({});
  const request = usePetMonitorRequest();
  const { runRequest, resetRequest } = request;
  const isMountedRef = useRef(false);

  const loadStats = useCallback(() => runRequest(
    fetchPetMonitorCameraStats,
    {
      fallbackMessage: 'Failed to fetch PetMonitor camera stats',
      onSuccess: (result) => setStats(result),
    },
  ), [runRequest]);

  const resetStats = useCallback(() => {
    setStats({});
    resetRequest();
  }, [resetRequest]);

  const cameraSnapshots = useMemo(() => Object.entries(stats).map(([cameraKey, snapshot]) => ({
    cameraKey,
    camId: snapshot.stats.camId ?? getCameraIdFromKey(cameraKey),
    snapshot,
  })), [stats]);

  const getCameraSnapshot = useCallback((
    camId: PetMonitorCameraIndex,
  ): PetMonitorCameraSnapshot | null => {
    return cameraSnapshots.find((item) => item.camId === camId)?.snapshot ?? null;
  }, [cameraSnapshots]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!autoLoad) return;
    void loadStats().catch(() => undefined);
  }, [autoLoad, loadStats]);

  useEffect(() => {
    if (!autoLoad || pollIntervalMs <= 0) return;

    const timer = window.setInterval(() => {
      if (isMountedRef.current) {
        void loadStats().catch(() => undefined);
      }
    }, pollIntervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [autoLoad, loadStats, pollIntervalMs]);

  return {
    stats,
    cameraSnapshots,
    isLoading: request.isLoading,
    hasLoaded: request.hasLoaded,
    error: request.error,
    loadStats,
    refreshStats: loadStats,
    resetStats,
    getCameraSnapshot,
  };
}
