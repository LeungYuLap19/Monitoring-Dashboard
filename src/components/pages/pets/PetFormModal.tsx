import React from 'react';
import { Plus, Edit3 } from 'lucide-react';
import { PetFormState, PetFormModalProps } from '../../../types';
import { useTranslation } from '../../../lib/i18n';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog';

export default function PetFormModal({
  mode,
  formState,
  onFieldChange,
  onSubmit,
  onClose
}: PetFormModalProps) {
  const { t } = useTranslation();
  const isAdd = mode === 'add';
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg p-0">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            {isAdd ? <Plus className="size-5 text-teal-600" /> : <Edit3 className="size-5 text-teal-600" />}
            <span>{isAdd ? t('pets.form.addTitle') : t('pets.form.editTitle', { name: formState.formName })}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 mt-0.5">
            {isAdd ? t('pets.form.addDescription') : t('pets.form.editDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500">{t('pets.form.nameLabel')}</Label>
              <Input
                type="text"
                required
                value={formState.formName}
                onChange={(e) => onFieldChange('formName', e.target.value)}
                placeholder={t('pets.form.namePlaceholder')}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500">{t('pets.form.breedLabel')}</Label>
              <Input
                type="text"
                required
                value={formState.formBreed}
                onChange={(e) => onFieldChange('formBreed', e.target.value)}
                placeholder={t('pets.form.breedPlaceholder')}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500">{t('pets.form.genderLabel')}</Label>
              <select
                value={formState.formGender}
                onChange={(e) => onFieldChange('formGender', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="公">{t('pets.form.genderMale')}</option>
                <option value="母">{t('pets.form.genderFemale')}</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500">{t('pets.form.ageLabel')}</Label>
              <Input type="number" min={0} max={25} value={formState.formAge} onChange={(e) => onFieldChange('formAge', Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500">{t('pets.form.weightLabel')}</Label>
              <Input type="number" step="0.1" min={0.1} value={formState.formWeight} onChange={(e) => onFieldChange('formWeight', Number(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500">{t('pets.form.colorLabel')}</Label>
              <Input type="text" value={formState.formColor} onChange={(e) => onFieldChange('formColor', e.target.value)} placeholder={t('pets.form.colorPlaceholder')} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500">{t('pets.form.birthdayLabel')}</Label>
              <Input type="date" value={formState.formBirthday} onChange={(e) => onFieldChange('formBirthday', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500">{t('pets.form.vaccinatedLabel')}</Label>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id={`form-${mode}-vac`}
                  checked={formState.formVaccinated}
                  onCheckedChange={(checked) => onFieldChange('formVaccinated', !!checked)}
                />
                <Label htmlFor={`form-${mode}-vac`} className="text-xs font-bold text-slate-600 cursor-pointer">
                  {t('pets.form.vaccinatedYes')}
                </Label>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500">{t('pets.form.statusLabel')}</Label>
              <select
                value={formState.formStatus}
                onChange={(e) => onFieldChange('formStatus', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="健康">{t('pets.form.statusHealthy')}</option>
                <option value="監測中">{t('pets.form.statusMonitoring')}</option>
                <option value="休整中">{t('pets.form.statusResting')}</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500">{t('pets.form.notesLabel')}</Label>
            <Textarea
              value={formState.formNotes}
              onChange={(e) => onFieldChange('formNotes', e.target.value)}
              placeholder={isAdd ? t('pets.form.notesPlaceholder') : undefined}
              rows={2}
              className="bg-slate-50 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500">{t('pets.form.servicesLabel')}</Label>
            <Input
              type="text"
              value={formState.formExtraServices}
              onChange={(e) => onFieldChange('formExtraServices', e.target.value)}
              placeholder={isAdd ? t('pets.form.servicesPlaceholder') : undefined}
            />
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {isAdd ? t('pets.form.submitAdd') : t('pets.form.submitEdit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
