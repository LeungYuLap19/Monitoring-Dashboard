import { ActivityCount } from '../constants/domain';

export interface ActivityLogBannerProps {
  petName: string;
}

export interface ActivityLogHeroProps {
  petName: string;
}

export interface ActivityLogSummaryProps {
  petName: string;
  totalActivities: number;
}

export interface ActivityLogStatsProps {
  activityCounts: ActivityCount[];
}

export interface ActivityLogFeedbackProps {
  liked: boolean;
  onToggleLike: () => void;
  comments: string[];
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onAddComment: (e: React.FormEvent) => void;
}
