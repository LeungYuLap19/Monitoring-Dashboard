import React, { useState } from 'react';
import PHealthIcon from '../components/global/PHealthIcon';
import LanguageSwitcher from '../components/global/LanguageSwitcher';
import LoginInputStep from '../components/pages/login/LoginInputStep';
import LoginOtpStep from '../components/pages/login/LoginOtpStep';
import LoginRegisterStep from '../components/pages/login/LoginRegisterStep';
import { useAuth } from '../hooks/auth';
import { useNgoAuth } from '../hooks/auth/useNgoAuth';
import { useTranslation } from '../lib/i18n';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';

export default function LoginPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'user' | 'ngo'>('user');
  const showToast = (message: string) => toast.success(message);
  const {
    step, loginMethod, setLoginMethod,
    regionCode, setRegionCode,
    inputValue, setInputValue,
    enteredOtp, setEnteredOtp,
    timer, firstName, setFirstName,
    lastName, setLastName,
    isSubmitting,
    handleSendOtp, handleVerifyOtp,
    handleRegisterAndLogin, handleBackToInput,
  } = useAuth(showToast);
  const ngo = useNgoAuth();

  return (
    <div id="page-login" className="w-full h-screen">
      <div id="login-container-root" className="min-h-screen bg-slate-50 flex items-center justify-center p-6 sm:p-8 select-none font-sans relative overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] size-[40vw] bg-teal-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute -bottom-[10%] -right-[10%] size-[35vw] bg-amber-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div id="login-card" className="w-full max-w-md bg-transparent sm:bg-white rounded-none sm:rounded-3xl border-0 sm:border border-slate-100 shadow-none sm:shadow-2xl p-0 sm:p-10 space-y-5 relative">
          <div className="flex justify-between items-start mb-8">
            <PHealthIcon size="small" />
            <LanguageSwitcher />
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('user')}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${activeTab === 'user' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}
            >
              {t('auth.tabs.user')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ngo')}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${activeTab === 'ngo' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}
            >
              {t('auth.tabs.ngo')}
            </button>
          </div>

          {activeTab === 'user' && (
            <>
              <div className="flex-row space-y-1">
                <h1 className="text-center text-2xl font-semibold text-slate-800">
                  {t('auth.signInTitle')}
                </h1>
                <p className="text-center text-xs text-slate-400">{t('auth.signInSubtitle')}</p>
              </div>

              {step === 'input' && (
                <LoginInputStep
                  loginMethod={loginMethod}
                  inputValue={inputValue}
                  regionCode={regionCode}
                  isSubmitting={isSubmitting}
                  onInputChange={setInputValue}
                  onRegionCodeChange={setRegionCode}
                  onMethodChange={setLoginMethod}
                  onSubmit={handleSendOtp}
                />
              )}

              {step === 'otp' && (
                <LoginOtpStep
                  inputValue={inputValue}
                  enteredOtp={enteredOtp}
                  isSubmitting={isSubmitting}
                  onOtpChange={setEnteredOtp}
                  timer={timer}
                  onResend={() => handleSendOtp()}
                  onVerify={handleVerifyOtp}
                  onBack={handleBackToInput}
                />
              )}

              {step === 'register' && (
                <LoginRegisterStep
                  inputValue={inputValue}
                  firstName={firstName}
                  lastName={lastName}
                  isSubmitting={isSubmitting}
                  onFirstNameChange={setFirstName}
                  onLastNameChange={setLastName}
                  onSubmit={handleRegisterAndLogin}
                  onBack={handleBackToInput}
                />
              )}
            </>
          )}

          {activeTab === 'ngo' && (
            <div className="space-y-4">
              <div className="flex-row space-y-1">
                <h1 className="text-center text-2xl font-semibold text-slate-800">
                  {t('auth.ngo.signInTitle')}
                </h1>
                <p className="text-center text-xs text-slate-400">{t('auth.ngo.signInSubtitle')}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">{t('auth.ngo.emailLabel')}</label>
                  <input
                    type="email"
                    value={ngo.email}
                    onChange={(e) => ngo.setEmail(e.target.value)}
                    placeholder={t('auth.ngo.emailPlaceholder')}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">{t('auth.ngo.passwordLabel')}</label>
                  <input
                    type="password"
                    value={ngo.password}
                    onChange={(e) => ngo.setPassword(e.target.value)}
                    placeholder={t('auth.ngo.passwordPlaceholder')}
                    onKeyDown={(e) => { if (e.key === 'Enter') void ngo.handleLogin(); }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              {ngo.error && (
                <p className="text-xs text-rose-500 font-semibold text-center">{t(ngo.error)}</p>
              )}

              <Button
                onClick={() => void ngo.handleLogin()}
                disabled={ngo.isLoading}
                className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 font-bold"
              >
                {ngo.isLoading ? t('auth.loading') : t('auth.ngo.loginBtn')}
              </Button>
            </div>
          )}

          <div className="w-full flex justify-center pt-2">
            <PHealthIcon size='small' />
          </div>
        </div>
      </div>
    </div>
  );
}
