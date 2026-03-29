'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Language } from '@/types';
import { en } from '@/content/en';
import { tr } from '@/content/tr';

export type TranslationDict = typeof en;

const dictionaries: Record<Language, TranslationDict> = { en, tr };

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationDict;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check URL param first, then localStorage, then browser language
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'tr' || urlLang === 'en') {
      setLangState(urlLang);
      localStorage.setItem('samplesize-lang', urlLang);
    } else {
      const saved = localStorage.getItem('samplesize-lang') as Language | null;
      if (saved === 'en' || saved === 'tr') {
        setLangState(saved);
      } else {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('tr')) {
          setLangState('tr');
        }
      }
    }
    setMounted(true);
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('samplesize-lang', newLang);
    // Update URL param
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.history.replaceState({}, '', url.toString());
  }, []);

  const t = dictionaries[lang];

  // Prevent flash of wrong language
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
