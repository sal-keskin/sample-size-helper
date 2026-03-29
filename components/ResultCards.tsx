'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { copyToClipboard, buildShareUrl } from '@/lib/urlState';

// ── Result Summary Card ──
interface ResultSummaryCardProps {
  title: string;
  mainValue: number;
  mainLabel: string;
  items: { label: string; value: string | number }[];
  explanation: string;
}

export function ResultSummaryCard({ title, mainValue, mainLabel, items, explanation }: ResultSummaryCardProps) {
  return (
    <div className="rounded-xl border border-sage-200 bg-sage-50/50 p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-stone-800 mb-4">{title}</h2>
      <div className="text-center mb-4">
        <div className="text-4xl sm:text-5xl font-bold text-sage-700">{mainValue.toLocaleString()}</div>
        <div className="text-sm text-stone-500 mt-1">{mainLabel}</div>
      </div>
      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {items.map((item, i) => (
            <div key={i} className="text-center p-2 rounded-lg bg-white border border-stone-200">
              <div className="text-lg font-semibold text-stone-700">{item.value}</div>
              <div className="text-xs text-stone-500">{item.label}</div>
            </div>
          ))}
        </div>
      )}
      <p className="text-sm text-stone-600 leading-relaxed">{explanation}</p>
    </div>
  );
}

// ── Assumptions Card ──
interface AssumptionsCardProps {
  items: { label: string; value: string | number }[];
}

export function AssumptionsCard({ items }: AssumptionsCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-stone-700 mb-3">{t.assumptions.title}</h3>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-stone-500">{item.label}</span>
            <span className="font-medium text-stone-700">
              {typeof item.value === 'number' && isNaN(item.value) ? '—' : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Methods Card ──
interface MethodsCardProps {
  text: string;
}

export function MethodsCard({ text }: MethodsCardProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-stone-700">{t.methods.title}</h3>
          <p className="text-xs text-stone-400 mt-0.5">{t.methods.subtitle}</p>
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-300 
                     hover:bg-stone-50 transition-colors duration-200 focus:outline-none 
                     focus:ring-2 focus:ring-sage-500"
        >
          {copied ? t.copied : t.methods.copyText}
        </button>
      </div>
      <p className="text-sm text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-lg">
        {text}
      </p>
    </div>
  );
}

// ── Checklist Card ──
export function ChecklistCard() {
  const { t } = useTranslation();
  const items = [
    t.checklist.mainOutcome,
    t.checklist.assumptions,
    t.checklist.alphaPower,
    t.checklist.attrition,
    t.checklist.finalTarget,
  ];

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-stone-700 mb-3">{t.checklist.title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-stone-600">
            <svg className="w-4 h-4 text-sage-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Share Link Card ──
interface ShareLinkCardProps {
  basePath: string;
  state: Record<string, string | number | boolean | undefined>;
}

export function ShareLinkCard({ basePath, state }: ShareLinkCardProps) {
  const { t, lang } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = buildShareUrl(basePath, { ...state, lang });
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-stone-700 mb-1">{t.shareLink}</h3>
      <p className="text-xs text-stone-400 mb-3">{t.shareLinkDesc}</p>
      <button
        onClick={handleCopy}
        className="w-full px-4 py-2.5 text-sm font-medium rounded-lg border border-sage-300 
                   text-sage-700 hover:bg-sage-50 transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-sage-500"
      >
        {copied ? `✓ ${t.copied}` : t.copyLink}
      </button>
    </div>
  );
}

// ── Warning Note ──
interface WarningNoteProps {
  text: string;
}

export function WarningNote({ text }: WarningNoteProps) {
  return (
    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800 flex items-start gap-2">
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <span>{text}</span>
    </div>
  );
}

// ── Helper Callout ──
interface HelperCalloutProps {
  text: string;
  variant?: 'info' | 'tip';
}

export function HelperCallout({ text, variant = 'info' }: HelperCalloutProps) {
  const colors = variant === 'tip'
    ? 'bg-sage-50 border-sage-200 text-sage-800'
    : 'bg-blue-50 border-blue-200 text-blue-800';

  return (
    <div className={`p-3 rounded-lg border text-sm flex items-start gap-2 ${colors}`}>
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{text}</span>
    </div>
  );
}

// ── Unsupported Path Note ──
interface UnsupportedPathNoteProps {
  backHref?: string;
}

export function UnsupportedPathNote({ backHref = '/wizard' }: UnsupportedPathNoteProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-stone-700 mb-2">{t.unsupported.title}</h2>
      <p className="text-stone-500 mb-6">{t.unsupported.text}</p>
      <a
        href={backHref}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sage-600 text-white 
                   text-sm font-medium hover:bg-sage-700 transition-colors duration-200"
      >
        {t.unsupported.back}
      </a>
    </div>
  );
}
