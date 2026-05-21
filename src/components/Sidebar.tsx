/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, Users, HeartPulse, Video, LogOut, FileText, ClipboardCheck, Heart } from 'lucide-react';
import { TabId } from '../types';
import HKBRIcon from './HKBRIcon';
import PHealthIcon from './PHealthIcon';

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
        <div id="sidebar-upper" className="flex flex-col p-6 space-y-8">
          {/* HKBR Logo Emblem */}
          <div>
            <HKBRIcon />
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

      <div id="sidebar-footer" className="p-6 flex flex-col items-center justify-center w-full">
        <PHealthIcon size={'small'} />

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
