import React from 'react';
import { Heart } from 'lucide-react';
import { ActivityLogFeedbackProps } from '../../../types';
import { useTranslation } from '../../../lib/i18n';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

export default function ActivityLogFeedback({
  liked,
  onToggleLike,
  comments,
  commentText,
  onCommentTextChange,
  onAddComment,
}: ActivityLogFeedbackProps) {
  const { t } = useTranslation();
  return (
    <div id="parent-letter-feedback-block" className="p-4 sm:p-8 bg-slate-50 border-t border-slate-100 space-y-6 select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="font-bold text-sm text-slate-700">{t('clientView.feedbackTitle')}</h4>
          <p className="text-xs text-slate-400 font-medium">{t('clientView.feedbackSubtitle')}</p>
        </div>

        <button
          onClick={onToggleLike}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            liked
              ? 'bg-rose-500 text-white shadow shadow-rose-200'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Heart className={`size-4 ${liked ? 'fill-current' : ''}`} />
          <span>{liked ? t('clientView.liked') : t('clientView.likeBtn')}</span>
        </button>
      </div>

      <div className="space-y-4">
        <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('clientView.commentsLabel')}</span>

        <div className="space-y-2.5">
          {comments.map((cmt, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-xl flex gap-2 text-xs">
              <div className="size-6 rounded-full bg-slate-100 text-slate-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                {t('clientView.commentAvatar')}
              </div>
              <div>
                <span className="font-bold text-slate-700 block mb-0.5">{t('clientView.commentAuthor')}</span>
                <span className="text-slate-500 font-semibold">{cmt}</span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onAddComment} className="flex gap-2">
          <Input
            type="text"
            value={commentText}
            onChange={(e) => onCommentTextChange(e.target.value)}
            placeholder={t('clientView.commentPlaceholder')}
            className="flex-1"
          />
          <Button type="submit">
            {t('clientView.commentSubmit')}
          </Button>
        </form>
      </div>
    </div>
  );
}