import type { AxiosRequestConfig } from 'axios';
import type {
  PetMonitorActiveCamerasResponse,
  PetMonitorBackendStatsResponse,
  PetMonitorBehaviorLogStatsResponse,
  PetMonitorBehaviorLogsQuery,
  PetMonitorBehaviorTimelineQuery,
  PetMonitorBehaviorTimelineResponse,
  PetMonitorCameraConfigUpdateResponse,
  PetMonitorCameraIndex,
  PetMonitorCameraRuntimeConfig,
  PetMonitorCameraRuntimeConfigUpdate,
  PetMonitorDeleteVideoRecordResponse,
  PetMonitorSelectXiaomiCameraPayload,
  PetMonitorSelectXiaomiCameraResponse,
  PetMonitorSetupStatus,
  PetMonitorVideoRecordsQuery,
  PetMonitorVideoRecordsResponse,
  PetMonitorXiaomiCamera,
  PetMonitorXiaomiCameraListResponse,
  PetMonitorXiaomiLoginPayload,
  PetMonitorXiaomiLoginResponse,
} from '../../types/lib/monitoring';
import {
  asString,
  isObjectRecord,
  isSuccessStatus,
  readErrorMessage,
} from '../utils/http/http';
import {
  buildPetMonitorRecordThumbnailUrl,
  buildPetMonitorRecordVideoUrl,
  buildPetMonitorUrl as buildPetMonitorUrlWithBase,
  buildPetMonitorVideoFeedUrl,
  createPetMonitorClient,
  extractPetMonitorLoginError,
  isPetMonitorPayloadSuccess,
  normalizePetMonitorApiBaseUrl,
  requestPetMonitor as requestPetMonitorWithClient,
  requirePetMonitorSuccess as requireSuccessStatus,
} from '../utils/services/pet-monitor-service';

export { PetMonitorServiceError } from '../utils/services/pet-monitor-service';

export const PET_MONITOR_API_BASE_URL = (
  normalizePetMonitorApiBaseUrl(import.meta.env.VITE_MONITOR_API_BASE_URL)
);

const petMonitorClient = createPetMonitorClient(PET_MONITOR_API_BASE_URL);

function requestPetMonitor<T>(config: AxiosRequestConfig) {
  return requestPetMonitorWithClient<T>(petMonitorClient, config);
}

export function buildPetMonitorUrl(path: string): string {
  return buildPetMonitorUrlWithBase(PET_MONITOR_API_BASE_URL, path);
}

export function getPetMonitorVideoFeedUrl(camId: PetMonitorCameraIndex): string {
  return buildPetMonitorVideoFeedUrl(PET_MONITOR_API_BASE_URL, camId);
}

export function getPetMonitorRecordVideoUrl(filename: string): string {
  return buildPetMonitorRecordVideoUrl(PET_MONITOR_API_BASE_URL, filename);
}

export function getPetMonitorRecordThumbnailUrl(filename: string): string {
  return buildPetMonitorRecordThumbnailUrl(PET_MONITOR_API_BASE_URL, filename);
}

export async function getPetMonitorSetupStatus(): Promise<PetMonitorSetupStatus> {
  const response = await requestPetMonitor<PetMonitorSetupStatus>({
    method: 'GET',
    url: '/api/setup/status',
  });

  return requireSuccessStatus(response, 'Failed to fetch PetMonitor setup status');
}

export async function loginPetMonitorXiaomi(
  payload: PetMonitorXiaomiLoginPayload,
): Promise<PetMonitorXiaomiLoginResponse> {
  const response = await requestPetMonitor<PetMonitorXiaomiLoginResponse>({
    method: 'POST',
    url: '/api/setup/xiaomi/login',
    data: payload,
  });

  const data = (response.data ?? {}) as PetMonitorXiaomiLoginResponse;
  return {
    ...data,
    success: isPetMonitorPayloadSuccess(response.status, data),
    error: extractPetMonitorLoginError(data),
  };
}

export async function getPetMonitorXiaomiCameras(
  accountId: string,
  region: string,
): Promise<PetMonitorXiaomiCameraListResponse> {
  const response = await requestPetMonitor<Partial<PetMonitorXiaomiCameraListResponse>>({
    method: 'GET',
    url: '/api/setup/xiaomi/cameras',
    params: {
      account_id: accountId,
      region,
    },
  });

  const data = response.data ?? {};
  return {
    success: isSuccessStatus(response.status) && data.success !== false,
    account_id: asString(data.account_id) ?? accountId,
    region: asString(data.region) ?? region,
    cameras: Array.isArray(data.cameras) ? (data.cameras as PetMonitorXiaomiCamera[]) : [],
    raw: data.raw,
    error: data.error,
  };
}

export async function selectPetMonitorXiaomiCamera(
  payload: PetMonitorSelectXiaomiCameraPayload,
): Promise<PetMonitorSelectXiaomiCameraResponse> {
  const response = await requestPetMonitor<PetMonitorSelectXiaomiCameraResponse>({
    method: 'POST',
    url: '/api/setup/xiaomi/select',
    data: payload,
  });

  const data = (response.data ?? {}) as PetMonitorSelectXiaomiCameraResponse;
  return {
    ...data,
    success: isSuccessStatus(response.status) && data.success !== false,
    error: data.error ?? (!isSuccessStatus(response.status)
      ? readErrorMessage(data, 'Failed to select Xiaomi camera')
      : undefined),
  };
}

