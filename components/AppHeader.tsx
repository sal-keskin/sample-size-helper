'use client';

import Link from 'next/link';
import { LanguageToggle } from './LanguageToggle';
import { useTranslation } from '@/lib/i18n';

export function AppHeader() {
  const { t } = useTranslation();

  return (
    <header className="w-full border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-base sm:text-lg font-semibold text-stone-800 hover:text-sage-700 
                     transition-colors duration-200 leading-tight"
        >
          {t.appTitle}
        </Link>
        <LanguageToggle />
      </div>
    </header>
  );
}
