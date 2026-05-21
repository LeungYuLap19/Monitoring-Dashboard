import { BunnyGuest, ActivityCount, ActivityClip, StatByTime } from '../constants/domain';
import { PetMonitorSetupStatus } from '../lib/monitoring';

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
  streamUrl?: string | null;
  camId?: number | null;
  statusText?: string | null;
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
  isLoading?: boolean;
  error?: Error | null;
}

export interface ClipSelectorModalProps {
  bunnyName: string;
  onClose: () => void;
  clips?: ActivityClip[];
  getVideoUrl?: (clip: ActivityClip) => string | null;
}

export interface ActivityLogPreviewModalProps {
  bunnyId: string;
  onClose: () => void;
  onSendSuccess: (logId: string) => void;
}

export interface PetMonitorSetupPanelProps {
  setupStatus: PetMonitorSetupStatus | null;
  onSetupChanged: () => Promise<PetMonitorSetupStatus>;
}
