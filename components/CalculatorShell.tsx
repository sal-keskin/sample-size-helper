'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

interface CalculatorShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backHref?: string;
}

export function CalculatorShell({ title, subtitle, children, backHref = '/' }: CalculatorShellProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back link */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-sage-700 
                   transition-colors duration-200 mb-6"
      >
        <i className="fa fa-arrow-left" />
        {t.backHome}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 leading-tight">
          {title}
        </h1>
        <p className="mt-2 text-stone-500 leading-relaxed">{subtitle}</p>
      </div>

      {/* Privacy note */}
      <div className="mb-6 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800 flex items-start gap-2">
        <i className="fa fa-shield mt-0.5" />
        <span>{t.privacyNote}</span>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
