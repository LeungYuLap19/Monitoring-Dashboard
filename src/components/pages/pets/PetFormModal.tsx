import React from 'react';
import { Plus, Edit3, X } from 'lucide-react';

export interface PetFormState {
  formId: string;
  formName: string;
  formBreed: string;
  formGender: '公' | '母';
  formAge: number;
  formWeight: number;
  formVaccinated: boolean;
  formColor: string;
  formBirthday: string;
  formStatus: string;
  formNotes: string;
  formExtraServices: string;
}

interface PetFormModalProps {
  mode: 'add' | 'edit';
  formState: PetFormState;
  onFieldChange: (field: keyof PetFormState, value: string | number | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function PetFormModal({
  mode,
  formState,
  onFieldChange,
  onSubmit,
  onClose
}: PetFormModalProps) {
  const isAdd = mode === 'add';
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              {isAdd ? <Plus className="w-5 h-5 text-teal-600" /> : <Edit3 className="w-5 h-5 text-teal-600" />}
              <span>{isAdd ? '添加新兔寶 / 寵物數據檔案' : `編輯 ${formState.formName} 的健康數據檔案`}</span>
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
              <label className="text-xs font-bold text-slate-500">寵物姓名 *</label>
              <input
                type="text"
                required
                value={formState.formName}
                onChange={(e) => onFieldChange('formName', e.target.value)}
                placeholder="例如: MOCO"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">品種 Breed *</label>
              <input
                type="text"
                required
                value={formState.formBreed}
                onChange={(e) => onFieldChange('formBreed', e.target.value)}
                placeholder="例如: 法國垂耳兔"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">性別 Gender</label>
              <select
                value={formState.formGender}
                onChange={(e) => onFieldChange('formGender', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="公">雄性 (公)</option>
                <option value="母">雌性 (母)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">年齡 (歲)</label>
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
              <label className="text-xs font-bold text-slate-500">體重 (kg)</label>
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
              <label className="text-xs font-bold text-slate-500">花色 / 顏色說明</label>
              <input
                type="text"
                value={formState.formColor}
                onChange={(e) => onFieldChange('formColor', e.target.value)}
                placeholder="例如: 漸層咖啡色"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">出生日期 (Birthday)</label>
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
              <label className="text-xs font-bold text-slate-500">核心疫苗接種</label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id={`form-${mode}-vac`}
                  checked={formState.formVaccinated}
                  onChange={(e) => onFieldChange('formVaccinated', e.target.checked)}
                  className="w-4 h-4 text-teal-600 border-slate-350 rounded focus:ring-teal-500/20 cursor-pointer"
                />
                <label htmlFor={`form-${mode}-vac`} className="text-xs font-bold text-slate-600 cursor-pointer">
                  {isAdd ? '已接種兔病疫苗 (Vaccinated)' : '已接種兔病核心疫苗'}
                </label>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">當前狀態</label>
              <select
                value={formState.formStatus}
                onChange={(e) => onFieldChange('formStatus', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="健康">健康 (Healthy)</option>
                <option value="監測中">觀察監測中 (Monitoring)</option>
                <option value="休整中">休整中 (Resting)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">備註/護理說明 (Remarks)</label>
            <textarea
              value={formState.formNotes}
              onChange={(e) => onFieldChange('formNotes', e.target.value)}
              placeholder={isAdd ? '請填寫兔子入住的注意事項，如: 胃口、敏感行為、保暖指示' : undefined}
              rows={2}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">附加照護客房要求 (Services)</label>
            <input
              type="text"
              value={formState.formExtraServices}
              onChange={(e) => onFieldChange('formExtraServices', e.target.value)}
              placeholder={isAdd ? '例如: 每日下午需要人工梳毛一次' : undefined}
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
              {isAdd ? '確認添加' : '確認修改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
