/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Check, Save, Share2, Eye, ShieldAlert, MonitorUp, EyeOff, Loader2, PlayCircle } from 'lucide-react';
import { BunnyGuest, ActivityClip, ActivityLogPreviewModalProps } from '../../../types';
import { BUNNY_GUESTS, ACTIVITY_CLIPS, BEHAVIOR_STATS } from '../../../constants';
import { useTranslation } from '../../../lib/i18n';

export default function ActivityLogPreviewModal({
  bunnyId,
  onClose,
  onSendSuccess
}: ActivityLogPreviewModalProps) {
  const { t } = useTranslation();
  const activeBunny = BUNNY_GUESTS.find(b => b.id === bunnyId) || BUNNY_GUESTS[0];
  const statsObj = BEHAVIOR_STATS[activeBunny.id] || BEHAVIOR_STATS.momo;

  const [includeClips, setIncludeClips] = useState(true);
  const [remarks, setRemarks] = useState(activeBunny.extraServices);
  const [sending, setSending] = useState(false);

  const totalActivities = statsObj.activityCounts.reduce((acc, curr) => acc + curr.value, 0);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onSendSuccess(activeBunny.id);
    }, 1200);
  };

  return (
    <div id="modal-container-log" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto select-none">
      
      {/* Modal main sheet */}
      <div id="modal-sheet" className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header bar */}
        <div id="modal-header" className="px-4 sm:px-8 py-4 border-b border-slate-100 flex justify-between items-center select-none shrink-0 bg-slate-50/50">
          <div>
            <h3 className="text-base font-black text-slate-800">{t('monitoring.logPreview.title')}</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{t('monitoring.logPreview.description')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2 text-xs text-slate-400 hover:text-slate-600 font-bold flex items-center gap-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>{t('common.close')}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div id="modal-body" className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6 flex-1 bg-slate-100/50">
          
          {/* Settings panel to configure options */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-2">
            <div className="flex items-center gap-3">
              <input
                id="checkbox-clips"
                type="checkbox"
                checked={includeClips}
                onChange={(e) => setIncludeClips(e.target.checked)}
                className="w-4.5 h-4.5 text-teal-600 border-slate-200 rounded focus:ring-teal-500 cursor-pointer"
              />
              <label htmlFor="checkbox-clips" className="text-xs font-bold text-slate-700 cursor-pointer">
                {t('monitoring.logPreview.includeClips')}
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-end text-xs text-slate-400 font-medium w-full md:w-auto">
              <span>{t('monitoring.logPreview.remarksLabel')}</span>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="px-3 py-1.5 border border-slate-100 bg-slate-50 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs w-full sm:w-64"
                placeholder={t('monitoring.logPreview.remarksPlaceholder')}
              />
            </div>
          </div>

          {/* Letter / Layout form wrapper (Mirroring Image 1 & 2 exactly) */}
          <div id="log-invoice-view" className="bg-white p-4 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-6 lg:gap-8">
            
            {/* Left core column: summary stats */}
            <div className="flex-1 space-y-8">
              
              {/* Branding and Title */}
              <div className="border-b border-teal-50 pb-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0d9488] flex items-center justify-center font-bold text-xs text-white">HK</div>
                  <span className="text-xs font-extrabold text-[#0d9488] uppercase tracking-wide">救兔之家 HKBR Bunny Hotel</span>
                </div>
                <h4 className="text-lg font-black text-slate-800 tracking-tight">
                  <span className="text-teal-600">{activeBunny.name}</span> 4月16日 的活動日誌
                </h4>
              </div>

              {/* Behavior summary speech Bubble */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-teal-600 font-bold">
                  <span>🍀</span>
                  <span>今日整體行為摘要:</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold bg-[#f0fdf4]/40 p-4 rounded-xl border border-teal-50">
                  {activeBunny.name}今天大部分時間都在休息，期間監測到{totalActivities}次行為，比昨天多。
                  我們觀察到其情緒安穩，且主動探索新擺設的乾淨食盆。
                </p>
              </div>

              {/* Average statistics comparison widget */}
              <div className="space-y-3">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">活動頻次 (過去3天對比平均值)</span>
                
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-50/50 flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="block text-2xl font-black text-slate-800 leading-none">
                      {statsObj.statsByTime[2].activityCount} <span className="text-[10px] text-slate-400 font-semibold">次/天</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">3天平均值: {statsObj.avgOver3Days}次/天</span>
                  </div>

                  <div className="flex gap-4">
                    {statsObj.statsByTime.map((d, index) => (
                      <div key={index} className="flex flex-col items-center gap-1 scale-90 origin-bottom">
                        <div className="w-3.5 bg-slate-200 h-10 rounded-t-sm flex items-end">
                          <div
                            className={`w-full rounded-t-sm ${index === 2 ? 'bg-[#0d9488]' : 'bg-slate-400'}`}
                            style={{ height: `${(d.activityCount / 12) * 100}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 lowercase">{d.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick counters grid */}
              <div className="space-y-3">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">今天捕捉行為明細</span>
                <div className="grid grid-cols-2 gap-4">
                  {statsObj.activityCounts.map((item, idx) => (
                    <div key={idx} className="bg-slate-50/30 p-3 rounded-xl border border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[11px] font-bold text-slate-600">{item.label}</span>
                      </div>
                      <span className="text-xs font-black text-slate-800">{item.value}次活動/天</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphical Line Trend overlay */}
              <div className="space-y-4">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">行為趨勢與對比昨日比較</span>
                
                <div className="h-20 w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <line x1="0" y1="10" x2="100" y2="10" stroke="#f1f5f9" strokeWidth="0.5" />
                    <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="0.5" />
                    <line x1="0" y1="30" x2="100" y2="30" stroke="#f1f5f9" strokeWidth="0.5" />

                    <polyline fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="1,1" points="20,25 50,32 80,35" />
                    <polyline fill="none" stroke="#0d9488" strokeWidth="1.2" points="20,22 50,30 80,34" />
                    <circle cx="20" cy="22" r="1.2" fill="#0d9488" />
                    <circle cx="50" cy="30" r="1.2" fill="#0d9488" />
                    <circle cx="80" cy="34" r="1.2" fill="#0d9488" />
                  </svg>
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold px-3 mt-1 uppercase">
                    <span>活動</span>
                    <span>進食</span>
                    <span>飲水</span>
                  </div>
                </div>
              </div>

              {/* Status footer information */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0d9488] bg-[#f0fdf4]/50 p-3 rounded-xl border border-teal-100/30">
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>今日捕捉到 0 次異常。健康觀測各項正常。</span>
                </div>

                <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-50 text-[11px] text-slate-500 leading-relaxed font-medium">
                  <span className="block font-bold text-slate-700 mb-0.5">放風特別記載:</span>
                  今日於上午10時23分在專屬放風草墊空間活動了30分鐘。步伐輕巧、精神飽滿，主動與工作人員互動。
                </div>
              </div>

            </div>

            {/* Right optional column: Video section clip stream preview */}
            {includeClips ? (
              <div id="log-clips-column" className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-dashed border-slate-200 pt-6 lg:pt-0 lg:pl-8 space-y-6">
                <div>
                  <h5 className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
                    <span>🎥</span>
                    <span>監控節選 Selected Videos</span>
                  </h5>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">AI 根據全天候活動事件為您自動節選出的精華短片</p>
                </div>

                {/* Simulated video cards */}
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm aspect-video bg-slate-950 group">
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 font-mono text-[10px] select-none">
                      <PlayCircle className="w-8 h-8 text-teal-600 mb-1 animate-pulse" />
                      <span>飲水精華片段</span>
                      <span className="text-[8px] text-slate-600 lowercase mt-0.5">clip_drinking.mp4</span>
                    </div>
                    {/* Event Timestamp HUD */}
                    <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] text-white font-mono">
                      12:44 下午 • 喝水 30s
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm aspect-video bg-slate-950 group">
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 font-mono text-[10px] select-none">
                      <PlayCircle className="w-8 h-8 text-teal-600 mb-1 animate-pulse" />
                      <span>休息睡眠片段</span>
                      <span className="text-[8px] text-slate-600 lowercase mt-0.5">clip_sleep.mp4</span>
                    </div>
                    {/* Event Timestamp HUD */}
                    <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] text-white font-mono">
                      15:40 下午 • 躺下 1min
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100 text-[10px] text-amber-700 leading-normal font-medium">
                  * 該模板為勾選了視頻節選的樣式，如果取消勾選，上方的片段預覽將不隨日誌發送。
                </div>
              </div>
            ) : (
              <div className="w-full md:w-80 shrink-0 bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center text-slate-400 gap-2">
                <EyeOff className="w-8 h-8 text-slate-300" />
                <span className="text-xs font-bold text-slate-400">不檢附視頻剪輯</span>
                <p className="text-[10px] text-slate-400 max-w-[180px] font-medium leading-relaxed">日誌將只發送文字與行為統計。已隱藏相機節選列。</p>
              </div>
            )}

          </div>

        </div>

        {/* Modal Actions Footer */}
        <div id="modal-footer" className="px-4 sm:px-8 py-4 border-t border-slate-100 flex justify-end items-center gap-3 select-none shrink-0 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            返回
          </button>
          
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-6 py-2.5 bg-teal-600 hover:bg-[#0c857a] text-white rounded-xl text-xs font-bold shadow-md shadow-teal-900/10 min-w-[110px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {sending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>發送中...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>發送日誌</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
