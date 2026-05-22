import React, { useState } from 'react';
import { useLayoutContext } from '../hooks/layout';
import { PET_GUESTS, BEHAVIOR_STATS } from '../constants';
import { useTranslation } from '../lib/i18n';
import ActivityLogBanner from '../components/pages/client-view/ActivityLogBanner';
import ActivityLogHero from '../components/pages/client-view/ActivityLogHero';
import ActivityLogSummary from '../components/pages/client-view/ActivityLogSummary';
import ActivityLogStats from '../components/pages/client-view/ActivityLogStats';
import ActivityLogHealth from '../components/pages/client-view/ActivityLogHealth';
import ActivityLogClips from '../components/pages/client-view/ActivityLogClips';
import ActivityLogFeedback from '../components/pages/client-view/ActivityLogFeedback';

export default function ClientViewPage() {
  const { selectedPetId } = useLayoutContext();
  const { t } = useTranslation();

  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([
    '看到牠有好好喝水就放心了！辛苦你們工作人員了 ♥',
    '今天在放風區跳很高，看來適應得很棒呢！'
  ]);

  const activePet = PET_GUESTS.find(b => b.id === selectedPetId) || PET_GUESTS[0];
  const statsObj = BEHAVIOR_STATS[activePet.id] || BEHAVIOR_STATS.momo;
  const totalActivities = statsObj.activityCounts.reduce((acc, curr) => acc + curr.value, 0);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([...comments, commentText.trim()]);
    setCommentText('');
  };

  return (
    <div id="page-client-view" className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8 select-none">
      <ActivityLogBanner petName={activePet.name} />
      <div id="parent-letter-container" className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <ActivityLogHero petName={activePet.name} />
        <div id="letter-sheet-body" className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          <ActivityLogSummary petName={activePet.name} totalActivities={totalActivities} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            <ActivityLogStats activityCounts={statsObj.activityCounts} />
            <ActivityLogHealth />
          </div>
          <ActivityLogClips />
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 mt-4 text-xs font-medium text-slate-500 leading-normal">
            <span className="block font-bold text-slate-700 mb-0.5">{t('clientView.tipTitle')}</span>
            {t('clientView.tipContent')}
          </div>
        </div>
        <ActivityLogFeedback
          liked={liked}
          onToggleLike={() => setLiked(!liked)}
          comments={comments}
          commentText={commentText}
          onCommentTextChange={setCommentText}
          onAddComment={handleAddComment}
        />
      </div>
    </div>
  );
}
