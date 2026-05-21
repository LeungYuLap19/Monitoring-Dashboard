import type {
  ActivityClip,
  ActivityCount,
  BunnyGuest,
  CameraFeed,
  StatByTime,
} from '../../../types/constants/domain';
import type {
  PetMonitorBehaviorLogStatsResponse,
  PetMonitorBehaviorTimelineResponse,
  PetMonitorCameraIndex,
  PetMonitorCameraSnapshot,
  PetMonitorSetupStatus,
  PetMonitorVideoRecord,
} from '../../../types/lib/monitoring';

export interface PetMonitorCameraSnapshotItem {
  cameraKey: string;
  camId: PetMonitorCameraIndex | null;
  snapshot: PetMonitorCameraSnapshot;
}

const BEHAVIOR_COLORS: Record<string, string> = {
  resting: '#94a3b8',
  rest: '#94a3b8',
  sleep: '#94a3b8',
  sleeping: '#94a3b8',
  active: '#f97316',
  activity: '#f97316',
  moving: '#f97316',
  eating: '#0d9488',
  eat: '#0d9488',
  drinking: '#06b6d4',
  drink: '#06b6d4',
  abnormal: '#e11d48',
};

const BEHAVIOR_LABELS: Record<string, string> = {
  resting: 'monitoring.behavior.resting',
  rest: 'monitoring.behavior.resting',
  sleep: 'monitoring.behavior.resting',
  sleeping: 'monitoring.behavior.resting',
  active: 'monitoring.behavior.active',
  activity: 'monitoring.behavior.active',
  moving: 'monitoring.behavior.active',
  eating: 'monitoring.behavior.eating',
  eat: 'monitoring.behavior.eating',
  drinking: 'monitoring.behavior.drinking',
  drink: 'monitoring.behavior.drinking',
};

function normalizeBehaviorKey(value?: string | null): string {
  return (value ?? '').trim().toLowerCase().replace(/\s+/g, '_');
}

function toDisplayBehavior(value?: string | null): string {
  const key = normalizeBehaviorKey(value);
  if (!key) return '監測中';
  if (['resting', 'rest', 'sleep', 'sleeping'].includes(key)) return '休息';
  if (['eating', 'eat'].includes(key)) return '吃飯';
  if (['drinking', 'drink'].includes(key)) return '喝水';
  if (['active', 'activity', 'moving'].includes(key)) return '活動';
  return value ?? key;
}

function toBehaviorLabel(value: string): string {
  const key = normalizeBehaviorKey(value);
  return BEHAVIOR_LABELS[key] ?? value;
}

function toBehaviorColor(value: string, index: number): string {
  const key = normalizeBehaviorKey(value);
  const fallbackColors = ['#0d9488', '#f97316', '#06b6d4', '#94a3b8', '#e11d48'];
  return BEHAVIOR_COLORS[key] ?? fallbackColors[index % fallbackColors.length];
}

function formatCameraId(camId: PetMonitorCameraIndex | null, fallback: string): string {
  return camId === null ? fallback : `cam-${camId}`;
}

function formatCameraName(camId: PetMonitorCameraIndex | null, snapshot?: PetMonitorCameraSnapshot): string {
  return snapshot?.stats.name?.trim() || (camId === null ? 'Pet monitor camera' : `Camera ${camId}`);
}

function getSnapshotBehavior(snapshot: PetMonitorCameraSnapshot): string {
  const activeState = Object.values(snapshot.active_states ?? {})[0];
  return toDisplayBehavior(activeState?.state ?? activeState?.bowl ?? snapshot.logs?.[0]?.state ?? snapshot.stats.status);
}

function getStatusText(snapshot: PetMonitorCameraSnapshot): string {
  const { fps, yoloMs, ruleMs, isRecording } = snapshot.stats;
  const fpsText = Number.isFinite(fps) ? `${fps.toFixed(1)} fps` : 'stream online';
  const yoloText = Number.isFinite(yoloMs) ? `AI ${Math.round(yoloMs)}ms` : 'AI ready';
  const ruleText = Number.isFinite(ruleMs) ? `rules ${Math.round(ruleMs)}ms` : '';
  return [fpsText, yoloText, ruleText, isRecording ? 'recording' : null].filter(Boolean).join(' · ');
}

export function getCameraIdFromMonitorId(id?: string | null): PetMonitorCameraIndex | null {
  const match = id?.match(/\d+/);
  if (!match) return null;
  const camId = Number(match[0]);
  return Number.isFinite(camId) ? camId : null;
}

