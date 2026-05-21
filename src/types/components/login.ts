export interface LoginInputStepProps {
  loginMethod: 'email' | 'phone';
  inputValue: string;
  onInputChange: (value: string) => void;
  onMethodChange: (method: 'email' | 'phone') => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface LoginOtpStepProps {
  inputValue: string;
  enteredOtp: string;
  onOtpChange: (value: string) => void;
  timer: number;
  onResend: () => void;
  onVerify: (e: React.FormEvent) => void;
  onBack: () => void;
}

export interface LoginRegisterStepProps {
  inputValue: string;
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}
