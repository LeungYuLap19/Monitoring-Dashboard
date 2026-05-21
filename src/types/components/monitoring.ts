import { BunnyGuest, ActivityCount, StatByTime } from '../constants/domain';

export type FilterCategory = 'all' | 'active' | 'eat' | 'drink' | 'abnormal';

export interface BunnySelectorProps {
  selectedBunnyId: string;
  setSelectedBunnyId: (id: string) => void;
  bunnyGuests: BunnyGuest[];
}

export interface BunnyProfileCardProps {
  activeBunny: BunnyGuest;
  onOpenClipsModal: () => void;
}

export interface LiveStreamViewProps {
  activeBunny: BunnyGuest;
  streamActive: boolean;
  setStreamActive: (active: boolean) => void;
}

export interface BehaviorStatsProps {
  timeFilter: '1' | '3' | '7';
  setTimeFilter: (value: '1' | '3' | '7') => void;
  summary: string;
  avgOver3Days: number;
  statsByTime: StatByTime[];
  activeCategory: ActivityCount[];
  totalActivities: number;
  onGenerateLog: () => void;
}

export interface ClipSelectorModalProps {
  bunnyName: string;
  onClose: () => void;
}

export interface ActivityLogPreviewModalProps {
  bunnyId: string;
  onClose: () => void;
  onSendSuccess: (logId: string) => void;
}
