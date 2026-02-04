import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { translations, Language } from '@/i18n';

const LANG_KEY = 'lang';
const LANG_VERSION_KEY = 'lang_version';
const CURRENT_LANG_VERSION = '2'; // Increment to reset all users to Hebrew

interface I18nContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    // Check if we need to reset to Hebrew (version changed)
    const storedVersion = localStorage.getItem(LANG_VERSION_KEY);
    if (storedVersion !== CURRENT_LANG_VERSION) {
      localStorage.setItem(LANG_VERSION_KEY, CURRENT_LANG_VERSION);
      localStorage.setItem(LANG_KEY, 'he');
      return 'he';
    }
    const stored = localStorage.getItem(LANG_KEY);
    return stored === 'en' ? 'en' : 'he';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const t = useCallback(
    (key: string, fallback?: string) => translations[lang][key] || fallback || key,
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
}
