/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { BunnyProfileCardProps } from '../../../types';
import { useTranslation } from '../../../lib/i18n';

export default function BunnyProfileCard({
  activeFeed,
  snapshot,
  onOpenClipsModal,
}: BunnyProfileCardProps) {
  const { t } = useTranslation();
  const displayName = activeFeed.bunnyName || activeFeed.name;
  const detailStatus = snapshot?.stats.status || (activeFeed.isOnline ? 'online' : 'offline');
  const telemetryA = typeof snapshot?.stats.fps === 'number' ? `${snapshot.stats.fps.toFixed(1)} fps` : 'N/A';
  const telemetryB = typeof snapshot?.stats.yoloMs === 'number' ? `${Math.round(snapshot.stats.yoloMs)} ms` : 'N/A';
  const notes = activeFeed.isOnline
    ? 'Live PetMonitor stream is connected and telemetry is updating.'
    : 'Camera is offline, inactive, or not returning telemetry.';
  const extraDetails = activeFeed.vibeText || 'No backend metadata available for this camera.';

  return (
    <div id="bunny-metadata-card" className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div
            className="size-14 rounded-xl border-2 bg-teal-50 flex items-center justify-center text-teal-700 font-extrabold text-sm select-none shrink-0"
            title={displayName}
          >
            {displayName.substring(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-800">{displayName}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeFeed.isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {activeFeed.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-bold space-x-3">
              <span>{t('overview.bunnyProfile.breedLabel')} {activeFeed.name}</span>
              <span>•</span>
              <span>{t('overview.bunnyProfile.checkInLabel')} {detailStatus}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-4 bg-slate-50 p-3 rounded-xl font-mono text-[11px] sm:text-xs text-slate-600 font-bold shrink-0 w-full md:w-auto">
          <div className="text-center px-2">
            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{t('overview.bunnyProfile.humidityLabel')}</span>
            <span>{telemetryA}</span>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div className="text-center px-2">
            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{t('overview.bunnyProfile.tempLabel')}</span>
            <span>{telemetryB}</span>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div className="text-center px-2">
            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{t('overview.bunnyProfile.behaviorLabel')}</span>
            <span className="text-teal-600 font-extrabold">{activeFeed.currentBehavior}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
        <div className="bg-amber-50/50 p-3.5 rounded-xl text-slate-600 flex gap-3">
          <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="block font-bold text-slate-700 mb-0.5">{t('overview.bunnyProfile.notesLabel')}</span>
            <span className="font-medium text-slate-500">{notes}</span>
          </div>
        </div>

        <div className="bg-sky-50/50 p-3.5 rounded-xl text-slate-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-3">
            <span className="text-sky-500 font-extrabold text-xs shrink-0 mt-0.5">&#10054;</span>
            <div>
              <span className="block font-bold text-slate-700 mb-0.5 font-sans">{t('overview.bunnyProfile.servicesLabel')}</span>
              <span className="font-medium text-slate-500">{extraDetails}</span>
            </div>
          </div>
          <button
            onClick={onOpenClipsModal}
            className="text-[11px] bg-teal-600 hover:bg-[#0c857a] text-white font-extrabold px-3 py-1.5 rounded-lg shrink-0 transition-all cursor-pointer shadow-sm w-full sm:w-auto text-center"
          >
            {t('overview.bunnyProfile.clipsBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}
