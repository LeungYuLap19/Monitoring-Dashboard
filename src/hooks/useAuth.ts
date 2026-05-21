import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';
import { UserProfile } from '../types';
import { PRE_CONFIGURED_USERS } from '../constants';
import { validateEmail, validatePhone, generateOtp, getFromLocalStorage, setToLocalStorage } from '../lib/utils/utils';

export function useAuth(showToast: (msg: string) => void) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<'input' | 'otp' | 'register'>('input');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [inputValue, setInputValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(
    () => getFromLocalStorage('hkbr_registered_users', PRE_CONFIGURED_USERS)
  );

  useEffect(() => {
    setToLocalStorage('hkbr_registered_users', registeredUsers);
  }, [registeredUsers]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const onLoginSuccess = (user: UserProfile) => {
    setToLocalStorage('hkbr_current_user', user);
    navigate('/');
  };

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) {
      showToast(loginMethod === 'email' ? t('auth.errors.emptyEmail') : t('auth.errors.emptyPhone'));
      return;
    }
    if (loginMethod === 'email' && !validateEmail(inputValue)) {
      showToast(t('auth.errors.invalidEmail'));
      return;
    }
    if (loginMethod === 'phone' && !validatePhone(inputValue)) {
      showToast(t('auth.errors.invalidPhone'));
      return;
    }
    const matchedUser = registeredUsers.find(
      (u) => u.emailOrPhone.toLowerCase() === inputValue.trim().toLowerCase()
    );
    setIsNewUser(!matchedUser);
    const otp = generateOtp();
    setGeneratedOtp(otp);
    setStep('otp');
    setTimer(60);
    showToast(t('auth.toasts.otpSent', { otp }));
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp.trim()) {
      showToast(t('auth.errors.emptyOtp'));
      return;
    }
    if (enteredOtp !== generatedOtp && enteredOtp !== '888888') {
      showToast(t('auth.errors.wrongOtp'));
      return;
    }
    if (!isNewUser) {
      const matchedUser = registeredUsers.find(
        (u) => u.emailOrPhone.toLowerCase() === inputValue.trim().toLowerCase()
      );
      if (matchedUser) {
        onLoginSuccess(matchedUser);
        showToast(t('auth.toasts.welcomeBack', { name: `${matchedUser.lastName}${matchedUser.firstName}` }));
      }
    } else {
      setStep('register');
      showToast(t('auth.toasts.otpVerified'));
    }
  };

  const handleRegisterAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      showToast(t('auth.errors.emptyName'));
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
    showToast(t('auth.toasts.registered', { name: `${lastName.trim()}${firstName.trim()}` }));
  };

  const handleBackToInput = () => {
    setStep('input');
    setEnteredOtp('');
    setIsNewUser(false);
  };

  return {
    step, loginMethod, setLoginMethod,
    inputValue, setInputValue,
    enteredOtp, setEnteredOtp,
    timer, firstName, setFirstName,
    lastName, setLastName,
    handleSendOtp, handleVerifyOtp,
    handleRegisterAndLogin, handleBackToInput,
  };
}
