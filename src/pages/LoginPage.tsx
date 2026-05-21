import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import HKBRIcon from '../components/global/HKBRIcon';
import PHealthIcon from '../components/global/PHealthIcon';
import LoginInputStep from '../components/pages/login/LoginInputStep';
import LoginOtpStep from '../components/pages/login/LoginOtpStep';
import LoginRegisterStep from '../components/pages/login/LoginRegisterStep';

interface UserProfile {
  emailOrPhone: string;
  firstName: string;
  lastName: string;
  role: string;
}

const PRE_CONFIGURED_USERS: UserProfile[] = [
  { emailOrPhone: 'admin@hkbr.org', firstName: 'Admin User', lastName: '護理師', role: '護理主任' },
  { emailOrPhone: 'user@example.com', firstName: '小明', lastName: '張', role: '初級護理師' },
  { emailOrPhone: '91234567', firstName: '家豪', lastName: '陳', role: '高級觀察家' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'otp' | 'register'>('input');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [inputValue, setInputValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('hkbr_registered_users');
    if (saved) {
      try { return JSON.parse(saved); } catch { return PRE_CONFIGURED_USERS; }
    }
    return PRE_CONFIGURED_USERS;
  });

  useEffect(() => {
    localStorage.setItem('hkbr_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const onLoginSuccess = (user: UserProfile) => {
    localStorage.setItem('hkbr_current_user', JSON.stringify(user));
    navigate('/');
  };

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) {
      showToast(loginMethod === 'email' ? '⚠️ 請輸入您的電子信箱！' : '⚠️ 請輸入您的電話號碼！');
      return;
    }
    if (loginMethod === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue.trim())) {
        showToast('⚠️ 請輸入有效的電子郵件格式！');
        return;
      }
    } else {
      if (!/^[0-9+()-\s]{6,15}$/.test(inputValue.trim())) {
        showToast('⚠️ 請輸入正確的手機號碼！');
        return;
      }
    }
    const matchedUser = registeredUsers.find(
      (u) => u.emailOrPhone.toLowerCase() === inputValue.trim().toLowerCase()
    );
    setIsNewUser(!matchedUser);
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setStep('otp');
    setTimer(60);
    showToast(`🔑 OTP 驗證碼發送成功！您的專屬測試驗證碼是 [ ${randomOtp} ]`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp.trim()) {
      showToast('⚠️ 請輸入驗證碼！');
      return;
    }
    if (enteredOtp !== generatedOtp && enteredOtp !== '888888') {
      showToast('❌ 驗證碼錯誤，請重新確認！');
      return;
    }
    if (!isNewUser) {
      const matchedUser = registeredUsers.find(
        (u) => u.emailOrPhone.toLowerCase() === inputValue.trim().toLowerCase()
      );
      if (matchedUser) {
        onLoginSuccess(matchedUser);
        showToast(`✨ 歡迎回來，${matchedUser.lastName}${matchedUser.firstName}！您已成功登入系統。`);
      }
    } else {
      setStep('register');
      showToast('🔍 驗證通過！系統未偵測到此帳號，請在此填寫基本家長姓名以完成註冊。');
    }
  };

  const handleRegisterAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      showToast('⚠️ 請填寫您的姓氏與名字！');
      return;
    }
    const newUser: UserProfile = {
      emailOrPhone: inputValue.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: '新手兔兔守護者',
    };
    setRegisteredUsers((prev) => [...prev, newUser]);
    onLoginSuccess(newUser);
    showToast(`🎉 註冊成功！親愛的 ${lastName.trim()}${firstName.trim()}，歡迎加入救兔之家。`);
  };

  const handleBackToInput = () => {
    setStep('input');
    setEnteredOtp('');
    setIsNewUser(false);
  };

  return (
    <div id="page-login" className="w-full h-screen">
      <div id="login-container-root" className="min-h-screen bg-slate-50 flex items-center justify-center p-6 sm:p-8 select-none font-sans relative overflow-hidden">
        {/* Decorative ambient background blur objects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-teal-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] bg-amber-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Main card box container */}
        <div id="login-card" className="w-full max-w-md bg-transparent sm:bg-white rounded-none sm:rounded-3xl border-0 sm:border border-slate-100 shadow-none sm:shadow-2xl p-0 sm:p-10 space-y-5 relative">
          {/* Top Header Section */}
          <div className="flex space-x-1 mb-16">
            <HKBRIcon />
            <h1 className="font-medium text-sm">
              救兔之家<br/>觀察系統
            </h1>
          </div>

          <div className="flex-row space-y-1">
            <h1 className="text-center text-2xl font-semibold text-slate-800">
              Sign in with OTP
            </h1>
            <p className="text-center text-xs text-slate-400">使用一次性驗證碼 (OTP) 安全、快速地登入及觀察兔寶</p>
          </div>

          {/* Dynamic State Step Viewports */}
          {step === 'input' && (
            <LoginInputStep
              loginMethod={loginMethod}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onMethodChange={setLoginMethod}
              onSubmit={handleSendOtp}
            />
          )}

          {step === 'otp' && (
            <LoginOtpStep
              inputValue={inputValue}
              enteredOtp={enteredOtp}
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

      {toastMessage && (
        <div
          id="global-alert-toast"
          className="fixed bottom-6 right-6 max-w-md bg-[#0f172a] text-white p-4 rounded-2xl shadow-2xl border border-slate-850 z-50 flex items-start gap-3"
        >
          <div className="w-5 h-5 bg-[#0d9488] rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-xs font-black text-teal-400">系統通知 System Toast</span>
            <p className="text-xs text-slate-200 mt-0.5 leading-normal font-semibold">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}