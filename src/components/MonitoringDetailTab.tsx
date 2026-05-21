/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ChevronDown, RefreshCw, Sparkles, SlidersHorizontal, AlertCircle, PlayCircle, Eye, CheckCircle2, RefreshCw as LoopIcon, FileText, Video } from 'lucide-react';
import { BunnyGuest, CameraFeed } from '../types';
import { BUNNY_GUESTS, BEHAVIOR_STATS } from '../data';

interface MonitoringDetailTabProps {
  selectedBunnyId: string;
  setSelectedBunnyId: (id: string) => void;
  onOpenClipsModal: () => void;
  onGenerateLog: () => void;
}

export default function MonitoringDetailTab({
  selectedBunnyId,
  setSelectedBunnyId,
  onOpenClipsModal,
  onGenerateLog
}: MonitoringDetailTabProps) {
  const [timeFilter, setTimeFilter] = useState<'1' | '3' | '7'>('3');
  const [streamActive, setStreamActive] = useState(true);

  // Find currently active rabbit details
  const activeBunny = useMemo(() => {
    return BUNNY_GUESTS.find(b => b.id === selectedBunnyId) || BUNNY_GUESTS[0];
  }, [selectedBunnyId]);

  // Behavior metrics matched to current bunny
  const bunnyStatsObj = useMemo(() => {
    return BEHAVIOR_STATS[activeBunny.id] || BEHAVIOR_STATS.momo;
  }, [activeBunny]);

  const activeCategory = bunnyStatsObj.activityCounts;

  const totalActivities = useMemo(() => {
    return activeCategory.reduce((acc, curr) => acc + curr.value, 0);
  }, [activeCategory]);

  // Bunny image array mapping for dynamic stream simulation
  const bunnyStreams: Record<string, string> = {
    momo: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=800&h=500',
    koko: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800&h=500',
    pipi: 'https://images.unsplash.com/photo-1484557985045-eaa252be76fc?auto=format&fit=crop&q=80&w=800&h=500'
  };

  return (
    <div id="monitoring-detail-tab" className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 select-none">
      {/* LEFT COLUMN: Bunny profiling and Live stream player (8 cols out of 12) */}
      <div id="monitoring-left" className="col-span-1 lg:col-span-8 space-y-6">
        
        {/* Breadcrumbs & Quick switcher */}
        <div id="monitoring-breadcrumb" className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:px-6 sm:py-4 rounded-2xl border border-slate-50 shadow-sm gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold">快速監控 Monitoring</span>
            <span className="text-slate-300">/</span>
            <span className="text-teal-600 font-extrabold uppercase">籠內詳情 Details</span>
          </div>

          {/* Quick switcher dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-bold text-slate-400">目前觀看兔兔:</span>
            <div className="relative">
              <select
                id="active-bunny-selector"
                value={selectedBunnyId}
                onChange={(e) => setSelectedBunnyId(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-100 rounded-xl px-4 py-1.5 pr-8 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/10 cursor-pointer"
              >
                {BUNNY_GUESTS.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bunny Profiles Card */}
        <div id="bunny-metadata-card" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            {/* Main credentials block */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl border-2 border-slate-100 bg-teal-50 flex items-center justify-center text-teal-700 font-extrabold text-sm select-none shrink-0"
                title={activeBunny.name}
              >
                {activeBunny.name.substring(0, 2)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-800">{activeBunny.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeBunny.gender === '公' ? 'bg-sky-50 text-sky-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {activeBunny.gender === '公' ? '公 (Male)' : '母 (Female)'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-bold space-x-3">
                  <span>品種: {activeBunny.breed}</span>
                  <span>•</span>
                  <span>入院日: {activeBunny.checkInDate}</span>
                </div>
              </div>
            </div>

            {/* Microclimate telemetry */}
            <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-[11px] sm:text-xs text-slate-600 font-bold shrink-0 w-full md:w-auto">
              <div className="text-center px-2">
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">籠內濕度</span>
                <span>{activeBunny.humidity}% RH</span>
              </div>
              <div className="h-6 w-px bg-slate-200 hidden sm:block" />
              <div className="text-center px-2">
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">籠內溫度</span>
                <span>{activeBunny.temperature}°C</span>
              </div>
              <div className="h-6 w-px bg-slate-200 hidden sm:block" />
              <div className="text-center px-2">
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">當前行為</span>
                <span className="text-teal-600 font-extrabold">{activeBunny.currentBehavior}</span>
              </div>
            </div>
          </div>

          {/* Attention and medication checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-50 text-xs">
            <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-100/50 text-slate-600 flex gap-3">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-700 mb-0.5">注意事項:</span>
                <span className="font-medium text-slate-500">{activeBunny.notes}</span>
              </div>
            </div>

            <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-100/50 text-slate-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-3">
                <span className="text-sky-500 font-extrabold text-xs shrink-0 mt-0.5">❖</span>
                <div>
                  <span className="block font-bold text-slate-700 mb-0.5 font-sans">附加服務:</span>
                  <span className="font-medium text-slate-500">{activeBunny.extraServices}</span>
                </div>
              </div>
              <button
                onClick={onOpenClipsModal}
                className="text-[11px] bg-[#0d9488] hover:bg-[#0c857a] text-white font-extrabold px-3 py-1.5 rounded-lg shrink-0 transition-all cursor-pointer shadow-sm w-full sm:w-auto text-center"
              >
                活動片段回看
              </button>
            </div>
          </div>
        </div>

        {/* Large Streaming Block with AI facial Bounding Box */}
        <div id="video-stream-dashboard" className="bg-[#0f172a] rounded-3xl overflow-hidden relative shadow-lg aspect-video group select-none flex items-center justify-center border-4 border-white">
          {streamActive ? (
            <>
              <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-400 gap-3 font-mono relative overflow-hidden select-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-teal-500/10 animate-pulse" />
                <Video className="w-10 h-10 text-teal-500 animate-pulse" />
                <span className="text-xs tracking-widest text-slate-300 uppercase font-bold">CCTV PLAYGROUND {activeBunny.id.toUpperCase()}</span>
                <span className="text-[10px] text-slate-500 font-medium">{activeBunny.name} - 智能觀察中</span>
              </div>

              {/* Red blinking dot showing LIVE stream */}
              <div className="absolute top-5 left-5 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 uppercase tracking-widest shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>• LIVE</span>
              </div>

              {/* Feed Location & switch details */}
              <div className="absolute top-5 right-5 flex items-center gap-3 bg-black/60 backdrop-blur-md text-white rounded-xl px-3 py-1 text-xs font-bold font-sans">
                <span>放風區 (Playground)</span>
                <div className="relative inline-flex items-center cursor-pointer" onClick={() => setStreamActive(false)}>
                  <div className="w-9 h-5 bg-teal-500 rounded-full transition-colors relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 transition-all shadow-sm" />
                  </div>
                  <span className="ml-1.5 text-[9px] font-black font-mono">ON</span>
                </div>
              </div>

              {/* Animated AI Face Bounding Box - looks highly futuristic yet completely aligned with bunny screenshots */}
              <div className="absolute top-1/3 left-1/3 w-40 h-40 border-4 border-[#10b981] rounded-2xl flex items-start p-2 pointer-events-none animate-pulse shadow-2xl">
                <div className="bg-[#10b981] text-[#042f1a] font-black text-[9px] px-1.5 py-0.5 rounded font-mono shadow leading-none uppercase">
                  ID:04 {activeBunny.currentBehavior === '吃飯' ? 'eating' : 'resting'}
                </div>
              </div>

              {/* Stream bottom-right watermark logo overlay */}
              <div className="absolute bottom-5 right-5 text-[11px] font-bold text-white/50 tracking-wider">
                HKBR CAM04
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-slate-500 gap-3">
              <PlayCircle className="w-12 h-12 text-slate-600" />
              <div className="text-center">
                <span className="block text-sm font-bold text-slate-300">相機已關閉 (Stream Paused)</span>
                <button
                  onClick={() => setStreamActive(true)}
                  className="mt-3 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl"
                >
                  重啟即時影像
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Behavior Statistics & Interactive SVG graphs (4 cols out of 12) */}
      <div id="monitoring-right" className="col-span-1 lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-12">
          
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>歷史行為統計 Historical Stats</span>
            </h4>
            
            {/* Time windows menu */}
            <div className="relative">
              <select
                id="stats-time-filter"
                value={timeFilter}
                onChange={(e: any) => setTimeFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-100 rounded-lg px-3 py-1 pr-6 text-[10px] font-extrabold text-slate-500 focus:outline-none cursor-pointer"
              >
                <option value="1">近1天</option>
                <option value="3">近3天</option>
                <option value="7">近7天</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
          </div>

          {/* Behavior summary summary speech */}
          <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100/50 text-xs text-slate-600 flex gap-2">
            <span className="text-[#0d9488] scale-125 font-bold shrink-0">🍀</span>
            <span className="font-medium text-slate-600 leading-normal">{bunnyStatsObj.summary}</span>
          </div>

          {/* Core Interactive SVG Graph 1: Bar chart comparing average of last 3 days */}
          <div className="space-y-3">
            <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">過去3天的平均值 Average (Days)</span>
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50 flex items-center justify-between">
              
              <div className="space-y-0.5 shrink-0">
                <span className="block text-2xl font-black text-slate-800 tracking-tight">{bunnyStatsObj.statsByTime[2].activityCount} <span className="text-[10px] text-slate-400 font-bold">次/天</span></span>
                <span className="text-[10px] text-slate-400 font-bold">昨日平均: {bunnyStatsObj.avgOver3Days}次/天</span>
              </div>

              {/* Graphic bars represented in HTML */}
              <div className="flex items-end gap-3.5 h-12">
                {bunnyStatsObj.statsByTime.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    {/* Bar */}
                    <div className="relative w-4 bg-slate-100 rounded-t-sm h-12 flex items-end">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-700 ${
                          idx === 2 ? 'bg-[#0d9488]' : 'bg-slate-300'
                        }`}
                        style={{ height: `${(item.activityCount / 12) * 100}%` }}
                      />
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-600 leading-none">
                        {item.activityCount}
                      </span>
                    </div>
                    {/* Label */}
                    <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Graph 2: Donut Chart showing composition of core behaviors */}
          <div className="space-y-4">
            <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">今日行為事件分布 Behavior Splits</span>
            
            <div className="flex items-center justify-between gap-4">
              
              {/* Pie/Donut Chart represented via SVG circles for 100% precision and responsive look */}
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-full h-full rotate-45" viewBox="0 0 36 36">
                  {/* Empty circle underneath */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                  
                  {/* Segment: Resting (grey - value 50% split) */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#94a3b8" strokeWidth="5" strokeDasharray="50, 100" strokeDashoffset="0" />
                  
                  {/* Segment: Active (Orange - 30%) */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f97316" strokeWidth="5" strokeDasharray="30, 100" strokeDashoffset="-50" />
                  
                  {/* Segment: Eating (Teal - 13%) */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#0d9488" strokeWidth="5" strokeDasharray="13, 100" strokeDashoffset="-80" />
                  
                  {/* Segment: Drinking (Cyan - 7%) */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#06b6d4" strokeWidth="5" strokeDasharray="7, 100" strokeDashoffset="-93" />
                </svg>

                {/* Core hole to look like Donut chart */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[44px] h-[44px] rounded-full bg-white flex flex-col items-center justify-center shadow-xs">
                    <span className="text-[12px] font-black text-slate-800 leading-none">{totalActivities}</span>
                    <span className="text-[8px] text-slate-400 mt-0.5 leading-none font-bold">加總次數</span>
                  </div>
                </div>
              </div>

              {/* Categorization Legend side */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 shrink-0 select-none">
                {activeCategory.map((cat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-md shrink-0 block" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs font-bold text-slate-600">{cat.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold pl-4">{cat.value} 次活動/天</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Graph 3: Comparison line chart Comparing Yesterday (Grey) and Today (Teal) */}
          <div className="space-y-4">
            <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">行為對比昨日 Comparing Yesterday</span>
            
            <div className="h-28 relative">
              {/* Responsive custom-built interactive SVG representing trend charts exactly matching layouts */}
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                {/* Underlay Grid lines */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="30" x2="100" y2="30" stroke="#f1f5f9" strokeWidth="0.5" />

                {/* Gray Yesterday Trend */}
                <polyline
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray="1.5,1.5"
                  points="20,25 50,32 80,35"
                />

                {/* Teal Today Trend */}
                <polyline
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="1.5"
                  points="20,22 50,30 80,34"
                />

                {/* Markers */}
                <circle cx="20" cy="22" r="1.5" fill="#0d9488" />
                <text x="21" y="20" fontSize="2.5" fill="#0d9488" fontWeight="bold">6</text>
                <circle cx="50" cy="30" r="1.5" fill="#0d9488" />
                <text x="51" y="28" fontSize="2.5" fill="#0d9488" fontWeight="bold">2</text>
                <circle cx="80" cy="34" r="1.5" fill="#0d9488" />
                <text x="81" y="32" fontSize="2.5" fill="#0d9488" fontWeight="bold">1</text>

                <circle cx="20" cy="25" r="1" fill="#94a3b8" />
                <text x="20" y="28" fontSize="2.5" fill="#94a3b8" fontWeight="bold">5</text>
                <circle cx="50" cy="32" r="1" fill="#94a3b8" />
                <text x="50" y="35" fontSize="2.5" fill="#94a3b8" fontWeight="bold">1</text>
                <circle cx="80" cy="35" r="1" fill="#94a3b8" />
                <text x="80" y="38" fontSize="2.5" fill="#94a3b8" fontWeight="bold">2</text>
              </svg>

              {/* Dynamic bottom tick labels */}
              <div className="flex justify-between text-[10px] text-slate-400 font-bold px-4 mt-1 font-mono uppercase">
                <span>活動</span>
                <span>進食</span>
                <span>飲水</span>
              </div>
            </div>

            {/* Micro comparison labels */}
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 justify-end">
              <div className="flex items-center gap-1">
                <span className="w-2 h-0.5 bg-slate-300 inline-block stroke-dasharray-[1,1]" />
                <span>昨日</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-[#0d9488] inline-block" />
                <span className="text-[#0d9488]">今日</span>
              </div>
            </div>
          </div>

          {/* Indicators Box 1: Abnormal status */}
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="text-xs">
              <span className="block font-bold text-slate-700">今天捕捉到0次異常情況</span>
              <span className="font-medium text-slate-400">目前各項健康維護狀況均無警示</span>
            </div>
          </div>

          {/* Additional Service log text */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wide">✦ 今日放風時間</span>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-[#f0fdf4]/50 p-3 rounded-xl border border-teal-100/30">
              與 10 點 23 分在放風空間活動了 30 分鐘，步伐輕盈、咬木塊與啃食新鮮提摩西草狀態優良。
            </p>
          </div>

          {/* Generate Client Log report Button */}
          <button
            id="generate-daily-log-btn"
            onClick={onGenerateLog}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-xl text-xs font-bold shadow-md shadow-teal-900/10 transition-all cursor-pointer group"
          >
            <FileText className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-y-0.5" />
            <span>一鍵生成活動日誌 Report</span>
          </button>

        </div>
      </div>
    </div>
  );
}
