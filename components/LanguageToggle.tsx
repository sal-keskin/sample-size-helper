'use client';

import { useTranslation } from '@/lib/i18n';
import type { Language } from '@/types';

export function LanguageToggle() {
  const { lang, setLang, t } = useTranslation();

  const toggle = () => {
    const newLang: Language = lang === 'en' ? 'tr' : 'en';
    setLang(newLang);
  };

  return (
    <button
      onClick={toggle}
      className="px-3 py-1.5 text-sm font-medium rounded-lg border border-stone-300 
                 hover:bg-stone-100 transition-colors duration-200 focus:outline-none 
                 focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
      aria-label={`Switch language to ${t.langToggle}`}
    >
      {t.langToggle}
    </button>
  );
}
