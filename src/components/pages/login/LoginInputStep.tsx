import React from 'react';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import { LoginInputStepProps } from '../../../types';
import { useTranslation } from '../../../lib/i18n';

export default function LoginInputStep({
  loginMethod,
  inputValue,
  onInputChange,
  onMethodChange,
  onSubmit,
}: LoginInputStepProps) {
  const { t } = useTranslation();
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* TABS Selection */}
      <div className="bg-slate-50 p-1 rounded-xl border border-slate-100/60 flex">
        <button
          type="button"
          onClick={() => { onMethodChange('email'); onInputChange(''); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
            loginMethod === 'email'
              ? 'bg-white text-[#0d9488] shadow-xs'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>{t('auth.emailTab')}</span>
        </button>
        <button
          type="button"
          onClick={() => { onMethodChange('phone'); onInputChange(''); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
            loginMethod === 'phone'
              ? 'bg-white text-[#0d9488] shadow-xs'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{t('auth.phoneTab')}</span>
        </button>
      </div>

      {/* Core Address / Number input */}
      <div className="space-y-1.5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {loginMethod === 'email' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
          </div>
          <input
            type={loginMethod === 'email' ? 'email' : 'tel'}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={loginMethod === 'email' ? t('auth.emailPlaceholder') : t('auth.phonePlaceholder')}
            required
            className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-teal-500/15 focus:bg-white transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Action Submit */}
      <button
        type="submit"
        className="w-full bg-[#0d9488] hover:bg-[#0c857a] text-white font-black py-3.5 rounded-xl shadow-lg shadow-teal-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer text-xs sm:text-sm tracking-wide uppercase"
      >
        <span>{t('auth.getOtp')}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Quick Testing accounts tip */}
      <div className="pt-2 border-t border-slate-100/60">
        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">
          {t('auth.testAccounts')}
        </span>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <button
            type="button"
            onClick={() => { onMethodChange('email'); onInputChange('admin@hkbr.org'); }}
            className="p-1 px-2 hover:bg-teal-50 text-left rounded font-bold text-teal-800 border border-transparent hover:border-teal-100 transition-all cursor-pointer"
          >
            📧 admin@hkbr.org
          </button>
          <button
            type="button"
            onClick={() => { onMethodChange('phone'); onInputChange('91234567'); }}
            className="p-1 px-2 hover:bg-teal-50 text-left rounded font-bold text-teal-800 border border-transparent hover:border-teal-100 transition-all cursor-pointer"
          >
            📱 91234567
          </button>
        </div>
      </div>
    </form>
  );
}
