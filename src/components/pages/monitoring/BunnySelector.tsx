/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { BunnyGuest, BunnySelectorProps } from '../../../types';
import { useTranslation } from '../../../lib/i18n';

export default function BunnySelector({
  selectedBunnyId,
  setSelectedBunnyId,
  bunnyGuests
}: BunnySelectorProps) {
  const { t } = useTranslation();
  return (
    <div id="monitoring-breadcrumb" className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:px-6 sm:py-4 rounded-2xl border border-slate-50 shadow-sm gap-4">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-bold">{t('monitoring.breadcrumb')}</span>
        <span className="text-slate-300">/</span>
        <span className="text-teal-600 font-extrabold uppercase">籠內詳情 Details</span>
      </div>

      {/* Quick switcher dropdown */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
        <span className="text-xs font-bold text-slate-400">目前觀看兔兔:</span>
        <div className="relative">
          <select
            id="active-bunny-selector"
            value={selectedBunnyId}
            onChange={(e) => setSelectedBunnyId(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-100 rounded-xl px-4 py-1.5 pr-8 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/10 cursor-pointer"
          >
            {bunnyGuests.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
