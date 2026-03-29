'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function AboutPage() {
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

      <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-8">{t.about.title}</h1>

      <div className="space-y-8">
        {/* What */}
        <section>
          <h2 className="text-lg font-semibold text-stone-700 mb-2">{t.about.what}</h2>
          <p className="text-stone-600 leading-relaxed">{t.about.whatText}</p>
        </section>

        {/* Who */}
        <section>
          <h2 className="text-lg font-semibold text-stone-700 mb-2">{t.about.who}</h2>
          <p className="text-stone-600 leading-relaxed">{t.about.whoText}</p>
        </section>

        {/* Does NOT */}
        <section>
          <h2 className="text-lg font-semibold text-stone-700 mb-2">{t.about.doesNot}</h2>
          <ul className="space-y-2">
            {t.about.doesNotItems.map((item, i) => (
              <li key={i} className="text-stone-600 flex items-start gap-2">
                <span className="text-stone-400 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Predictor disclaimer */}
        <section className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <h2 className="text-lg font-semibold text-amber-800 mb-2">{t.about.predictorDisclaimer}</h2>
          <p className="text-amber-700 leading-relaxed">{t.about.predictorDisclaimerText}</p>
        </section>

        {/* Share links */}
        <section>
          <h2 className="text-lg font-semibold text-stone-700 mb-2">{t.about.shareLinksTitle}</h2>
          <p className="text-stone-600 leading-relaxed">{t.about.shareLinksText}</p>
        </section>

        {/* References */}
        <section>
          <h2 className="text-lg font-semibold text-stone-700 mb-2">{t.about.references}</h2>
          <ol className="list-decimal list-inside space-y-2">
            {t.about.referencesItems.map((item, i) => (
              <li key={i} className="text-sm text-stone-600 leading-relaxed">{item}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
