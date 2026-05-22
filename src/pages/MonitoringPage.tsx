import { useEffect, useMemo, useState } from 'react';
import { Database, WifiOff } from 'lucide-react';
import { useLayoutContext } from '../hooks/layout';
import { useTranslation } from '../lib/i18n';
import { useCameraPetMap } from '../hooks/pet';
import {
  usePetMonitorBehavior,
  usePetMonitorCameraConfig,
  usePetMonitorDashboard,
  usePetMonitorRecords,
} from '../hooks/monitoring';
import {
  getCameraIdFromMonitorId,
  toActivityCounts,
  toBehaviorSummary,
  toPetMonitorCameraFeeds,
  toStatsByTime,
} from '../lib/utils/services/pet-monitor-ui';
import BunnySelector from '../components/pages/monitoring/BunnySelector';
import BunnyProfileCard from '../components/pages/monitoring/BunnyProfileCard';
import LiveStreamView from '../components/pages/monitoring/LiveStreamView';
import BehaviorStats from '../components/pages/monitoring/BehaviorStats';
import { Button } from '../components/ui/button';

function formatPetMonitorDateTime(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function MonitoringPlaceholder({
  icon,
  title,
  message,
  onReconnect,
  reconnectDisabled = false,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  onReconnect?: () => void;
  reconnectDisabled?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-dashed border-slate-200 p-8 text-center space-y-3">
      <div className="flex justify-center">{icon}</div>
      <div className="space-y-1">
        <p className="text-sm font-extrabold text-slate-700">{title}</p>
        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">{message}</p>
      </div>
      {onReconnect ? (
        <div className="pt-2">
          <Button variant="outline" onClick={onReconnect} disabled={reconnectDisabled}>
            Reconnect
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default function MonitoringPage() {
  const { selectedBunnyId, setSelectedBunnyId, onOpenClipsModal, onGenerateLog } = useLayoutContext();
  const { t } = useTranslation();

  const [timeFilter, setTimeFilter] = useState<'1' | '3' | '7'>('3');
  const [streamActive, setStreamActive] = useState(true);
  const monitor = usePetMonitorDashboard({
    autoLoad: true,
    statsPollIntervalMs: 5000,
  });
  const behavior = usePetMonitorBehavior({ autoLoadLogs: false, autoLoadTimeline: false });
  const records = usePetMonitorRecords({ autoLoad: false });
  const cameraConfig = usePetMonitorCameraConfig({ autoLoad: false });
  const { cameraPetMap } = useCameraPetMap();
  const { loadBehaviorStats, loadBehaviorTimeline } = behavior;
  const { loadRecords } = records;
  const { loadCameraConfig } = cameraConfig;
  const { getCameraSnapshot } = monitor.stats;

  const cameraFeeds = useMemo(() => {
    const feeds = toPetMonitorCameraFeeds(
      monitor.stats.cameraSnapshots,
      monitor.activeCameras.activeCameras,
      null,
      monitor.urls.getVideoFeedUrl,
    );
    return feeds.map((feed) => {
      const petInfo = feed.deviceId ? cameraPetMap[feed.deviceId] : undefined;
      if (petInfo) {
        return { ...feed, bunnyName: petInfo.name, bunnyId: petInfo.petId };
      }
      return feed;
    });
  }, [
    cameraPetMap,
    monitor.activeCameras.activeCameras,
    monitor.stats.cameraSnapshots,
    monitor.urls.getVideoFeedUrl,
  ]);

  const activeFeed = useMemo(() => {
    if (!cameraFeeds.length) return null;
    return cameraFeeds.find((feed) => feed.id === selectedBunnyId) ?? cameraFeeds[0];
  }, [cameraFeeds, selectedBunnyId]);

  const selectedCamId = useMemo(
    () => getCameraIdFromMonitorId(activeFeed?.id),
    [activeFeed?.id],
  );

  const selectedSnapshot = useMemo(() => {
    if (selectedCamId === null) return null;
    return getCameraSnapshot(selectedCamId);
  }, [getCameraSnapshot, selectedCamId]);

  const hasMonitorError = Boolean(monitor.stats.error || monitor.activeCameras.error);
  const hasFeeds = cameraFeeds.length > 0;
  const hasCameraSelection = activeFeed !== null;

  useEffect(() => {
    if (!cameraFeeds.length) return;
    if (cameraFeeds.some((feed) => feed.id === selectedBunnyId)) return;
    setSelectedBunnyId(cameraFeeds[0].id);
  }, [cameraFeeds, selectedBunnyId, setSelectedBunnyId]);

  useEffect(() => {
    if (selectedCamId === null) return;

    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - Number(timeFilter));
    const startText = formatPetMonitorDateTime(start);
    const endText = formatPetMonitorDateTime(now);

    void loadBehaviorStats({
      cam_id: selectedCamId,
      start: startText,
      end: endText,
    }).catch(() => undefined);

    void loadBehaviorTimeline({
      cam_id: selectedCamId,
      start: startText,
      end: endText,
      bucket: timeFilter === '1' ? '1h' : '1d',
    }).catch(() => undefined);

    void loadRecords({ cam_id: selectedCamId }).catch(() => undefined);
    void loadCameraConfig(selectedCamId).catch(() => undefined);
  }, [loadBehaviorStats, loadBehaviorTimeline, loadCameraConfig, loadRecords, selectedCamId, timeFilter]);

  const backendActivityCounts = useMemo(
    () => toActivityCounts(behavior.behaviorStats, selectedSnapshot),
    [behavior.behaviorStats, selectedSnapshot],
  );
  const statsByTime = useMemo(
    () => (behavior.timeline?.points?.length ? toStatsByTime(behavior.timeline, backendActivityCounts) : []),
    [backendActivityCounts, behavior.timeline],
  );
  const totalActivities = useMemo(
    () => backendActivityCounts.reduce((acc, curr) => acc + curr.value, 0),
    [backendActivityCounts],
  );
  const avgOver3Days = useMemo(() => {
    if (!statsByTime.length) return 0;
    const total = statsByTime.reduce((sum, item) => sum + item.activityCount, 0);
    return Math.round(total / statsByTime.length);
  }, [statsByTime]);
  const behaviorSummary = useMemo(() => {
    if (!activeFeed) return t('monitoring.placeholders.noCameraSelectedSummary');
    return toBehaviorSummary(activeFeed.bunnyName || activeFeed.name, totalActivities, totalActivities > 0 || statsByTime.length > 0);
  }, [activeFeed, statsByTime.length, t, totalActivities]);

  const livePlaceholder = useMemo(() => {
    if (hasMonitorError) {
      return {
        title: t('monitoring.placeholders.failedToConnect'),
        message: t('monitoring.placeholders.failedToConnectMsg'),
      };
    }
    if (!hasCameraSelection) {
      return {
        title: t('monitoring.placeholders.noCameraData'),
        message: t('monitoring.placeholders.noCameraDataMsg'),
      };
    }
    if (!activeFeed?.streamUrl && !activeFeed?.isLive) {
      return {
        title: t('monitoring.placeholders.noLiveStream'),
        message: t('monitoring.placeholders.noLiveStreamMsg'),
      };
    }
    return null;
  }, [activeFeed, hasCameraSelection, hasMonitorError, t]);

  const statsPlaceholder = useMemo(() => {
    if (behavior.statsError || behavior.timelineError || hasMonitorError) {
      return {
        title: t('monitoring.placeholders.behaviorUnavailable'),
        message: t('monitoring.placeholders.behaviorUnavailableMsg'),
      };
    }
    if (!hasCameraSelection) {
      return {
        title: t('monitoring.placeholders.noCameraSelected'),
        message: t('monitoring.placeholders.noCameraSelectedMsg'),
      };
    }
    if (!backendActivityCounts.length || !statsByTime.length) {
      return {
        title: t('monitoring.placeholders.noData'),
        message: t('monitoring.placeholders.noDataMsg'),
      };
    }
    return null;
  }, [
    backendActivityCounts.length,
    behavior.statsError,
    behavior.timelineError,
    hasCameraSelection,
    hasMonitorError,
    statsByTime.length,
    t,
  ]);

  return (
    <div id="page-monitoring" className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 select-none">
      <div id="monitoring-left" className="col-span-1 lg:col-span-8 space-y-6">
        {hasFeeds ? (
          <BunnySelector
            selectedBunnyId={activeFeed?.id ?? selectedBunnyId}
            setSelectedBunnyId={setSelectedBunnyId}
            cameraFeeds={cameraFeeds}
          />
        ) : hasMonitorError ? (
          <MonitoringPlaceholder
            icon={<WifiOff className="size-8 text-rose-500" />}
            title={t('monitoring.placeholders.failedToConnect')}
            message={t('monitoring.placeholders.failedToConnectMsg')}
            onReconnect={monitor.isBlocked ? () => void monitor.reconnectDashboard().catch(() => undefined) : undefined}
            reconnectDisabled={monitor.isLoading}
          />
        ) : (
          <MonitoringPlaceholder
            icon={<Database className="size-8 text-slate-400" />}
            title={t('monitoring.placeholders.noData')}
            message={t('monitoring.placeholders.noFeedsBackend')}
            onReconnect={monitor.isBlocked ? () => void monitor.reconnectDashboard().catch(() => undefined) : undefined}
            reconnectDisabled={monitor.isLoading}
          />
        )}

        {activeFeed ? (
          <>
            <BunnyProfileCard
              activeFeed={activeFeed}
              snapshot={selectedSnapshot}
              onOpenClipsModal={onOpenClipsModal}
            />
            <LiveStreamView
              activeFeed={activeFeed}
              streamActive={streamActive}
              setStreamActive={setStreamActive}
              streamUrl={activeFeed.streamUrl}
              camId={selectedCamId}
              statusText={activeFeed.vibeText ?? cameraConfig.config?.yolo_fps_mode ?? null}
              placeholder={livePlaceholder}
            />
          </>
        ) : (
          <MonitoringPlaceholder
            icon={<Database className="size-8 text-slate-400" />}
            title={t('monitoring.placeholders.noData')}
            message={t('monitoring.placeholders.noProfile')}
            onReconnect={monitor.isBlocked ? () => void monitor.reconnectDashboard().catch(() => undefined) : undefined}
            reconnectDisabled={monitor.isLoading}
          />
        )}
      </div>
      <BehaviorStats
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        summary={behaviorSummary}
        avgOver3Days={avgOver3Days}
        statsByTime={statsByTime}
        activeCategory={backendActivityCounts}
        totalActivities={totalActivities}
        onGenerateLog={onGenerateLog}
        isLoading={behavior.isLoadingStats || behavior.isLoadingTimeline || monitor.stats.isLoading}
        error={behavior.statsError ?? behavior.timelineError ?? monitor.error}
        placeholder={statsPlaceholder}
      />
    </div>
  );
}
