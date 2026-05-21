/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, Users, HeartPulse, Video, LogOut, FileText, ClipboardCheck, Heart } from 'lucide-react';
import { TabId } from '../types';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onLogout?: () => void;
  hasUnsentLogs: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, hasUnsentLogs, isOpen, onClose }: SidebarProps) {
  const handleTabClick = (tab: TabId) => {
    setActiveTab(tab);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Drawer Overlay for Mobile */}
      {isOpen && (
        <div
          id="sidebar-overlay"
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-45 lg:hidden transition-all duration-300"
        />
      )}

      <aside
        id="sidebar-container"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col justify-between h-screen transition-transform duration-300 select-none lg:sticky lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Upper Brand Info */}
        <div id="sidebar-upper" className="flex flex-col p-6">
          {/* HKBR Logo Emblem */}
          <div id="sidebar-logo-group" className="flex items-center gap-3 mb-8">
            <div id="hkbr-svg-badge" className="flex-shrink-0 w-12 h-12 bg-[#097939] rounded-xl flex items-center justify-center border-2 border-yellow-400 shadow-sm relative overflow-hidden">
              {/* Minimalist bunny ears silhouette inside green badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="text-[11px] font-extrabold text-yellow-400 tracking-tighter leading-none">HKBR</span>
                <span className="text-[7px] font-bold text-white tracking-widest leading-none mt-0.5">BUNNY</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 id="brand-title" className="font-extrabold text-slate-800 text-sm tracking-tight leading-4">救兔之家</h1>
              <p id="brand-subtitle" className="text-xs text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">HKBR Bunny Hotel</p>
            </div>
          </div>

          {/* Menu Guide Title */}
          <span id="menu-section-label" className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4 px-2">功能欄 MENU</span>

          {/* Navigation Items */}
          <nav id="sidebar-nav" className="flex flex-col gap-1.5">
            <button
              id="nav-overview-btn"
              onClick={() => handleTabClick('overview')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#0d9488] text-white shadow-md shadow-teal-900/10'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard id="icon-overview" className="w-4.5 h-4.5 shrink-0" />
              <span>數據看板 Overview</span>
            </button>

            <button
              id="nav-monitoring-btn"
              onClick={() => handleTabClick('monitoring')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'monitoring'
                  ? 'bg-[#0d9488] text-white shadow-md shadow-teal-900/10'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <div id="nav-monitoring-label" className="flex items-center gap-3">
                <Video id="icon-video" className="w-4.5 h-4.5 shrink-0" />
                <span>快速監控 Monitoring</span>
              </div>
              <span id="monitoring-pulse-badge" className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            <button
              id="nav-pets-btn"
              onClick={() => handleTabClick('pets')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'pets'
                  ? 'bg-[#0d9488] text-white shadow-md shadow-teal-900/10'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Heart id="icon-pets" className="w-4.5 h-4.5 shrink-0" />
              <span>寵物數據 Pets</span>
            </button>

            <button
              id="nav-client-btn"
              onClick={() => handleTabClick('client-view')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'client-view'
                  ? 'bg-[#0d9488] text-white shadow-md shadow-teal-900/10'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <div id="nav-client-label" className="flex items-center gap-3">
                <ClipboardCheck id="icon-clipboard" className="w-4.5 h-4.5 shrink-0" />
                <span>活動日誌 Client Log</span>
              </div>
              {hasUnsentLogs && (
                <span id="unsent-logs-dot" className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" title="今日日誌已生成" />
              )}
            </button>
          </nav>
        </div>

      {/* Footer Branding OS & Log out */}
      <div id="sidebar-footer" className="p-6 border-t border-slate-50 flex flex-col gap-6">
        <div id="phealth-badge-group" className="flex flex-col gap-0.5 px-2">
          <span id="phealth-text" className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">POWERED BY</span>
          <span id="phealth-brand" className="text-xs font-black text-rose-500 tracking-tighter flex items-center gap-1">
            <span id="phealth-phi" className="text-rose-600 font-extrabold">𝜑</span>Health OS
          </span>
        </div>

        <button
          id="logout-btn"
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors w-full text-left"
        >
          <LogOut id="icon-logout" className="w-4.5 h-4.5 shrink-0" />
          <span>登出 Log out</span>
        </button>
      </div>
    </aside>
  </>
  );
}
