import React from 'react';
import { Sparkles, User } from 'lucide-react';
import { LoginRegisterStepProps } from '../../../types';
import { useTranslation } from '../../../lib/i18n';

export default function LoginRegisterStep({
  inputValue,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onSubmit,
  onBack,
}: LoginRegisterStepProps) {
  const { t } = useTranslation();
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100/70 space-y-3">
        <div className="flex items-center gap-1.5 text-teal-800">
          <Sparkles className="w-4 h-4 shrink-0 text-teal-600 animate-pulse" />
          <span className="text-xs font-black">{t('auth.registerTitle')}</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-normal font-medium">
          {t('auth.registerWelcome')} (<span className="font-mono text-teal-900 font-bold">{inputValue}</span>)
        </p>
      </div>

      {/* Named profile inputs */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 pb-1">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">{t('auth.lastNameLabel')}</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              placeholder={t('auth.lastNamePlaceholder')}
              className="w-full px-3.5 py-3 bg-slate-50 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/15 focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">{t('auth.firstNameLabel')}</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder={t('auth.firstNamePlaceholder')}
              className="w-full px-3.5 py-3 bg-slate-50 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/15 focus:bg-white transition-all shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Action Register and Enter */}
      <div className="space-y-2">
        <button
          type="submit"
          className="w-full bg-[#0d9488] hover:bg-[#0c857a] text-white font-black py-3.5 rounded-xl shadow-lg shadow-teal-950/10 flex items-center justify-center gap-2 transition-all cursor-pointer text-xs sm:text-sm tracking-wide uppercase"
        >
          <User className="w-4.5 h-4.5" />
          <span>{t('auth.registerSubmit')}</span>
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-150 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          {t('auth.registerCancel')}
        </button>
      </div>
    </form>
  );
}
