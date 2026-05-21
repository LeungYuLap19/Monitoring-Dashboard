/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mail, Phone, ShieldCheck, ArrowRight, Heart, Sparkles, User, Key, KeyRound, Smartphone, LogIn } from 'lucide-react';

interface UserProfile {
  emailOrPhone: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface LoginViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  onToast: (msg: string) => void;
}

// Built-in list of pre-configured users for convenience
const PRE_CONFIGURED_USERS: UserProfile[] = [
  {
    emailOrPhone: 'admin@hkbr.org',
    firstName: 'Admin User',
    lastName: '護理師',
    role: '護理主任'
  },
  {
    emailOrPhone: 'user@example.com',
    firstName: '小明',
    lastName: '張',
    role: '初級護理師'
  },
  {
    emailOrPhone: '91234567',
    firstName: '家豪',
    lastName: '陳',
    role: '高級觀察家'
  }
];

export default function LoginView({ onLoginSuccess, onToast }: LoginViewProps) {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [inputValue, setInputValue] = useState('');
  
  // Login flow state step: 'input' | 'otp' | 'register'
  const [step, setStep] = useState<'input' | 'otp' | 'register'>('input');
  
  // OTP States
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);

  // New User Data Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Local state storage of "registered" users within this session/sessionStorage to survive simple refreshes
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('hkbr_registered_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return PRE_CONFIGURED_USERS; }
    }
    return PRE_CONFIGURED_USERS;
  });

  useEffect(() => {
    localStorage.setItem('hkbr_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Countdown timer for OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle Send OTP click
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) {
      onToast(loginMethod === 'email' ? '⚠️ 請輸入您的電子信箱！' : '⚠️ 請輸入您的電話號碼！');
      return;
    }

    // Basic regex checks
    if (loginMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputValue.trim())) {
        onToast('⚠️ 請輸入有效的電子郵件格式！');
        return;
      }
    } else {
      const phoneRegex = /^[0-9+()-\s]{6,15}$/;
      if (!phoneRegex.test(inputValue.trim())) {
        onToast('⚠️ 請輸入正確的手機號碼！');
        return;
      }
    }

    // Check if the input is in our stored users
    const matchedUser = registeredUsers.find(
      (u) => u.emailOrPhone.toLowerCase() === inputValue.trim().toLowerCase()
    );

    if (matchedUser) {
      setIsNewUser(false);
    } else {
      setIsNewUser(true);
    }

    // Generate a 6-digit random OTP and "send" it
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setStep('otp');
    setTimer(60);

    // Dynamic professional notifications Toast
    onToast(`🔑 OTP 驗證碼發送成功！您的專屬測試驗證碼是 [ ${randomOtp} ]`);
  };

  // Handle Authentication verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!enteredOtp.trim()) {
      onToast('⚠️ 請輸入驗證碼！');
      return;
    }

    if (enteredOtp !== generatedOtp && enteredOtp !== '888888') { // Backdoor universal testing OTP is '888888'
      onToast('❌ 驗證碼錯誤，請重新確認！');
      return;
    }

    // OTP Correct! Check if new user or existing
    if (!isNewUser) {
      const matchedUser = registeredUsers.find(
        (u) => u.emailOrPhone.toLowerCase() === inputValue.trim().toLowerCase()
      );
      if (matchedUser) {
        onLoginSuccess(matchedUser);
        onToast(`✨ 歡迎回來，${matchedUser.lastName}${matchedUser.firstName}！您已成功登入系統。`);
      }
    } else {
      // Transition to Register page (Step 3)
      setStep('register');
      onToast('🔍 驗證通過！系統未偵測到此帳號，請在此填寫基本家長姓名以完成註冊。');
    }
  };

  // Handle Registration Submit (Step 3)
  const handleRegisterAndLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      onToast('⚠️ 請填寫您的姓氏與名字！');
      return;
    }

    // Perform a registration saving state
    const newUser: UserProfile = {
      emailOrPhone: inputValue.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: '新手兔兔守護者'
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    onLoginSuccess(newUser);
    onToast(`🎉 註冊成功！親愛的 ${lastName.trim()}${firstName.trim()}，歡迎加入救兔之家。`);
  };

  // Go back to input selection
  const handleBackToInput = () => {
    setStep('input');
    setEnteredOtp('');
    setIsNewUser(false);
  };

  return (
    <div id="login-container-root" className="min-h-screen bg-slate-50 flex items-center justify-center p-6 sm:p-8 select-none font-sans relative overflow-hidden">
      
      {/* Decorative ambient background blur objects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-teal-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] bg-amber-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main card box container (Un-blocked layout on mobile view) */}
      <div id="login-card" className="w-full max-w-md bg-transparent sm:bg-white rounded-none sm:rounded-3xl border-0 sm:border border-slate-100 shadow-none sm:shadow-2xl p-0 sm:p-10 space-y-8 relative">
        
        {/* Top Header Section */}
        <div className="text-center space-y-2">
          {/* Brand Icon Badge */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
            <Heart className="w-7 h-7 text-[#0d9488] fill-[#0d9488]/10 animate-pulse" />
          </div>

          <div className="space-y-1 pt-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              救兔之家觀察系統
            </h1>
            <span className="inline-block text-[10px] font-black tracking-widest text-[#0d9488] bg-teal-50 px-2.5 py-0.5 rounded-full uppercase">
              HKBR Bunny Portal
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            使用一次性驗證碼 (OTP) 安全、快速地登入及觀察兔寶
          </p>
        </div>

        {/* Dynamic State Step Viewports */}
        {step === 'input' && (
          /* STATE A: Input Email or Phone Number first */
          <form onSubmit={handleSendOtp} className="space-y-5">
            
            {/* TABS Selection */}
            <div className="bg-slate-50 p-1 rounded-xl border border-slate-100/60 flex">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('email');
                  setInputValue('');
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  loginMethod === 'email' 
                    ? 'bg-white text-[#0d9488] shadow-xs' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>電子信箱</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('phone');
                  setInputValue('');
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  loginMethod === 'phone' 
                    ? 'bg-white text-[#0d9488] shadow-xs' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>手機號碼</span>
              </button>
            </div>

            {/* Core Address / Number input */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                {loginMethod === 'email' ? '電子信箱 Email Address' : '手機號碼 Phone Number'}
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  {loginMethod === 'email' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                </div>
                
                <input
                  type={loginMethod === 'email' ? 'email' : 'tel'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    loginMethod === 'email' 
                      ? '例如: guardian@example.com' 
                      : '例如: 91234567 (免加國碼)'
                  }
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-150 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-teal-500/15 focus:bg-white transition-all shadow-inner"
                />
              </div>

              {/* Informative description below */}
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                {loginMethod === 'email' 
                  ? '輸入註冊電子郵件以發送六位數 OTP 信箱。新用戶亦可使用此方式。' 
                  : '支援各大通訊商。新用戶輸入後可在稍後步驟填寫基本家長名稱完成註冊。'
                }
              </p>
            </div>

            {/* Action Submit */}
            <button
              type="submit"
              className="w-full bg-[#0d9488] hover:bg-[#0c857a] text-white font-black py-3.5 rounded-xl shadow-lg shadow-teal-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer text-xs sm:text-sm tracking-wide uppercase"
            >
              <span>獲取一次性安全驗證碼 (Get OTP)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Testing accounts tip */}
            <div className="pt-2 border-t border-slate-100/60">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">
                ⚙️ 專用測試帳戶 (可直接使用)
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('email');
                    setInputValue('admin@hkbr.org');
                  }}
                  className="p-1 px-2 hover:bg-teal-50 text-left rounded font-bold text-teal-800 border border-transparent hover:border-teal-100 transition-all cursor-pointer"
                >
                  📧 admin@hkbr.org
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('phone');
                    setInputValue('91234567');
                  }}
                  className="p-1 px-2 hover:bg-teal-50 text-left rounded font-bold text-teal-800 border border-transparent hover:border-teal-100 transition-all cursor-pointer"
                >
                  📱 91234567
                </button>
              </div>
            </div>

          </form>
        )}

        {step === 'otp' && (
          /* STATE B: Enter OTP */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            
            {/* Address Confirmation Banner */}
            <div className="bg-teal-50/50 rounded-2xl border border-teal-100 p-4 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-teal-700 tracking-wider">
                  驗證碼已寄送至
                </span>
                <button
                  type="button"
                  onClick={handleBackToInput}
                  className="text-[10px] text-teal-600 hover:underline font-extrabold cursor-pointer"
                >
                  修改
                </button>
              </div>
              <p className="text-xs font-bold text-teal-900 truncate font-mono">
                {inputValue}
              </p>
            </div>

            {/* OTP Input Field */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                輸入 6 位數安全驗證碼 (6-digit Code)
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="輸入六位數字 (預設: 888888)"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-150 rounded-xl text-start font-mono text-xs sm:text-sm font-bold tracking-wider text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/15 focus:bg-white transition-all shadow-inner placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400 placeholder:text-xs"
                />
              </div>

              {/* Countdown counter or resend button */}
              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 px-1">
                <span>預設萬能驗證碼為: 888888</span>
                {timer > 0 ? (
                  <span>重新發送 ({timer}s)</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-teal-600 font-black hover:underline cursor-pointer"
                  >
                    重新發送驗證碼
                  </button>
                )}
              </div>
            </div>

            {/* Action verify */}
            <div className="space-y-2">
              <button
                type="submit"
                className="w-full bg-[#0d9488] hover:bg-[#0c857a] text-white font-black py-3.5 rounded-xl shadow-lg shadow-teal-950/10 flex items-center justify-center gap-2 transition-all cursor-pointer text-xs sm:text-sm tracking-wide uppercase"
              >
                <LogIn className="w-4.5 h-4.5" />
                <span>立即驗證驗證碼 (Verify OTP)</span>
              </button>
              
              <button
                type="button"
                onClick={handleBackToInput}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-150 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                返回變更登入資料
              </button>
            </div>

          </form>
        )}

        {step === 'register' && (
          /* STATE C: Dedicated registration screen */
          <form onSubmit={handleRegisterAndLogin} className="space-y-6">
            
            <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100/70 space-y-3">
              <div className="flex items-center gap-1.5 text-teal-800">
                <Sparkles className="w-4 h-4 shrink-0 text-teal-600 animate-pulse" />
                <span className="text-xs font-black">填寫基本家長資訊 (註冊新檔)</span>
              </div>
              
              <p className="text-[11px] text-slate-500 leading-normal font-medium">
                歡迎加入！這是您第一次使用該帳號 (<span className="font-mono text-teal-900 font-bold">{inputValue}</span>) 登入。請完成以下姓名註冊：
              </p>
            </div>

            {/* Named profile inputs */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 pb-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">姓氏 Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="例如: 陳"
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-150 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/15 focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">名字 First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="例如: 大華"
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-150 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/15 focus:bg-white transition-all shadow-inner"
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
                <span>完成註冊並登入 (Complete & Sign In)</span>
              </button>
              
              <button
                type="button"
                onClick={handleBackToInput}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-150 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                取消並返回首頁
              </button>
            </div>

          </form>
        )}

        {/* Footer Disclaimer */}
        <div className="text-center">
          <p className="text-[10px] text-slate-400 font-medium">
            安防監控協定保護中 • 救兔之家 HKBR 專用系統
          </p>
        </div>

      </div>
    </div>
  );
}
