import { useState, useMemo } from 'react';
import { useLayoutContext } from '../hooks/useLayoutContext';
import { BUNNY_GUESTS, BEHAVIOR_STATS } from '../constants';
import BunnySelector from '../components/pages/monitoring/BunnySelector';
import BunnyProfileCard from '../components/pages/monitoring/BunnyProfileCard';
import LiveStreamView from '../components/pages/monitoring/LiveStreamView';
import BehaviorStats from '../components/pages/monitoring/BehaviorStats';

export default function MonitoringPage() {
  const { selectedBunnyId, setSelectedBunnyId, onOpenClipsModal, onGenerateLog } = useLayoutContext();

  const [timeFilter, setTimeFilter] = useState<'1' | '3' | '7'>('3');
  const [streamActive, setStreamActive] = useState(true);

  const activeBunny = useMemo(() => {
    return BUNNY_GUESTS.find(b => b.id === selectedBunnyId) || BUNNY_GUESTS[0];
  }, [selectedBunnyId]);

  const bunnyStatsObj = useMemo(() => {
    return BEHAVIOR_STATS[activeBunny.id] || BEHAVIOR_STATS.momo;
  }, [activeBunny]);

  const activeCategory = bunnyStatsObj.activityCounts;
  const totalActivities = useMemo(() => {
    return activeCategory.reduce((acc, curr) => acc + curr.value, 0);
  }, [activeCategory]);

  return (
    <div id="page-monitoring" className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 select-none">
      <div id="monitoring-left" className="col-span-1 lg:col-span-8 space-y-6">
        <BunnySelector
          selectedBunnyId={selectedBunnyId}
          setSelectedBunnyId={setSelectedBunnyId}
          bunnyGuests={BUNNY_GUESTS}
        />
        <BunnyProfileCard
          activeBunny={activeBunny}
          onOpenClipsModal={onOpenClipsModal}
        />
        <LiveStreamView
          activeBunny={activeBunny}
          streamActive={streamActive}
          setStreamActive={setStreamActive}
        />
      </div>
      <BehaviorStats
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        summary={bunnyStatsObj.summary}
        avgOver3Days={bunnyStatsObj.avgOver3Days}
        statsByTime={bunnyStatsObj.statsByTime}
        activeCategory={activeCategory}
        totalActivities={totalActivities}
        onGenerateLog={onGenerateLog}
      />
    </div>
  );
}
