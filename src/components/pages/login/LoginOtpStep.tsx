import React from 'react';
import { KeyRound, LogIn } from 'lucide-react';

interface LoginOtpStepProps {
  inputValue: string;
  enteredOtp: string;
  onOtpChange: (value: string) => void;
  timer: number;
  onResend: () => void;
  onVerify: (e: React.FormEvent) => void;
  onBack: () => void;
}

export default function LoginOtpStep({
  inputValue,
  enteredOtp,
  onOtpChange,
  timer,
  onResend,
  onVerify,
  onBack,
}: LoginOtpStepProps) {
  return (
    <form onSubmit={onVerify} className="space-y-6">
      {/* Address Confirmation Banner */}
      <div className="bg-teal-50/50 rounded-2xl border border-teal-100 p-4 space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-teal-700 tracking-wider">
            驗證碼已寄送至
          </span>
          <button
            type="button"
            onClick={onBack}
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
            onChange={(e) => onOtpChange(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="輸入六位數字 (預設: 888888)"
            required
            autoFocus
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-start font-mono text-xs sm:text-sm font-bold tracking-wider text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/15 focus:bg-white transition-all shadow-inner placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400 placeholder:text-xs"
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
              onClick={onResend}
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
          onClick={onBack}
          className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-150 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          返回變更登入資料
        </button>
      </div>
    </form>
  );
}
