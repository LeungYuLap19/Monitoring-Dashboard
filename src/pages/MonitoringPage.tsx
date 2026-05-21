import { useEffect, useMemo, useState } from 'react';
import { useLayoutContext } from '../hooks/layout';
import {
  usePetMonitorBehavior,
  usePetMonitorCameraConfig,
  usePetMonitorDashboard,
  usePetMonitorRecords,
} from '../hooks/monitoring';
import { BUNNY_GUESTS, BEHAVIOR_STATS } from '../constants';
import {
  getCameraIdFromMonitorId,
  toActivityCounts,
  toBehaviorSummary,
  toPetMonitorCameraFeeds,
  toPetMonitorGuests,
  toStatsByTime,
} from '../lib/utils/services/pet-monitor-ui';
import BunnySelector from '../components/pages/monitoring/BunnySelector';
import BunnyProfileCard from '../components/pages/monitoring/BunnyProfileCard';
import LiveStreamView from '../components/pages/monitoring/LiveStreamView';
import BehaviorStats from '../components/pages/monitoring/BehaviorStats';
import PetMonitorSetupPanel from '../components/pages/monitoring/PetMonitorSetupPanel';

export default function MonitoringPage() {
  const { selectedBunnyId, setSelectedBunnyId, onOpenClipsModal, onGenerateLog } = useLayoutContext();

  const [timeFilter, setTimeFilter] = useState<'1' | '3' | '7'>('3');
  const [streamActive, setStreamActive] = useState(true);
  const monitor = usePetMonitorDashboard({
    autoLoad: true,
    statsPollIntervalMs: 5000,
  });
  const behavior = usePetMonitorBehavior({ autoLoadLogs: false, autoLoadTimeline: false });
  const records = usePetMonitorRecords({ autoLoad: false });
  const cameraConfig = usePetMonitorCameraConfig({ autoLoad: false });
  const { loadBehaviorStats, loadBehaviorTimeline } = behavior;
  const { loadRecords } = records;
  const { loadCameraConfig } = cameraConfig;
  const { getCameraSnapshot } = monitor.stats;

  const cameraFeeds = useMemo(() => {
    const backendFeeds = toPetMonitorCameraFeeds(
      monitor.stats.cameraSnapshots,
      monitor.activeCameras.activeCameras,
      monitor.setup.setupStatus,
      monitor.urls.getVideoFeedUrl,
    );

    return backendFeeds.length ? backendFeeds : [];
  }, [
    monitor.activeCameras.activeCameras,
    monitor.setup.setupStatus,
    monitor.stats.cameraSnapshots,
    monitor.urls.getVideoFeedUrl,
  ]);

  const monitorGuests = useMemo(
    () => toPetMonitorGuests(cameraFeeds, BUNNY_GUESTS),
    [cameraFeeds],
  );

  const activeBunny = useMemo(() => {
    return monitorGuests.find(b => b.id === selectedBunnyId) || monitorGuests[0] || BUNNY_GUESTS[0];
  }, [monitorGuests, selectedBunnyId]);

  const selectedCamId = useMemo(
    () => getCameraIdFromMonitorId(activeBunny.id),
    [activeBunny.id],
  );

  const activeFeed = useMemo(() => {
    return cameraFeeds.find((feed) => feed.id === activeBunny.id) ?? null;
  }, [activeBunny.id, cameraFeeds]);

  const selectedSnapshot = useMemo(() => {
    if (selectedCamId === null) return null;
    return getCameraSnapshot(selectedCamId);
  }, [getCameraSnapshot, selectedCamId]);

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

    void loadBehaviorStats({
      cam_id: selectedCamId,
      start: start.toISOString(),
      end: now.toISOString(),
    }).catch(() => undefined);

    void loadBehaviorTimeline({
      cam_id: selectedCamId,
      start: start.toISOString(),
      end: now.toISOString(),
      bucket: timeFilter === '1' ? '1h' : '1d',
    }).catch(() => undefined);

    void loadRecords({ cam_id: selectedCamId }).catch(() => undefined);
    void loadCameraConfig(selectedCamId).catch(() => undefined);
  }, [loadBehaviorStats, loadBehaviorTimeline, loadCameraConfig, loadRecords, selectedCamId, timeFilter]);

  const bunnyStatsObj = useMemo(() => {
    return BEHAVIOR_STATS[activeBunny.id] || BEHAVIOR_STATS.momo;
  }, [activeBunny]);

  const backendActivityCounts = useMemo(
    () => toActivityCounts(behavior.behaviorStats, selectedSnapshot),
    [behavior.behaviorStats, selectedSnapshot],
  );
  const activeCategory = backendActivityCounts.length ? backendActivityCounts : bunnyStatsObj.activityCounts;
  const totalActivities = useMemo(() => {
    return activeCategory.reduce((acc, curr) => acc + curr.value, 0);
  }, [activeCategory]);
  const statsByTime = useMemo(() => {
    const mappedStats = toStatsByTime(behavior.timeline, activeCategory);
    return behavior.timeline?.points?.length ? mappedStats : bunnyStatsObj.statsByTime;
  }, [activeCategory, behavior.timeline, bunnyStatsObj.statsByTime]);
  const avgOver3Days = useMemo(() => {
    if (!statsByTime.length) return bunnyStatsObj.avgOver3Days;
    const total = statsByTime.reduce((sum, item) => sum + item.activityCount, 0);
    return Math.round(total / statsByTime.length);
  }, [bunnyStatsObj.avgOver3Days, statsByTime]);
  const behaviorSummary = useMemo(() => (
    backendActivityCounts.length || behavior.timeline?.points?.length
      ? toBehaviorSummary(activeBunny.name, totalActivities, true)
      : bunnyStatsObj.summary
  ), [activeBunny.name, backendActivityCounts.length, behavior.timeline?.points?.length, bunnyStatsObj.summary, totalActivities]);

  return (
    <div id="page-monitoring" className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 select-none">
      <div id="monitoring-left" className="col-span-1 lg:col-span-8 space-y-6">
        {(!monitor.setup.setupStatus?.setup_complete || monitor.setup.error) && (
          <PetMonitorSetupPanel
            setupStatus={monitor.setup.setupStatus}
            onSetupChanged={monitor.setup.refreshSetupStatus}
          />
        )}
        <BunnySelector
          selectedBunnyId={selectedBunnyId}
          setSelectedBunnyId={setSelectedBunnyId}
          bunnyGuests={monitorGuests}
        />
        <BunnyProfileCard
          activeBunny={activeBunny}
          onOpenClipsModal={onOpenClipsModal}
        />
        <LiveStreamView
          activeBunny={activeBunny}
          streamActive={streamActive}
          setStreamActive={setStreamActive}
          streamUrl={activeFeed?.streamUrl}
          camId={selectedCamId}
          statusText={activeFeed?.vibeText ?? cameraConfig.config?.yolo_fps_mode ?? null}
        />
      </div>
      <BehaviorStats
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        summary={behaviorSummary}
        avgOver3Days={avgOver3Days}
        statsByTime={statsByTime}
        activeCategory={activeCategory}
        totalActivities={totalActivities}
        onGenerateLog={onGenerateLog}
        isLoading={behavior.isLoadingStats || behavior.isLoadingTimeline || monitor.stats.isLoading}
        error={behavior.statsError ?? behavior.timelineError ?? monitor.error}
      />
    </div>
  );
}
