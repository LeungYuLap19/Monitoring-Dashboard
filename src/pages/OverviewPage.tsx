import { useState, useMemo } from 'react';
import { useLayoutContext } from '../hooks/useLayoutContext';
import { CAMERA_FEEDS } from '../constants';
import MetricsGrid from '../components/pages/overview/MetricsGrid';
import MonitoringHeader from '../components/pages/overview/MonitoringHeader';
import CameraFeedGrid from '../components/pages/overview/CameraFeedGrid';

export default function OverviewPage() {
  const { onSelectCamera } = useLayoutContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'online' | 'offline' | 'resting' | 'active'>('all');

  const filteredFeeds = useMemo(() => {
    return CAMERA_FEEDS.filter(feed => {
      const matchesSearch = feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (feed.bunnyName && feed.bunnyName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter =
        filterType === 'all' ? true :
        filterType === 'online' ? feed.isOnline :
        filterType === 'offline' ? !feed.isOnline :
        filterType === 'resting' ? feed.currentBehavior === '休息' :
        filterType === 'active' ? feed.currentBehavior === '活動' || feed.currentBehavior === '放風中' : true;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterType]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
  };

  return (
    <div id="page-overview" className="p-4 md:p-8 space-y-6 md:space-y-8 select-none">
      <MetricsGrid />
      <section id="monitoring-grid-container" className="space-y-6">
        <MonitoringHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterType={filterType}
          onFilterChange={setFilterType}
          onClearFilters={clearFilters}
        />
        <CameraFeedGrid
          feeds={filteredFeeds}
          onSelectCamera={onSelectCamera}
          onClearFilters={clearFilters}
        />
      </section>
    </div>
  );
}
