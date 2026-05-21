import type {
  PetMonitorBehaviorLogsQuery,
  PetMonitorBehaviorTimelineQuery,
  PetMonitorCameraIndex,
  PetMonitorVideoRecordsQuery,
} from '../lib/monitoring';

export interface PetMonitorRequestState {
  isLoading: boolean;
  hasLoaded: boolean;
  error: Error | null;
}

export interface RunPetMonitorRequestOptions<TData> {
  fallbackMessage: string;
  onSuccess?: (data: TData) => void;
}

export interface UsePetMonitorSetupOptions {
  autoLoad?: boolean;
}

export interface UsePetMonitorStatsOptions {
  autoLoad?: boolean;
  pollIntervalMs?: number;
}

export interface UsePetMonitorActiveCamerasOptions {
  autoLoad?: boolean;
}

export interface UsePetMonitorCameraConfigOptions {
  initialCamId?: PetMonitorCameraIndex | null;
  autoLoad?: boolean;
}

export interface UsePetMonitorBehaviorOptions {
  initialLogsQuery?: PetMonitorBehaviorLogsQuery | null;
  initialTimelineQuery?: PetMonitorBehaviorTimelineQuery | null;
  autoLoadLogs?: boolean;
  autoLoadTimeline?: boolean;
}

export interface UsePetMonitorRecordsOptions {
  initialQuery?: PetMonitorVideoRecordsQuery;
  autoLoad?: boolean;
}

export interface UsePetMonitorDashboardOptions {
  autoLoad?: boolean;
  statsPollIntervalMs?: number;
  behaviorLogsQuery?: PetMonitorBehaviorLogsQuery | null;
  behaviorTimelineQuery?: PetMonitorBehaviorTimelineQuery | null;
  recordsQuery?: PetMonitorVideoRecordsQuery;
}
