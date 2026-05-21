import React from 'react';
import { Sparkles, User } from 'lucide-react';

interface LoginRegisterStepProps {
  inputValue: string;
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export default function LoginRegisterStep({
  inputValue,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onSubmit,
  onBack,
}: LoginRegisterStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
              onChange={(e) => onLastNameChange(e.target.value)}
              placeholder="例如: 陳"
              className="w-full px-3.5 py-3 bg-slate-50 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/15 focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">名字 First Name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder="例如: 大華"
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
          <span>完成註冊並登入 (Complete & Sign In)</span>
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-150 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          取消並返回首頁
        </button>
      </div>
    </form>
  );
}
