import React from 'react';
import { Plus, Edit3, X } from 'lucide-react';
import { PetFormState, PetFormModalProps } from '../../../types';
import { useTranslation } from '../../../lib/i18n';

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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              {isAdd ? <Plus className="w-5 h-5 text-teal-600" /> : <Edit3 className="w-5 h-5 text-teal-600" />}
              <span>{isAdd ? t('pets.form.addTitle') : t('pets.form.editTitle', { name: formState.formName })}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAdd ? '新增寵物健康指引、歲數以利持續追蹤觀察' : '修改年齡、進食、檢疫或其他生活習慣描述'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-md transition-colors font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Scroll */}
        <form onSubmit={onSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">{t('pets.form.nameLabel')}</label>
              <input
                type="text"
                required
                value={formState.formName}
                onChange={(e) => onFieldChange('formName', e.target.value)}
                placeholder={t('pets.form.namePlaceholder')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">{t('pets.form.breedLabel')}</label>
              <input
                type="text"
                required
                value={formState.formBreed}
                onChange={(e) => onFieldChange('formBreed', e.target.value)}
                placeholder={t('pets.form.breedPlaceholder')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">{t('pets.form.genderLabel')}</label>
              <select
                value={formState.formGender}
                onChange={(e) => onFieldChange('formGender', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="公">{t('pets.form.genderMale')}</option>
                <option value="母">{t('pets.form.genderFemale')}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">{t('pets.form.ageLabel')}</label>
              <input
                type="number"
                min={0}
                max={25}
                value={formState.formAge}
                onChange={(e) => onFieldChange('formAge', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">{t('pets.form.weightLabel')}</label>
              <input
                type="number"
                step="0.1"
                min={0.1}
                value={formState.formWeight}
                onChange={(e) => onFieldChange('formWeight', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">{t('pets.form.colorLabel')}</label>
              <input
                type="text"
                value={formState.formColor}
                onChange={(e) => onFieldChange('formColor', e.target.value)}
                placeholder={t('pets.form.colorPlaceholder')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">{t('pets.form.birthdayLabel')}</label>
              <input
                type="date"
                value={formState.formBirthday}
                onChange={(e) => onFieldChange('formBirthday', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">{t('pets.form.vaccinatedLabel')}</label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id={`form-${mode}-vac`}
                  checked={formState.formVaccinated}
                  onChange={(e) => onFieldChange('formVaccinated', e.target.checked)}
                  className="w-4 h-4 text-teal-600 border-slate-350 rounded focus:ring-teal-500/20 cursor-pointer"
                />
                <label htmlFor={`form-${mode}-vac`} className="text-xs font-bold text-slate-600 cursor-pointer">
                  {t('pets.form.vaccinatedYes')}
                </label>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">{t('pets.form.statusLabel')}</label>
              <select
                value={formState.formStatus}
                onChange={(e) => onFieldChange('formStatus', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="健康">{t('pets.form.statusHealthy')}</option>
                <option value="監測中">{t('pets.form.statusMonitoring')}</option>
                <option value="休整中">{t('pets.form.statusResting')}</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">{t('pets.form.notesLabel')}</label>
            <textarea
              value={formState.formNotes}
              onChange={(e) => onFieldChange('formNotes', e.target.value)}
              placeholder={isAdd ? t('pets.form.notesPlaceholder') : undefined}
              rows={2}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">{t('pets.form.servicesLabel')}</label>
            <input
              type="text"
              value={formState.formExtraServices}
              onChange={(e) => onFieldChange('formExtraServices', e.target.value)}
              placeholder={isAdd ? t('pets.form.servicesPlaceholder') : undefined}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-lg text-xs font-bold shadow cursor-pointer"
            >
              {isAdd ? t('pets.form.submitAdd') : t('pets.form.submitEdit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
