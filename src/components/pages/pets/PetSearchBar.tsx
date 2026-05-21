import React from 'react';
import { Search, LayoutGrid, List, Plus } from 'lucide-react';
import { PetSearchBarProps } from '../../../types';
import { useTranslation } from '../../../lib/i18n';

export default function PetSearchBar({
  searchTerm,
  onSearchChange,
  viewMode,
  onSetViewMode,
  onOpenAddModal
}: PetSearchBarProps) {
  const { t } = useTranslation();
  return (
    <div id="pets-list-view-header" className="space-y-6">
      {/* Main Title Banner & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span>{t('pets.heading')}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-100 font-mono uppercase">
              {t('pets.badge')}
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {t('pets.description')}
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="bg-[#0d9488] hover:bg-[#0c857a] text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-teal-900/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('pets.addPet')}</span>
        </button>
      </div>

      {/* Search Box and grid-list toggle */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('pets.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:bg-white transition-all font-semibold"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => onSetViewMode('grid')}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-teal-50 text-teal-700 border-teal-100'
                : 'bg-white text-slate-400 border-slate-100 hover:text-slate-600'
            }`}
            title={t('pets.gridView')}
          >
            <LayoutGrid className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => onSetViewMode('list')}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-teal-50 text-teal-700 border-teal-100'
                : 'bg-white text-slate-400 border-slate-100 hover:text-slate-600'
            }`}
            title={t('pets.listView')}
          >
            <List className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
