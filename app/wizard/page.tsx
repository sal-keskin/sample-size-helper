'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

type WizardStep = 'main' | 'compare' | 'notSure';

function WizardContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<WizardStep>('main');

  useEffect(() => {
    const s = searchParams.get('step');
    if (s === 'compare') setStep('compare');
    else if (s === 'notSure') setStep('notSure');
    else setStep('main');
  }, [searchParams]);

  const goTo = (newStep: WizardStep) => {
    setStep(newStep);
    router.replace(`/wizard?step=${newStep}`, { scroll: false });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-sage-700 
                   transition-colors duration-200 mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t.backHome}
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-2">{t.wizard.title}</h1>
      <p className="text-stone-500 mb-8">{t.wizard.subtitle}</p>

      {/* Main step */}
      {step === 'main' && (
        <div className="space-y-3 animate-fadeIn">
          <WizardCard
            title={t.wizard.opt1}
            example={t.wizard.opt1Ex}
            onClick={() => router.push('/calc/prevalence')}
          />
          <WizardCard
            title={t.wizard.opt2}
            example={t.wizard.opt2Ex}
            onClick={() => goTo('compare')}
          />
          <WizardCard
            title={t.wizard.opt3}
            example={t.wizard.opt3Ex}
            onClick={() => router.push('/calc/predictors')}
          />
          <WizardCard
            title={t.wizard.opt4}
            example={t.wizard.opt4Ex}
            onClick={() => router.push('/calc/already-have-data')}
          />
          <WizardCard
            title={t.wizard.opt5}
            example={t.wizard.opt5Ex}
            onClick={() => goTo('notSure')}
          />
        </div>
      )}

      {/* Compare sub-step */}
      {step === 'compare' && (
        <div className="animate-fadeIn">
          <button
            onClick={() => goTo('main')}
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-sage-700 
                       transition-colors duration-200 mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t.backToCalc}
          </button>
          <h2 className="text-xl font-semibold text-stone-800 mb-4">{t.wizard.compareTitle}</h2>
          <div className="space-y-3">
            <WizardCard
              title={t.wizard.compareNum}
              example={t.wizard.compareNumEx}
              sublabel={t.wizard.compareNumLabel}
              onClick={() => router.push('/calc/two-means')}
            />
            <WizardCard
              title={t.wizard.compareBin}
              example={t.wizard.compareBinEx}
              sublabel={t.wizard.compareBinLabel}
              onClick={() => router.push('/calc/two-proportions')}
            />
          </div>
        </div>
      )}

      {/* "Not sure" sub-step */}
      {step === 'notSure' && (
        <div className="animate-fadeIn">
          <button
            onClick={() => goTo('main')}
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-sage-700 
                       transition-colors duration-200 mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t.backToCalc}
          </button>
          <h2 className="text-xl font-semibold text-stone-800 mb-4">{t.wizard.notSureTitle}</h2>
          <div className="space-y-3">
            <ExampleCard
              question={t.wizard.notSureEx1}
              route={t.wizard.notSureEx1Route}
              href="/calc/prevalence"
            />
            <ExampleCard
              question={t.wizard.notSureEx2}
              route={t.wizard.notSureEx2Route}
              href="/wizard?step=compare"
            />
            <ExampleCard
              question={t.wizard.notSureEx3}
              route={t.wizard.notSureEx3Route}
              href="/calc/predictors"
            />
            <ExampleCard
              question={t.wizard.notSureEx4}
              route={t.wizard.notSureEx4Route}
              href="/calc/already-have-data"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function WizardCard({
  title,
  example,
  sublabel,
  onClick,
}: {
  title: string;
  example: string;
  sublabel?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border border-stone-200 bg-white p-5 
                 shadow-sm hover:shadow-md hover:border-sage-300 
                 transition-all duration-300 ease-out
                 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-medium text-stone-800">{title}</p>
          <p className="text-sm text-stone-500 mt-1">{example}</p>
          {sublabel && (
            <span className="inline-block mt-2 text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
              {sublabel}
            </span>
          )}
        </div>
        <svg className="w-5 h-5 text-stone-300 flex-shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

export default function WizardPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8 text-stone-400">Loading...</div>}>
      <WizardContent />
    </Suspense>
  );
}

function ExampleCard({ question, route, href }: { question: string; route: string; href: string }) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-stone-200 bg-white p-5 
                 shadow-sm hover:shadow-md hover:border-sage-300 
                 transition-all duration-300
                 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
    >
      <p className="text-base text-stone-700 italic mb-2">{question}</p>
      <p className="text-sm font-medium text-sage-600">{route}</p>
    </Link>
  );
}
