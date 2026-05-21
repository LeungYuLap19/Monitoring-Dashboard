/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, RefreshCw, VideoOff, Play, ShieldAlert, ArrowRight, Video } from 'lucide-react';
import { CameraFeed, BunnyGuest } from '../types';
import { CAMERA_FEEDS, BUNNY_GUESTS } from '../data';

interface OverviewTabProps {
  onSelectBunny: (bunnyId: string) => void;
  onSelectCamera: (camId: string) => void;
}

export default function OverviewTab({ onSelectBunny, onSelectCamera }: OverviewTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'online' | 'offline' | 'resting' | 'active'>('all');

  // Core metrics derived from real data
  const totalBunniesText = "06/20";
  const standardCageProgress = 60; // 6/10
  const luxuryCageProgress = 0; // 0/10

  // Filter camera feeds based on user controls
  const filteredFeeds = useMemo(() => {
    return CAMERA_FEEDS.filter(feed => {
      const matchesSearch = feed.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (feed.bunnyName && feed.bunnyName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = 
        filterType === 'all' ? true :
        filterType === 'online' ? feed.isOnline :
        filterType === 'offline' ? !feed.isOnline :
        filterType === 'resting' ? feed.currentBehavior === '休息' :
        filterType === 'active' ? feed.currentBehavior === '活動' || feed.currentBehavior === '放風中' : true;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterType]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
  };

  return (
    <div id="overview-tab" className="p-4 md:p-8 space-y-6 md:space-y-8 select-none">
      {/* 1. Header Overview Cards */}
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

      {/* 2. Monitoring Console header with stateful filtering & search */}
      <section id="monitoring-grid-container" className="space-y-6">
        <div id="monitoring-grid-header" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-50 shadow-sm">
          <div>
            <h3 id="monitor-heading" className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <Video className="w-5 h-5 text-teal-600" />
              <span>快速監控 Live Monitoring Feed</span>
            </h3>
            <p id="monitor-subheading" className="text-xs text-slate-400 font-medium mt-1">
              點擊任意籠內預覽卡片可切換至「快速監控」細項以查看即時行為 AI 捕捉與歷史日誌。
            </p>
          </div>

          {/* Filtering operations bar */}
          <div id="filter-controls-group" className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* Search Input */}
            <div id="search-input-wrapper" className="relative shrink-0 w-full md:w-48">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                id="search-cameras-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋籠子或兔名..."
                className="w-full text-xs font-medium pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:bg-white"
              />
            </div>

            {/* Dropdown status selector */}
            <div id="status-select-wrapper" className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="status-filter-select"
                value={filterType}
                onChange={(e: any) => setFilterType(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
              >
                <option value="all">所有的狀態</option>
                <option value="online">在線相機</option>
                <option value="offline">離線相機</option>
                <option value="resting">正在休息 (Resting)</option>
                <option value="active">正在放風 / 活動</option>
              </select>
            </div>

            {/* Clear button if changed */}
            {(searchQuery || filterType !== 'all') && (
              <button
                id="clear-filters-btn"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-rose-500 font-bold px-2.5 py-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>清除條件</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Feeds Grid Cards */}
        {filteredFeeds.length > 0 ? (
          <div id="camera-feeds-layout" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFeeds.map(feed => {
              const staticUnsplashRabbits = [
                'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=400&h=250',
                'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=400&h=250',
                'https://images.unsplash.com/photo-1559214369-a6b1a7cd19f6?auto=format&fit=crop&q=80&w=400&h=250',
                'https://images.unsplash.com/photo-1484557985045-eaa252be76fc?auto=format&fit=crop&q=80&w=400&h=250'
              ];
              // Seed unsplash backgrounds
              const seedIndex = feed.id === 'cam-1' ? 0 : feed.id === 'cam-2' ? 1 : feed.id === 'cam-3' ? 2 : 3;
              const imageUrl = staticUnsplashRabbits[seedIndex];

              return (
                <div
                  key={feed.id}
                  id={`camera-card-${feed.id}`}
                  onClick={() => feed.isOnline && onSelectCamera(feed.id)}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col justify-between transition-all group ${
                    feed.isOnline 
                      ? 'border-slate-100 hover:shadow-md hover:border-teal-200 cursor-pointer hover:-translate-y-0.5' 
                      : 'border-slate-100 opacity-75'
                  }`}
                >
                  {/* Card Header information */}
                  <div className="p-5 flex justify-between items-start border-b border-slate-50">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-teal-600 transition-colors">
                        {feed.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5 uppercase tracking-wider">
                        {feed.bunnyId ? `住客: ${feed.bunnyName}` : "空倉備用"}
                      </p>
                    </div>

                    {/* Camera connection indicator */}
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${feed.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                      <span className={`text-[10px] font-black uppercase ${feed.isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {feed.isOnline ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail of feed */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    {feed.isOnline ? (
                      <>
                        <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-2 font-mono select-none">
                          <Video className="w-6 h-6 text-teal-600 animate-pulse" />
                          <span className="text-[9px] tracking-widest text-slate-400 uppercase font-black">CCTV {feed.id.toUpperCase()}</span>
                          <span className="text-[9px] text-slate-500 font-bold">{feed.bunnyName ? `GUEST: ${feed.bunnyName}` : 'STANDBY'}</span>
                        </div>
                        
                        {/* Red Live banner */}
                        <div className="absolute top-3 left-3 bg-rose-600/90 text-white font-black text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-widest shadow-md">
                          <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                          <span>LIVE</span>
                        </div>

                        {/* Location Tag */}
                        {feed.bunnyId && (
                          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white font-bold text-[10px] px-2 py-1 rounded-lg">
                            當前行為: {feed.currentBehavior}
                          </div>
                        )}

                        {/* Hover Overlay play button effect */}
                        <div className="absolute inset-0 bg-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/95 text-teal-600 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2 p-4">
                        <VideoOff className="w-8 h-8 text-slate-300" />
                        <span className="text-xs font-semibold text-slate-300">相機離線 (Offline)</span>
                      </div>
                    )}
                  </div>

                  {/* Footer detail actions */}
                  <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">{feed.vibeText || '設備狀態良好'}</span>
                    {feed.isOnline && (
                      <span className="text-teal-600 font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>觀看</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div id="no-feeds-indicator" className="bg-white p-12 rounded-2xl border border-slate-100 text-center space-y-3">
            <VideoOff className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">找不到符合條件的相機 feeds</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">請試著修改上方的搜尋關鍵字或調整篩選條件後再試一次。</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              重設所有條件
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