export async function fetchPetMonitorCameraStats(): Promise<PetMonitorBackendStatsResponse> {
  const response = await requestPetMonitor<PetMonitorBackendStatsResponse>({
    method: 'GET',
    url: '/stats',
  });

  return requireSuccessStatus(response, 'Failed to fetch PetMonitor camera stats');
}

export async function getPetMonitorActiveCameras(): Promise<PetMonitorCameraIndex[]> {
  const response = await requestPetMonitor<PetMonitorActiveCamerasResponse>({
    method: 'GET',
    url: '/api/active_cams',
  });

  const data = requireSuccessStatus(response, 'Failed to fetch active PetMonitor cameras');
  return Array.isArray(data.active_cams) ? data.active_cams : [];
}

export async function setPetMonitorActiveCameras(
  activeCams: PetMonitorCameraIndex[],
): Promise<PetMonitorActiveCamerasResponse> {
  const response = await requestPetMonitor<PetMonitorActiveCamerasResponse>({
    method: 'POST',
    url: '/api/active_cams',
    data: { active_cams: activeCams },
  });

  const data = (response.data ?? {}) as PetMonitorActiveCamerasResponse;
  return {
    active_cams: Array.isArray(data.active_cams) ? data.active_cams : activeCams,
    success: isSuccessStatus(response.status) && data.success !== false,
  };
}

export async function getPetMonitorCameraConfig(
  camId: PetMonitorCameraIndex,
): Promise<PetMonitorCameraRuntimeConfig> {
  const response = await requestPetMonitor<PetMonitorCameraRuntimeConfig>({
    method: 'GET',
    url: `/api/config/${camId}`,
  });

  return requireSuccessStatus(response, `Failed to fetch PetMonitor config for camera ${camId}`);
}

export async function updatePetMonitorCameraConfig(
  camId: PetMonitorCameraIndex,
  config: PetMonitorCameraRuntimeConfigUpdate,
): Promise<PetMonitorCameraConfigUpdateResponse> {
  const response = await requestPetMonitor<PetMonitorCameraConfigUpdateResponse>({
    method: 'POST',
    url: `/api/config/${camId}`,
    data: config,
  });

  const data = (response.data ?? {}) as PetMonitorCameraConfigUpdateResponse;
  return {
    ...data,
    success: isSuccessStatus(response.status) && data.success !== false,
    error: data.error ?? (!isSuccessStatus(response.status)
      ? readErrorMessage(data, `Failed to update PetMonitor config for camera ${camId}`)
      : undefined),
  };
}

export async function getPetMonitorBehaviorLogs(
  query: PetMonitorBehaviorLogsQuery,
): Promise<PetMonitorBehaviorLogStatsResponse> {
  const response = await requestPetMonitor<PetMonitorBehaviorLogStatsResponse>({
    method: 'GET',
    url: '/api/behavior_logs',
    params: query,
  });

  const data = (response.data ?? {}) as PetMonitorBehaviorLogStatsResponse;
  return {
    success: isSuccessStatus(response.status) && data.success !== false,
    stats: isObjectRecord(data.stats) ? data.stats : {},
    error: data.error ?? (!isSuccessStatus(response.status)
      ? readErrorMessage(data, 'Failed to fetch PetMonitor behavior logs')
      : undefined),
  };
}

export async function getPetMonitorBehaviorTimeline(
  query: PetMonitorBehaviorTimelineQuery,
): Promise<PetMonitorBehaviorTimelineResponse> {
  const response = await requestPetMonitor<PetMonitorBehaviorTimelineResponse>({
    method: 'GET',
    url: '/api/behavior_logs_timeline',
    params: query,
  });

  const data = (response.data ?? {}) as PetMonitorBehaviorTimelineResponse;
  return {
    success: isSuccessStatus(response.status) && data.success !== false,
    cam_id: typeof data.cam_id === 'number' ? data.cam_id : query.cam_id,
    bucket: data.bucket ?? query.bucket,
    points: Array.isArray(data.points) ? data.points : [],
    error: data.error ?? (!isSuccessStatus(response.status)
      ? readErrorMessage(data, 'Failed to fetch PetMonitor behavior timeline')
      : undefined),
  };
}

export async function getPetMonitorVideoRecords(
  query: PetMonitorVideoRecordsQuery = {},
): Promise<PetMonitorVideoRecordsResponse> {
  const response = await requestPetMonitor<PetMonitorVideoRecordsResponse>({
    method: 'GET',
    url: '/api/records',
    params: query,
  });

  const data = (response.data ?? {}) as PetMonitorVideoRecordsResponse;
  return {
    success: isSuccessStatus(response.status) && data.success !== false,
    records: Array.isArray(data.records) ? data.records : [],
    error: data.error ?? (!isSuccessStatus(response.status)
      ? readErrorMessage(data, 'Failed to fetch PetMonitor video records')
      : undefined),
  };
}

export async function deletePetMonitorVideoRecord(
  recordId: number,
): Promise<PetMonitorDeleteVideoRecordResponse> {
  const response = await requestPetMonitor<PetMonitorDeleteVideoRecordResponse>({
    method: 'DELETE',
    url: `/api/records/${recordId}`,
  });

  const data = (response.data ?? {}) as PetMonitorDeleteVideoRecordResponse;
  return {
    success: isSuccessStatus(response.status) && data.success !== false,
    error: data.error ?? (!isSuccessStatus(response.status)
      ? readErrorMessage(data, `Failed to delete PetMonitor video record ${recordId}`)
      : undefined),
  };
}
