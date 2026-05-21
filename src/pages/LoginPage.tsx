import React from 'react';
import HKBRIcon from '../components/global/HKBRIcon';
import PHealthIcon from '../components/global/PHealthIcon';
import LanguageSwitcher from '../components/global/LanguageSwitcher';
import LoginInputStep from '../components/pages/login/LoginInputStep';
import LoginOtpStep from '../components/pages/login/LoginOtpStep';
import LoginRegisterStep from '../components/pages/login/LoginRegisterStep';
import { useAuth } from '../hooks/auth';
import { useTranslation } from '../lib/i18n';
import { toast } from 'sonner';
import { Card } from '../components/ui/card';

export default function LoginPage() {
  const { t } = useTranslation();
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

  return (
    <div id="page-login" className="w-full h-screen">
      <div id="login-container-root" className="min-h-screen bg-slate-50 flex items-center justify-center p-6 sm:p-8 select-none font-sans relative overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] size-[40vw] bg-teal-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute -bottom-[10%] -right-[10%] size-[35vw] bg-amber-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div id="login-card" className="w-full max-w-md bg-transparent sm:bg-white rounded-none sm:rounded-3xl border-0 sm:border border-slate-100 shadow-none sm:shadow-2xl p-0 sm:p-10 space-y-5 relative">
          <div className="flex justify-between items-start mb-16">
            <div className="flex space-x-1">
              <HKBRIcon />
              <h1 className="font-medium text-sm">
                救兔之家<br/>觀察系統
              </h1>
            </div>
            <LanguageSwitcher />
          </div>

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

          <div className="w-full flex justify-center">
            <PHealthIcon size='small' />
          </div>
        </div>
      </div>
    </div>
  );
}
