import { useCallback, useEffect, useState } from 'react';
import type { PetMonitorSetupStatus } from '../../types/lib/monitoring';
import type { UsePetMonitorSetupOptions } from '../../types';
import { getPetMonitorSetupStatus } from '../../lib/services/petMonitorService';
import { usePetMonitorRequest } from './usePetMonitorRequest';

export function usePetMonitorSetup(options: UsePetMonitorSetupOptions = {}) {
  const { autoLoad = true } = options;
  const [setupStatus, setSetupStatus] = useState<PetMonitorSetupStatus | null>(null);
  const request = usePetMonitorRequest();
  const { runRequest, resetRequest } = request;

  const loadSetupStatus = useCallback(() => runRequest(
    getPetMonitorSetupStatus,
    {
      fallbackMessage: 'Failed to fetch PetMonitor setup status',
      onSuccess: (result) => setSetupStatus(result),
    },
  ), [runRequest]);

  const resetSetupStatus = useCallback(() => {
    setSetupStatus(null);
    resetRequest();
  }, [resetRequest]);

  useEffect(() => {
    if (!autoLoad) return;
    void loadSetupStatus().catch(() => undefined);
  }, [autoLoad, loadSetupStatus]);

  return {
    setupStatus,
    isLoading: request.isLoading,
    hasLoaded: request.hasLoaded,
    error: request.error,
    loadSetupStatus,
    refreshSetupStatus: loadSetupStatus,
    resetSetupStatus,
  };
}
