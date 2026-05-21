import React from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import { PetSearchBarProps } from '../../../types';
import { useTranslation } from '../../../lib/i18n';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';

export default function PetSearchBar({
  searchTerm,
  onSearchChange,
  viewMode,
  onSetViewMode,
}: PetSearchBarProps) {
  const { t } = useTranslation();
  return (
    <div id="pets-list-view-header" className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span>{t('pets.heading')}</span>
            <Badge variant="outline" className="text-xs font-bold px-2 py-0.5 bg-teal-50 text-teal-600 font-mono uppercase">
              {t('pets.badge')}
            </Badge>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {t('pets.description')}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('pets.searchPlaceholder')}
            className="pl-10 pr-4 py-2.5"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSetViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-teal-50 text-teal-700' : 'bg-white text-slate-400 hover:text-slate-600'}
            title={t('pets.gridView')}
          >
            <LayoutGrid className="size-4.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSetViewMode('list')}
            className={viewMode === 'list' ? 'bg-teal-50 text-teal-700' : 'bg-white text-slate-400 hover:text-slate-600'}
            title={t('pets.listView')}
          >
            <List className="size-4.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
