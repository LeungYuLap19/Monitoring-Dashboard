/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { BunnyGuest } from '../../../types';

interface BunnyProfileCardProps {
  activeBunny: BunnyGuest;
  onOpenClipsModal: () => void;
}

export default function BunnyProfileCard({
  activeBunny,
  onOpenClipsModal
}: BunnyProfileCardProps) {
  return (
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
            <span className="text-sky-500 font-extrabold text-xs shrink-0 mt-0.5">&#10054;</span>
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
  );
}
