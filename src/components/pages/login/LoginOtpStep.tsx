import { useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { LogIn } from 'lucide-react';
import { LoginOtpStepProps } from '../../../types';
import { useTranslation } from '../../../lib/i18n';

export default function LoginOtpStep({
  inputValue,
  enteredOtp,
  onOtpChange,
  timer,
  onResend,
  onVerify,
  onBack,
}: LoginOtpStepProps) {
  const { t } = useTranslation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => enteredOtp[i] || '');

  const focusInput = (index: number) => {
    if (index >= 0 && index < 6) inputRefs.current[index]?.focus();
  };

  const updateDigit = (index: number, value: string) => {
    const newDigits = [...digits];
    newDigits[index] = value;
    onOtpChange(newDigits.join('').replace(/[^0-9]/g, ''));
  };

  const handleInput = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '');
    if (!digit) return;
    updateDigit(index, digit[0]);
    if (index < 5) focusInput(index + 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[index]) {
        updateDigit(index, '');
      } else if (index > 0) {
        updateDigit(index - 1, '');
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted) {
      onOtpChange(pasted);
      focusInput(Math.min(pasted.length, 5));
    }
  };

  return (
    <form onSubmit={onVerify} className="space-y-6">
      <div className="bg-teal-50/50 rounded-2xl border border-teal-100 p-4 space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-teal-700 tracking-wider">
            {t('auth.otpSentTo')}
          </span>
          <button
            type="button"
            onClick={onBack}
            className="text-[10px] text-teal-600 hover:underline font-extrabold cursor-pointer"
          >
            {t('auth.changeInput')}
          </button>
        </div>
        <p className="text-xs font-bold text-teal-900 truncate font-mono">
          {inputValue}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
          {t('auth.otpLabel')}
        </label>

        <div className="grid grid-cols-6 gap-2">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              autoFocus={i === 0}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className="h-16 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 focus:bg-white transition-all"
            />
          ))}
        </div>

        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 px-1">
          <span>{t('auth.otpHint')}</span>
          {timer > 0 ? (
            <span>重新發送 ({timer}s)</span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              className="text-teal-600 font-black hover:underline cursor-pointer"
            >
              {t('auth.resendOtp')}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="submit"
          className="w-full bg-[#0d9488] hover:bg-[#0c857a] text-white font-black py-3.5 rounded-xl shadow-lg shadow-teal-950/10 flex items-center justify-center gap-2 transition-all cursor-pointer text-xs sm:text-sm tracking-wide uppercase"
        >
          <LogIn className="w-4.5 h-4.5" />
          <span>{t('auth.verifyOtp')}</span>
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-150 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          {t('auth.backToInput')}
        </button>
      </div>
    </form>
  );
}
