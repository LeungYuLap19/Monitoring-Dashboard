/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronDown, Sparkles, CheckCircle2, FileText } from 'lucide-react';

interface ActivityCount {
  label: string;
  value: number;
  color: string;
}

interface StatByTime {
  date: string;
  activityCount: number;
  restingCount: number;
  eatingCount: number;
  drinkingCount: number;
  averageOver3Days: number;
}

interface BehaviorStatsProps {
  timeFilter: '1' | '3' | '7';
  setTimeFilter: (value: '1' | '3' | '7') => void;
  summary: string;
  avgOver3Days: number;
  statsByTime: StatByTime[];
  activeCategory: ActivityCount[];
  totalActivities: number;
  onGenerateLog: () => void;
}

export default function BehaviorStats({
  timeFilter,
  setTimeFilter,
  summary,
  avgOver3Days,
  statsByTime,
  activeCategory,
  totalActivities,
  onGenerateLog
}: BehaviorStatsProps) {
  return (
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

        {/* Behavior summary */}
        <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100/50 text-xs text-slate-600 flex gap-2">
          <span className="text-[#0d9488] scale-125 font-bold shrink-0">&#127808;</span>
          <span className="font-medium text-slate-600 leading-normal">{summary}</span>
        </div>

        {/* Core Interactive SVG Graph 1: Bar chart */}
        <div className="space-y-3">
          <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">過去3天的平均值 Average (Days)</span>
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50 flex items-center justify-between">

            <div className="space-y-0.5 shrink-0">
              <span className="block text-2xl font-black text-slate-800 tracking-tight">{statsByTime[2].activityCount} <span className="text-[10px] text-slate-400 font-bold">次/天</span></span>
              <span className="text-[10px] text-slate-400 font-bold">昨日平均: {avgOver3Days}次/天</span>
            </div>

            {/* Graphic bars represented in HTML */}
            <div className="flex items-end gap-3.5 h-12">
              {statsByTime.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
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
                  <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graph 2: Donut Chart */}
        <div className="space-y-4">
          <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">今日行為事件分布 Behavior Splits</span>

          <div className="flex items-center justify-between gap-4">

            {/* Pie/Donut Chart via SVG */}
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full rotate-45" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#94a3b8" strokeWidth="5" strokeDasharray="50, 100" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f97316" strokeWidth="5" strokeDasharray="30, 100" strokeDashoffset="-50" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#0d9488" strokeWidth="5" strokeDasharray="13, 100" strokeDashoffset="-80" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#06b6d4" strokeWidth="5" strokeDasharray="7, 100" strokeDashoffset="-93" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[44px] h-[44px] rounded-full bg-white flex flex-col items-center justify-center shadow-xs">
                  <span className="text-[12px] font-black text-slate-800 leading-none">{totalActivities}</span>
                  <span className="text-[8px] text-slate-400 mt-0.5 leading-none font-bold">加總次數</span>
                </div>
              </div>
            </div>

            {/* Categorization Legend */}
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

        {/* Graph 3: Comparison line chart */}
        <div className="space-y-4">
          <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">行為對比昨日 Comparing Yesterday</span>

          <div className="h-28 relative">
            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
              <line x1="0" y1="10" x2="100" y2="10" stroke="#f1f5f9" strokeWidth="0.5" />
              <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="0.5" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="#f1f5f9" strokeWidth="0.5" />

              <polyline fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="1.5,1.5" points="20,25 50,32 80,35" />
              <polyline fill="none" stroke="#0d9488" strokeWidth="1.5" points="20,22 50,30 80,34" />

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
          <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wide">&#10022; 今日放風時間</span>
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
  );
}
