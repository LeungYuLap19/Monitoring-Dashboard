import { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Locale } from './types';
import { getFromLocalStorage, setToLocalStorage } from '../utils/utils';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: 'zh-TW',
  setLocale: () => {},
});

function getInitialLocale(): Locale {
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang');
  if (urlLang === 'en' || urlLang === 'zh-TW') return urlLang;
  return getFromLocalStorage<Locale>('hkbr_locale', 'zh-TW');
}

function syncUrlParam(locale: Locale) {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', locale);
  window.history.replaceState({}, '', url.toString());
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    syncUrlParam(locale);
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setToLocalStorage('hkbr_locale', newLocale);
    syncUrlParam(newLocale);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}
