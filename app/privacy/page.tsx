'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-sage-700 
                   transition-colors duration-200 mb-6"
      >
        <i className="fa fa-arrow-left" />
        {t.backHome}
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-8">{t.privacy.title}</h1>

      <div className="space-y-4">
        {[t.privacy.p1, t.privacy.p2, t.privacy.p3, t.privacy.p4, t.privacy.p5].map((p, i) => (
          <p key={i} className="text-stone-600 leading-relaxed">{p}</p>
        ))}
      </div>
    </div>
  );
}
