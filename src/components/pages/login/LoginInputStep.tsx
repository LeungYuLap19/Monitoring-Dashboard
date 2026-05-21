import React from 'react';
import { Mail, Phone, ArrowRight, ChevronDown } from 'lucide-react';
import { LoginInputStepProps } from '../../../types';
import { useTranslation } from '../../../lib/i18n';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';

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
  regionCode,
  isSubmitting = false,
  onInputChange,
  onRegionCodeChange,
  onMethodChange,
  onSubmit,
}: LoginInputStepProps) {
  const { t } = useTranslation();
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Tabs value={loginMethod} onValueChange={(v) => { onMethodChange(v as 'email' | 'phone'); onInputChange(''); }}>
        <TabsList className="w-full bg-slate-50 p-1 rounded-xl border border-slate-100/60 h-auto">
          <TabsTrigger
            value="email"
            disabled={isSubmitting}
            className="flex-1 gap-1.5 py-2.5 rounded-lg text-xs font-black data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-xs text-slate-400 hover:text-slate-600"
          >
            <Mail className="size-3.5" />
            <span>{t('auth.emailTab')}</span>
          </TabsTrigger>
          <TabsTrigger
            value="phone"
            disabled={isSubmitting}
            className="flex-1 gap-1.5 py-2.5 rounded-lg text-xs font-black data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-xs text-slate-400 hover:text-slate-600"
          >
            <Phone className="size-3.5" />
            <span>{t('auth.phoneTab')}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-1.5">
        {loginMethod === 'email' ? (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="size-4" />
            </div>
            <Input
              type="email"
              value={inputValue}
              disabled={isSubmitting}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              required
              className="pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-450 shadow-inner"
            />
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative shrink-0">
              <select
                value={regionCode}
                disabled={isSubmitting}
                onChange={(e) => onRegionCodeChange(e.target.value)}
                className="appearance-none h-full pl-3 pr-7 py-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/15 cursor-pointer"
              >
                {REGION_CODES.map((r) => (
                  <option key={r.code} value={r.code}>{r.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="size-4" />
              </div>
              <Input
                type="tel"
                value={inputValue}
                disabled={isSubmitting}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder={t('auth.phonePlaceholder')}
                required
                className="pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-450 shadow-inner"
              />
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 shadow-lg shadow-teal-900/10 font-black text-xs sm:text-sm tracking-wide uppercase"
      >
        <span>{isSubmitting ? t('auth.loading') : t('auth.getOtp')}</span>
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
