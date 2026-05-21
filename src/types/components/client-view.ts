import { ActivityCount } from '../constants/domain';

export interface ActivityLogBannerProps {
  bunnyName: string;
}

export interface ActivityLogHeroProps {
  bunnyName: string;
}

export interface ActivityLogSummaryProps {
  bunnyName: string;
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
