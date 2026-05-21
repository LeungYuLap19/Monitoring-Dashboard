/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { X, Search, SlidersHorizontal, Download, Film, ShieldAlert, Check } from 'lucide-react';
import { ActivityClip } from '../types';
import { ACTIVITY_CLIPS } from '../data';

interface ClipSelectorModalProps {
  bunnyName: string;
  onClose: () => void;
}

type FilterCategory = 'all' | 'active' | 'eat' | 'drink' | 'abnormal';

export default function ClipSelectorModal({ bunnyName, onClose }: ClipSelectorModalProps) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadedClips, setDownloadedClips] = useState<string[]>([]);

  // Filter clips based on active state options
  const filteredClips = useMemo(() => {
    return ACTIVITY_CLIPS.filter(clip => {
      // Show appropriate clips matching current rabbit context
      const matchesBunny = clip.bunnyName.toLowerCase() === bunnyName.toLowerCase();
      const matchesSearch = clip.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            clip.timestamp.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        activeCategory === 'all' ? true :
        activeCategory === 'active' ? (clip.action.includes('活動') || clip.action.includes('奔跑') || clip.action.includes('探索')) :
        activeCategory === 'eat' ? clip.action.includes('進食') :
        activeCategory === 'drink' ? clip.action.includes('喝水') :
        activeCategory === 'abnormal' ? clip.isUrgent : true;

      return matchesBunny && matchesSearch && matchesCategory;
    });
  }, [bunnyName, searchQuery, activeCategory]);

  const handleDownload = (clipId: string) => {
    if (downloadedClips.includes(clipId)) return;
    setDownloadedClips([...downloadedClips, clipId]);
  };

  return (
    <div id="clips-modal-wrapper" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none">
      
      {/* Modal Card */}
      <div id="clips-modal-sheet" className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header toolbar */}
        <div className="px-4 sm:px-8 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Film className="w-5 h-5 text-[#0d9488]" />
              <span>{bunnyName} • 活動片段監控 Playbacks</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">點擊各類型行為篩選特定活動節選片段，或選擇下載存檔。</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold flex items-center gap-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>關閉</span>
          </button>
        </div>

        {/* Dynamic Filters panel */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
          
          {/* Tabs switch */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === 'all' ? 'bg-[#0d9488] text-white shadow' : 'bg-white text-slate-500 hover:bg-slate-100/50'
              }`}
            >
              全天候片段
            </button>
            <button
              onClick={() => setActiveCategory('active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === 'active' ? 'bg-[#0d9488] text-white shadow' : 'bg-white text-slate-500 hover:bg-slate-100/50'
              }`}
            >
              活動行為 (Play)
            </button>
            <button
              onClick={() => setActiveCategory('eat')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === 'eat' ? 'bg-[#0d9488] text-white shadow' : 'bg-white text-slate-500 hover:bg-slate-100/50'
              }`}
            >
              進食片段 (Eat)
            </button>
            <button
              onClick={() => setActiveCategory('drink')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === 'drink' ? 'bg-[#0d9488] text-white shadow' : 'bg-white text-slate-500 hover:bg-slate-100/50'
              }`}
            >
              飲水監控 (Drinking)
            </button>
            <button
              onClick={() => setActiveCategory('abnormal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === 'abnormal' ? 'bg-rose-500 text-white shadow-md shadow-rose-200' : 'bg-white text-rose-500 hover:bg-rose-50'
              }`}
            >
              ⚠️ 異常警報
            </button>
          </div>

          {/* Quick search */}
          <div className="relative shrink-0 w-full lg:w-60">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋特定備註或時刻..."
              className="w-full text-xs font-medium pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        {/* Scrollable grid contents */}
        <div id="clips-scroll-frame" className="p-4 sm:p-8 overflow-y-auto max-h-[50vh] bg-slate-50/30">
          
          {filteredClips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredClips.map(clip => {
                const isDownloaded = downloadedClips.includes(clip.id);

                return (
                  <div
                    key={clip.id}
                    className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all flex flex-col justify-between ${
                      clip.isUrgent 
                        ? 'border-rose-400 shadow-md shadow-rose-50 scale-[1.01]' 
                        : 'border-slate-100 hover:shadow-md'
                    }`}
                  >
                    
                    {/* Media Aspect container */}
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-500 font-mono text-[10px] select-none">
                        <Film className="w-6 h-6 text-teal-600 mb-1 animate-pulse" />
                        <span>VIDEO INDEX: {clip.id.toUpperCase()}</span>
                        <span className="text-[8px] text-slate-600 uppercase font-bold">CLIP PLACEHOLDER</span>
                      </div>

                      {/* Cover Badge elements */}
                      <div className="absolute inset-0 bg-black/35 flex items-center justify-center cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-white/95 text-[#0d9488] flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                          <Film className="w-5 h-5 ml-0.5" />
                        </div>
                      </div>

                      {/* Abnormal label on video */}
                      {clip.isUrgent && (
                        <div className="absolute top-3 left-3 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-widest animate-pulse">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>AI ABNORMAL INCIDENT</span>
                        </div>
                      )}

                      {/* Status Tag Overlay */}
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white font-mono text-[9px] px-2 py-0.5 rounded">
                        {clip.timestamp}
                      </div>
                    </div>

                    {/* Metadata panel */}
                    <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                      <div className="space-y-1">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${
                          clip.action.includes('喝水') ? 'bg-cyan-50 text-cyan-600' :
                          clip.action.includes('進食') ? 'bg-emerald-50 text-emerald-600' :
                          clip.isUrgent ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {clip.action.includes('喝水') ? '飲水行為' :
                           clip.action.includes('進食') ? '進食行為' :
                           clip.isUrgent ? '異常警報' : '自由活動'}
                        </span>
                        
                        <p className={`text-xs font-bold leading-normal ${clip.isUrgent ? 'text-rose-600' : 'text-slate-700'}`}>
                          {clip.action}
                        </p>
                      </div>

                      {/* Bottom download details */}
                      <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-50">
                        <span className="text-slate-400 font-bold font-mono">1080P MP4 • 1.4 MB</span>
                        <button
                          onClick={() => handleDownload(clip.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] cursor-pointer ${
                            isDownloaded 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isDownloaded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>已下載</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5 animate-bounce" />
                              <span>下載片段</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 space-y-3">
              <Film className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-400">目前觀看的篩選條件沒有節選片段</p>
              <span className="text-[10px] text-slate-400 block font-medium">請切換上方分類或修改搜尋字詞。</span>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 flex justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-xl text-xs font-bold shadow cursor-pointer"
          >
            完成並返回
          </button>
        </div>

      </div>

    </div>
  );
}
