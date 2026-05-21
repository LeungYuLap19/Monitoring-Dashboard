import { CameraFeed } from '../constants/domain';

export interface MonitoringHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterType: 'all' | 'online' | 'offline' | 'resting' | 'active';
  onFilterChange: (value: 'all' | 'online' | 'offline' | 'resting' | 'active') => void;
  onClearFilters: () => void;
}

export interface CameraFeedGridProps {
  feeds: CameraFeed[];
  onSelectCamera: (camId: string) => void;
  onClearFilters: () => void;
}

export interface CameraCardProps {
  feed: CameraFeed;
  onSelectCamera: (camId: string) => void;
}
