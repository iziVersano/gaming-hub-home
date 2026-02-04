import { useState, useEffect, useCallback } from 'react';
import { translations, Language } from '@/i18n';

const LANG_KEY = 'lang';

// Deprecated: use I18nContext instead for global language state.
export function useI18n() {
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem(LANG_KEY);
    return stored === 'en' ? 'en' : 'he';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const t = useCallback(
    (key: string) => {
      return translations[lang][key] || key;
    },
    [lang]
  );

  return { lang, setLang, t };
}

export {};
