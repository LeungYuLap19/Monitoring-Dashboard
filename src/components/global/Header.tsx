/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, User, Sparkles, Moon, Sun, Menu, Globe } from 'lucide-react';
import { HeaderProps } from '../../types';
import { useTranslation } from '../../lib/i18n';
import { Locale } from '../../lib/i18n';

export default function Header({ userEmail, adminName = 'admin user', onMenuClick }: HeaderProps) {
  const { t, locale, setLocale } = useTranslation();
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'MOMO剛剛完成了15分鐘放風！', read: false, time: '剛才' },
    { id: 2, text: '注意：MOMO感冒餵藥時間到了（18:00）', read: false, time: '1小時前' },
    { id: 3, text: '系統檢測：特大籠房間3號攝像頭已重新上線', read: true, time: '3小時前' }
  ]);
  const [openNotifications, setOpenNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header id="app-header" className="bg-white border-b border-slate-100 py-4 px-4 sm:px-8 flex justify-between items-center sticky top-0 z-40 select-none">
      {/* Dynamic welcome and status indicators */}
      <div id="header-brand-info" className="flex items-center gap-3">
        <button
          id="mobile-sidebar-toggle"
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 id="header-org-title" className="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            {t('header.orgName')}
          </h2>
          <p id="header-subtitle" className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 hidden md:block">
            {t('header.subtitle')}
          </p>
        </div>
      </div>

      {/* Action / User controls */}
      <div id="header-actions" className="flex items-center gap-4">

        {/* Stateful Dynamic Notifications Popover */}
        <div id="notification-bell-group" className="relative">
          <button
            id="notification-bell-btn"
            onClick={() => setOpenNotifications(!openNotifications)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all relative border border-slate-100"
          >
            <Bell id="bell-svg" className="w-5 h-5" />
            {unreadCount > 0 && (
              <span id="unread-count-badge" className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {openNotifications && (
            <div id="notifications-dropdown" className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-50">
              <div id="notif-dropdown-header" className="p-4 border-b border-slate-50 flex justify-between items-center">
                <span className="font-bold text-sm text-slate-700">{t('header.notifications')}</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-[#0d9488] font-semibold hover:underline"
                  >
                    {t('header.markAllRead')}
                  </button>
                )}
              </div>
              <div id="notif-dropdown-list" className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-4 text-xs transition-colors hover:bg-slate-50 flex flex-col gap-1 ${
                      !n.read ? 'bg-teal-50/20' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`font-semibold ${!n.read ? 'text-[#0d9488]' : 'text-slate-600'}`}>
                        {n.text}
                      </span>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1" />}
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <select
          id="lang-switcher"
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 hover:bg-slate-100 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          <option value="zh-TW">繁中</option>
          <option value="en">EN</option>
        </select>

        {/* User admin Profile badge */}
        <div id="admin-user-badge" className="flex items-center gap-2 px-4 py-2 bg-[#0d9488]/10 hover:bg-[#0d9488]/15 border border-[#0d9488]/10 text-[#0d9488] rounded-xl transition-all cursor-pointer">
          <div id="user-avatar-circle" className="w-5 h-5 rounded-full bg-[#0d9488]/20 flex items-center justify-center">
            <User id="user-svg" className="w-3.5 h-3.5" />
          </div>
          <span id="user-name-text" className="text-xs font-bold leading-none">{adminName}</span>
        </div>
      </div>
    </header>
  );
}
