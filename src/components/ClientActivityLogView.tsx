/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, Heart, MessageSquare, BookOpen, Share2, Sparkles, Check, PlayCircle } from 'lucide-react';
import { BUNNY_GUESTS, BEHAVIOR_STATS } from '../data';

interface ClientActivityLogViewProps {
  selectedBunnyId: string;
}

export default function ClientActivityLogView({ selectedBunnyId }: ClientActivityLogViewProps) {
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([
    '看到牠有好好喝水就放心了！辛苦你們工作人員了 ♥',
    '今天在放風區跳很高，看來適應得很棒呢！'
  ]);

  const activeBunny = BUNNY_GUESTS.find(b => b.id === selectedBunnyId) || BUNNY_GUESTS[0];
  const statsObj = BEHAVIOR_STATS[activeBunny.id] || BEHAVIOR_STATS.momo;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([...comments, commentText.trim()]);
    setCommentText('');
  };

  const totalActivities = statsObj.activityCounts.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div id="client-activity-log-view" className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8 select-none">
      
      {/* Upper simulated banner */}
      <div id="simulated-browser-note" className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 rounded-2xl text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-1.5 text-yellow-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>家長觀看視角模擬 Parent Viewport Mode</span>
          </div>
          <h3 className="text-base font-black">家長端手機/平板查閱體驗</h3>
          <p className="text-xs text-teal-50/80 font-medium">這是兔寶家長在手機上點擊日誌連結後，所呈現的精心排版頁面。</p>
        </div>

        <div className="text-xs font-bold bg-white text-[#0d9488] px-4 py-2 rounded-xl flex items-center gap-1.5 shadow">
          <span>模擬中 • 觀察兔兔:</span>
          <span className="font-black text-rose-600">{activeBunny.name}</span>
        </div>
      </div>

      {/* Main Container mirroring iPhone/iPad center screen layout (Image 1 & 2) */}
      <div id="parent-letter-container" className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        
        {/* Banner with a customized theme background */}
        <div id="letter-hero-banner" className="bg-[#097939] p-5 sm:p-8 text-white relative">
          <div className="absolute right-6 bottom-4 text-white/5 font-black text-6xl tracking-widest leading-none pointer-events-none">
            HKBR
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2 flex-1 min-w-0">
              <span className="text-[10px] font-black bg-white/20 text-yellow-300 px-2.5 py-0.5 rounded-full tracking-widest uppercase">
                HKBR 每日活動日誌
              </span>
              <h2 className="text-xl font-bold font-display">{activeBunny.name} 今天的住店小札 📝</h2>
              <p className="text-xs text-emerald-50/80 font-medium font-sans">
                親愛的 {activeBunny.name} 家長：以下是寶貝本日（4月16日）在 救兔之家 的智慧活動日誌
              </p>
            </div>
            {/* Round avatar image */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white bg-white/20 flex items-center justify-center text-[#fef08a] font-black text-sm sm:text-base select-none shrink-0"
              title={activeBunny.name}
            >
              {activeBunny.name.substring(0, 2)}
            </div>
          </div>
        </div>

        {/* Core Sheet letter */}
        <div id="letter-sheet-body" className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          
          {/* Section 1: Behavior summary card */}
          <div className="space-y-3">
            <span className="block text-xs font-black text-slate-400 uppercase tracking-widest">整體行為分析 Summary</span>
            <p className="text-sm text-slate-600 leading-relaxed font-semibold bg-slate-50 p-5 rounded-2xl border border-slate-100/50">
              {activeBunny.name} 今天適應良好。智慧監測顯示，寶貝今天共完成了 <span className="text-teal-600 font-extrabold">{totalActivities}次</span> 各類行為，
              比昨日稍多。其中，其進食狀態極為穩定，休息時間充足安穩。我們會繼續為寶貝追蹤照料。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            
            {/* Behavior distribution donut charts */}
            <div className="bg-slate-50/20 p-6 rounded-2xl border border-slate-100/50 space-y-4">
              <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">今日捕捉行為明細 Stats</span>
              
              <div className="space-y-3">
                {statsObj.activityCounts.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="text-slate-800">{item.value} 次/天</span>
                    </div>
                    {/* Visual custom progress bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ backgroundColor: item.color, width: `${(item.value / 12) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Checklist items */}
            <div className="bg-[#f0fdf4]/40 p-6 rounded-2xl border border-teal-100/30 space-y-4">
              <span className="block text-[11px] font-black text-teal-600 uppercase tracking-widest">健康與照護巡邏 Patrol Logs</span>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold bg-[#f0fdf4] p-3 rounded-xl border border-teal-100/50">
                  <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  <span>全日無異常事件。活動健康度 100%</span>
                </div>

                <div className="text-slate-600 leading-relaxed font-medium space-y-2">
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-1.5">
                    <span className="font-bold">飲食攝水量:</span>
                    <span className="font-semibold text-[#0d9488]">充足 (良好)</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-1.5">
                    <span className="font-bold">排便狀態:</span>
                    <span className="font-semibold text-emerald-600">正常且顆粒碩大</span>
                  </div>
                  <div className="flex justify-between pb-1.5">
                    <span className="font-bold">感官及精神:</span>
                    <span className="font-semibold text-[#0d9488]">活力飽滿</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Section 3: Live Clips player with cover */}
          <div className="space-y-4">
            <span className="block text-xs font-black text-slate-400 uppercase tracking-widest">📹 本日智慧節選片段 Clipped Videos</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm aspect-video bg-slate-950 group">
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 font-mono text-[10px] select-none">
                  <PlayCircle className="w-8 h-8 text-teal-600 mb-1 animate-pulse" />
                  <span>飲水精華片段</span>
                  <span className="text-[8px] text-slate-600 lowercase mt-0.5">clip_drinking.mp4</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white font-mono">
                  12:44 下午 • 喝水 30s
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm aspect-video bg-slate-950 group">
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 font-mono text-[10px] select-none">
                  <PlayCircle className="w-8 h-8 text-teal-600 mb-1 animate-pulse" />
                  <span>休息睡眠片段</span>
                  <span className="text-[8px] text-slate-600 lowercase mt-0.5">clip_sleep.mp4</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white font-mono">
                  15:40 下午 • 放風躺下休息 1min
                </div>
              </div>
            </div>
          </div>

          {/* Parting words */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 mt-4 text-xs font-medium text-slate-500 leading-normal">
            <span className="block font-bold text-slate-700 mb-0.5">🐾 溫馨叮嚀:</span>
            兔子通常在傍晚與清晨氣候溫和時活動能力較大。如您對日誌內容有任何疑問，或想瞭解更多寶貝照拂狀況，請隨時使用右下角聯絡工作人員，我們會在第一時間爲您解答！祝兔寶入住愉快！
          </div>

        </div>

        {/* Interactive feedback card for parents */}
        <div id="parent-letter-feedback-block" className="p-4 sm:p-8 bg-slate-50 border-t border-slate-100 space-y-6 select-none">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-bold text-sm text-slate-700">您對本日的住店小札感到滿意嗎？</h4>
              <p className="text-xs text-slate-400 font-medium">您的反饋是我們持續提供好品質兔子看護照料的最大動力！</p>
            </div>

            {/* Like button */}
            <button
              onClick={() => setLiked(!liked)}
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

          {/* Reviews column */}
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

            {/* Add Review input form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
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

      </div>

    </div>
  );
}