export function toPetMonitorCameraFeeds(
  snapshots: PetMonitorCameraSnapshotItem[],
  activeCameras: PetMonitorCameraIndex[] = [],
  setupStatus?: PetMonitorSetupStatus | null,
  getVideoFeedUrl?: (camId: PetMonitorCameraIndex) => string,
): CameraFeed[] {
  if (!snapshots.length && setupStatus?.selected_camera) {
    return [{
      id: 'cam-0',
      name: setupStatus.stream_name || setupStatus.selected_camera.name || 'Selected camera',
      isOnline: Boolean(setupStatus.stream_runtime_running),
      currentBehavior: setupStatus.stream_runtime_running ? '監測中' : '離線',
      isLive: Boolean(setupStatus.stream_runtime_running),
      vibeText: setupStatus.stream_url ? 'Stream configured' : 'Awaiting stream setup',
      streamUrl: setupStatus.stream_url,
      camId: 0,
    }];
  }

  return snapshots.map(({ cameraKey, camId, snapshot }) => {
    const isActive = camId === null ? true : activeCameras.length === 0 || activeCameras.includes(camId);
    const status = normalizeBehaviorKey(snapshot.stats.status);
    const isOnline = isActive && status !== 'offline' && status !== 'error';

    return {
      id: formatCameraId(camId, cameraKey),
      name: formatCameraName(camId, snapshot),
      isOnline,
      currentBehavior: getSnapshotBehavior(snapshot),
      bunnyId: formatCameraId(camId, cameraKey),
      bunnyName: formatCameraName(camId, snapshot),
      isLive: isOnline,
      vibeText: getStatusText(snapshot),
      streamUrl: camId === null ? undefined : getVideoFeedUrl?.(camId),
      camId,
    };
  });
}

export function toPetMonitorGuests(
  feeds: CameraFeed[],
  fallbackGuests: BunnyGuest[],
): BunnyGuest[] {
  if (!feeds.length) return fallbackGuests;

  return feeds.map((feed, index) => {
    const fallback = fallbackGuests[index % fallbackGuests.length];
    return {
      ...fallback,
      id: feed.id,
      name: feed.bunnyName || feed.name,
      breed: 'Pet monitor stream',
      checkInDate: 'Live monitoring',
      checkOutDate: 'Active',
      currentBehavior: feed.currentBehavior,
      humidity: fallback?.humidity ?? 60,
      temperature: fallback?.temperature ?? 25,
      notes: feed.isOnline ? 'Backend stream is connected and AI detection is running.' : 'Camera is offline or inactive.',
      extraServices: feed.vibeText || 'PetMonitor backend telemetry',
      status: feed.isOnline ? '監測中' : '離線',
    };
  });
}

export function toActivityCounts(
  behaviorStats?: PetMonitorBehaviorLogStatsResponse | null,
  snapshot?: PetMonitorCameraSnapshot | null,
): ActivityCount[] {
  const rawStats = behaviorStats?.stats && Object.keys(behaviorStats.stats).length
    ? behaviorStats.stats
    : Object.entries(snapshot?.active_states ?? {}).reduce<Record<string, number>>((acc, [key, state]) => {
      const label = state.state || state.bowl || key;
      acc[label] = (acc[label] ?? 0) + 1;
      return acc;
    }, {});

  return Object.entries(rawStats).map(([label, value], index) => ({
    label: toBehaviorLabel(label),
    value: Number.isFinite(value) ? value : 0,
    color: toBehaviorColor(label, index),
  }));
}

export function toStatsByTime(
  timeline?: PetMonitorBehaviorTimelineResponse | null,
  activityCounts: ActivityCount[] = [],
): StatByTime[] {
  if (timeline?.points?.length) {
    return timeline.points.map((point) => {
      const counts = point.counts ?? {};
      const activityCount = Object.values(counts).reduce((sum, value) => sum + value, 0);

      return {
        date: point.label,
        activityCount,
        restingCount: counts.resting ?? counts.rest ?? counts.sleeping ?? 0,
        eatingCount: counts.eating ?? counts.eat ?? 0,
        drinkingCount: counts.drinking ?? counts.drink ?? 0,
        averageOver3Days: activityCount,
      };
    });
  }

  const activityCount = activityCounts.reduce((sum, item) => sum + item.value, 0);
  return [
    { date: 'Previous', activityCount: 0, restingCount: 0, eatingCount: 0, drinkingCount: 0, averageOver3Days: activityCount },
    { date: 'Recent', activityCount, restingCount: 0, eatingCount: 0, drinkingCount: 0, averageOver3Days: activityCount },
    { date: 'Now', activityCount, restingCount: 0, eatingCount: 0, drinkingCount: 0, averageOver3Days: activityCount },
  ];
}

export function toBehaviorSummary(cameraName: string, totalActivities: number, hasBackendData: boolean): string {
  if (!hasBackendData) {
    return `${cameraName} is waiting for behavior history from the PetMonitor backend.`;
  }

  return `${cameraName} has ${totalActivities} behavior events in the selected monitoring window.`;
}

export function toActivityClips(
  records: PetMonitorVideoRecord[],
  getThumbnailUrl: (filename: string) => string,
): ActivityClip[] {
  return records.map((record) => ({
    id: String(record.id),
    timestamp: record.start_time,
    bunnyName: `Camera ${record.cam_id}`,
    action: record.trigger_action,
    thumbnailUrl: getThumbnailUrl(record.filename),
    videoUrl: record.filename,
    isUrgent: normalizeBehaviorKey(record.trigger_action).includes('abnormal'),
  }));
}
