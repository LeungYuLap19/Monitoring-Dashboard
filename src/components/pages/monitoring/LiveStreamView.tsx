/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Video, PlayCircle } from 'lucide-react';
import { LiveStreamViewProps } from '../../../types';
import { useTranslation } from '../../../lib/i18n';

export default function LiveStreamView({
  activeBunny,
  streamActive,
  setStreamActive,
  streamUrl,
  camId,
  statusText,
}: LiveStreamViewProps) {
  const { t } = useTranslation();
  return (
    <div id="video-stream-dashboard" className="bg-slate-900 rounded-3xl overflow-hidden relative shadow-lg aspect-video group select-none flex items-center justify-center">
      {streamActive ? (
        <>
          {streamUrl ? (
            <img
              src={streamUrl}
              alt={`${activeBunny.name} live stream`}
              className="size-full object-cover bg-slate-950"
            />
          ) : (
            <div className="size-full bg-slate-900 flex flex-col items-center justify-center text-slate-400 gap-3 font-mono relative overflow-hidden select-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-teal-500/10 animate-pulse" />
              <Video className="size-10 text-teal-500 animate-pulse" />
              <span className="text-xs tracking-widest text-slate-300 uppercase font-bold">CCTV PLAYGROUND {activeBunny.id.toUpperCase()}</span>
              <span className="text-[10px] text-slate-500 font-medium">{activeBunny.name} - {t('overview.liveStream.observing')}</span>
            </div>
          )}

          {/* Red blinking dot showing LIVE stream */}
          <div className="absolute top-5 left-5 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 uppercase tracking-widest shadow-md">
            <span className="size-1.5 rounded-full bg-white animate-ping" />
            <span>• LIVE</span>
          </div>

          {/* Feed Location & switch details */}
          <div className="absolute top-5 right-5 flex items-center gap-3 bg-black/60 backdrop-blur-md text-white rounded-xl px-3 py-1 text-xs font-bold font-sans">
            <span>{t('overview.liveStream.playground')}</span>
            <div className="relative inline-flex items-center cursor-pointer" onClick={() => setStreamActive(false)}>
              <div className="w-9 h-5 bg-teal-500 rounded-full transition-colors relative">
                <div className="size-4 bg-white rounded-full absolute top-0.5 right-0.5 transition-all shadow-sm" />
              </div>
              <span className="ml-1.5 text-[9px] font-black font-mono">ON</span>
            </div>
          </div>

          {/* Animated AI Face Bounding Box */}
          <div className="absolute top-1/3 left-1/3 size-40 border-4 rounded-2xl flex items-start p-2 pointer-events-none animate-pulse shadow-2xl">
            <div className="bg-emerald-500 text-[#042f1a] font-black text-[9px] px-1.5 py-0.5 rounded font-mono shadow leading-none uppercase">
              ID:{camId ?? 'LIVE'} {activeBunny.currentBehavior === '吃飯' ? 'eating' : activeBunny.currentBehavior}
            </div>
          </div>

          {/* Stream bottom-right watermark logo overlay */}
          <div className="absolute bottom-5 right-5 text-[11px] font-bold text-white/50 tracking-wider">
            {statusText || `HKBR CAM${camId ?? 'LIVE'}`}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-slate-500 gap-3">
          <PlayCircle className="size-12 text-slate-600" />
          <div className="text-center">
            <span className="block text-sm font-bold text-slate-300">{t('overview.liveStream.cameraPaused')}</span>
            <button
              onClick={() => setStreamActive(true)}
              className="mt-3 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl"
            >
              {t('overview.liveStream.restartStream')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
