/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function MetricsGrid() {
  return (
    <section id="metrics-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

      {/* Total Bunny Occupancy */}
      <div id="metric-occupancy" className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col justify-between shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold text-slate-400 tracking-wider">總入住動物隻數</span>
          <span className="text-[10px] bg-slate-50 text-slate-500 font-semibold px-2 py-0.5 rounded-md font-mono">Capacity</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Custom Circular SVG Gauge */}
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-teal-500" strokeDasharray="30, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-[13px] font-black text-slate-800 leading-none">06</span>
              <span className="text-[9px] text-slate-400 border-t border-slate-100 mt-0.5 leading-none">20</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-slate-500 font-medium">特大兔籠: 6/10</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-slate-400 font-medium font-mono">豪華套房: 0/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expected Check-ins */}
      <div id="metric-checkins" className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col justify-between shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold text-slate-400 tracking-wider">今日預期入住</span>
          <span className="text-[10px] bg-sky-50 text-sky-600 font-bold px-2 py-0.5 rounded-md font-mono">Arriving</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-slate-800 font-display">1</span>
          <span className="text-sm font-semibold text-slate-500">隻兔兔</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center">
            <span className="text-xs text-sky-500 font-bold">✓</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">1間空置房已備妥消毒</span>
        </div>
      </div>

      {/* Expected Check-outs */}
      <div id="metric-checkouts" className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col justify-between shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold text-slate-400 tracking-wider">今日預期退房</span>
          <span className="text-[10px] bg-purple-50 text-purple-600 font-bold px-2 py-0.5 rounded-md font-mono">Departing</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-slate-800 font-display">2</span>
          <span className="text-sm font-semibold text-slate-500">隻兔兔</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center">
            <span className="text-xs text-purple-500 font-bold">➜</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">預計下午4時前辦理完成</span>
        </div>
      </div>

      {/* Abnormal Events Indicator */}
      <div id="metric-abnormal" className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col justify-between shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold text-slate-400 tracking-wider">今日異常事件</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-md font-mono">Alerts</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-600 font-display">無異常</span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-[#0d9488] font-bold">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0d9488] animate-ping shrink-0" />
          <span>智能診斷無潛在呼吸異常</span>
        </div>
      </div>

      {/* Active Cameras Online */}
      <div id="metric-cameras" className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col justify-between shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold text-slate-400 tracking-wider">在線攝像頭</span>
          <span className="text-[10px] bg-slate-50 text-slate-500 font-bold px-2 py-0.5 rounded-md font-mono">Cameras</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-slate-800 font-display">8</span>
          <span className="text-sm font-semibold text-slate-400">/ 10 台</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>2台相機維護中</span>
          <span className="text-teal-600 font-extrabold font-mono text-[10px]">98% SLA</span>
        </div>
      </div>

    </section>
  );
}
