import React, { useState } from 'react';
import { Mail, Phone, ArrowRight, ChevronDown } from 'lucide-react';
import { LoginInputStepProps } from '../../../types';
import { useTranslation } from '../../../lib/i18n';

const REGION_CODES = [
  { code: '+852', label: 'HK +852' },
  { code: '+86', label: 'CN +86' },
  { code: '+886', label: 'TW +886' },
  { code: '+65', label: 'SG +65' },
  { code: '+81', label: 'JP +81' },
  { code: '+44', label: 'UK +44' },
  { code: '+1', label: 'US +1' },
];

export default function LoginInputStep({
  loginMethod,
  inputValue,
  onInputChange,
  onMethodChange,
  onSubmit,
}: LoginInputStepProps) {
  const { t } = useTranslation();
  const [regionCode, setRegionCode] = useState('+852');
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
        {loginMethod === 'email' ? (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-teal-500/15 focus:bg-white transition-all shadow-inner"
            />
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative shrink-0">
              <select
                value={regionCode}
                onChange={(e) => setRegionCode(e.target.value)}
                className="appearance-none h-full pl-3 pr-7 py-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/15 cursor-pointer"
              >
                {REGION_CODES.map((r) => (
                  <option key={r.code} value={r.code}>{r.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder={t('auth.phonePlaceholder')}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-teal-500/15 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>
        )}
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
