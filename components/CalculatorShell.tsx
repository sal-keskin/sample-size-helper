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
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
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
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span>{t.privacyNote}</span>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
