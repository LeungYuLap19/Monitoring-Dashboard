import React from 'react';
import { Heart } from 'lucide-react';

interface ActivityLogFeedbackProps {
  liked: boolean;
  onToggleLike: () => void;
  comments: string[];
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onAddComment: (e: React.FormEvent) => void;
}

export default function ActivityLogFeedback({
  liked,
  onToggleLike,
  comments,
  commentText,
  onCommentTextChange,
  onAddComment,
}: ActivityLogFeedbackProps) {
  return (
    <div id="parent-letter-feedback-block" className="p-4 sm:p-8 bg-slate-50 border-t border-slate-100 space-y-6 select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="font-bold text-sm text-slate-700">您對本日的住店小札感到滿意嗎？</h4>
          <p className="text-xs text-slate-400 font-medium">您的反饋是我們持續提供好品質兔子看護照料的最大動力！</p>
        </div>

        <button
          onClick={onToggleLike}
          className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
            liked
              ? 'bg-rose-500 text-white border-rose-500 shadow shadow-rose-200'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          <span>{liked ? '家長已按讚 ♥' : '給今天的小札按個讚'}</span>
        </button>
      </div>

      <div className="space-y-4">
        <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">家長即時留言 (留言板)</span>

        <div className="space-y-2.5">
          {comments.map((cmt, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-100 flex gap-2 text-xs">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                家
              </div>
              <div>
                <span className="font-bold text-slate-700 block mb-0.5">兔寶家長</span>
                <span className="text-slate-500 font-semibold">{cmt}</span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onAddComment} className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => onCommentTextChange(e.target.value)}
            placeholder="在此回填家長意见或回覆工作人員..."
            className="flex-1 text-xs font-semibold px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#0d9488] hover:bg-[#0c857a] text-white font-extrabold text-xs rounded-xl cursor-pointer"
          >
            發表留言
          </button>
        </form>
      </div>
    </div>
  );
}
