/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, SlidersHorizontal, RefreshCw, Video } from 'lucide-react';
import { MonitoringHeaderProps } from '../../../types';
import { useTranslation } from '../../../lib/i18n';

export default function MonitoringHeader({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  onClearFilters,
}: MonitoringHeaderProps) {
  const { t } = useTranslation();
  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('overview.searchPlaceholder')}
            className="w-full text-xs font-medium pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:bg-white"
          />
        </div>

        {/* Dropdown status selector */}
        <div id="status-select-wrapper" className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            id="status-filter-select"
            value={filterType}
            onChange={(e: any) => onFilterChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
          >
            <option value="all">{t('overview.filters.all')}</option>
            <option value="online">{t('overview.filters.online')}</option>
            <option value="offline">{t('overview.filters.offline')}</option>
            <option value="resting">{t('overview.filters.resting')}</option>
            <option value="active">{t('overview.filters.active')}</option>
          </select>
        </div>

        {/* Clear button if changed */}
        {(searchQuery || filterType !== 'all') && (
          <button
            id="clear-filters-btn"
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs text-rose-500 font-bold px-2.5 py-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{t('overview.clearFilter')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
