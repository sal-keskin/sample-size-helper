'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t border-stone-200 bg-stone-50 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-stone-500">
          <p>{t.footerText}</p>
          <div className="flex gap-4">
            <Link
              href="/about"
              className="hover:text-sage-700 transition-colors duration-200"
            >
              {t.footerAbout}
            </Link>
            <Link
              href="/privacy"
              className="hover:text-sage-700 transition-colors duration-200"
            >
              {t.footerPrivacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
