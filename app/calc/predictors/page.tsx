'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { CalculatorShell } from '@/components/CalculatorShell';
import { FieldRow, NumberInput, PercentInput, SegmentedControl } from '@/components/FormFields';
import { WarningNote } from '@/components/ResultCards';
import { LiteratureHelper } from '@/components/LiteratureHelper';
import { calculatePredictorsBinary, calculatePredictorsContinuous } from '@/lib/stats/predictors';
import { getNumParam, getStrParam } from '@/lib/urlState';
import type { PredictorsBinaryResult, PredictorsContinuousResult } from '@/types';

function PredictorsCalc() {
  const { t, lang } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [outcomeType, setOutcomeType] = useState<string>(() =>
    getStrParam(searchParams, 'type', 'binary') ?? 'binary'
  );
  const [eventRate, setEventRate] = useState(() => getNumParam(searchParams, 'rate', 20) ?? 20);
  const [predictors, setPredictors] = useState(() => getNumParam(searchParams, 'k', 5) ?? 5);
  const [epv, setEpv] = useState(() => getNumParam(searchParams, 'epv', 15) ?? 15);
  const [binaryResult, setBinaryResult] = useState<PredictorsBinaryResult | null>(null);
  const [contResult, setContResult] = useState<PredictorsContinuousResult | null>(null);

  const doCalc = useCallback(() => {
    if (outcomeType === 'binary') {
      if (eventRate <= 0 || eventRate >= 100 || predictors <= 0) {
        setBinaryResult(null);
        return;
      }
      const r = calculatePredictorsBinary({ eventRate, predictors, epv });
      setBinaryResult(r);
    } else {
      if (predictors <= 0) {
        setContResult(null);
        return;
      }
      const r = calculatePredictorsContinuous({ predictors });
      setContResult(r);
    }
  }, [outcomeType, eventRate, predictors, epv]);

  useEffect(() => { doCalc(); }, [doCalc]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('type', outcomeType);
    if (outcomeType === 'binary') {
      params.set('rate', String(eventRate));
      params.set('epv', String(epv));
    }
    params.set('k', String(predictors));
    params.set('lang', lang);
    router.replace(`/calc/predictors?${params.toString()}`, { scroll: false });
  }, [outcomeType, eventRate, predictors, epv, lang, router]);

  return (
    <CalculatorShell title={t.predictors.title} subtitle={t.predictors.subtitle}>
      {/* Beta warning */}
      <WarningNote text={t.predictors.betaNote} />

      <div className="mt-6 space-y-5 mb-8">
        <FieldRow label={t.predictors.outcomeType} htmlFor="outcomeType">
          <SegmentedControl
            options={[
              { value: 'binary', label: t.predictors.outcomeBinary, sublabel: t.predictors.outcomeBinaryEx },
              { value: 'continuous', label: t.predictors.outcomeContinuous, sublabel: t.predictors.outcomeContinuousEx },
            ]}
            value={outcomeType}
            onChange={setOutcomeType}
          />
        </FieldRow>

        {outcomeType === 'binary' && (
          <FieldRow label={t.predictors.eventRateLabel} htmlFor="eventRate" help={t.predictors.eventRateHelp} suffix="%">
            <PercentInput id="eventRate" value={eventRate} onChange={setEventRate} min={1} max={99} />
          </FieldRow>
        )}

        <FieldRow label={t.predictors.predictorsLabel} htmlFor="predictors" help={t.predictors.predictorsHelp}>
          <NumberInput id="predictors" value={predictors} onChange={setPredictors} min={1} max={50} step={1} />
        </FieldRow>

        {outcomeType === 'binary' && (
          <FieldRow label={t.predictors.epvLabel} htmlFor="epv" help={t.predictors.epvHelp}>
            <NumberInput id="epv" value={epv} onChange={setEpv} min={5} max={30} step={1} />
          </FieldRow>
        )}

        <LiteratureHelper path="predictors" />
      </div>

      {/* Binary result */}
      {outcomeType === 'binary' && binaryResult && (
        <div className="space-y-4 animate-fadeIn">
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">{t.predictors.resultTitle}</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm p-2 rounded bg-white border border-stone-200">
                <span className="text-stone-600">{t.predictors.resultEventsNeeded}</span>
                <span className="font-semibold text-stone-800">{binaryResult.eventsNeeded}</span>
              </div>
              <div className="flex justify-between text-sm p-2 rounded bg-white border border-stone-200">
                <span className="text-stone-600">{t.predictors.resultLow}</span>
                <span className="font-semibold text-stone-800">{binaryResult.nLow}</span>
              </div>
              <div className="flex justify-between text-sm p-2 rounded bg-sage-50 border border-sage-200">
                <span className="text-sage-800 font-medium">{t.predictors.resultPreferred}</span>
                <span className="font-bold text-sage-800">{binaryResult.nPreferred}</span>
              </div>
              <div className="flex justify-between text-sm p-2 rounded bg-white border border-stone-200">
                <span className="text-stone-600">{t.predictors.resultHigh}</span>
                <span className="font-semibold text-stone-800">{binaryResult.nHigh}</span>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">
              {t.predictors.resultExplain
                .replace('{rate}', String(eventRate))
                .replace('{k}', String(predictors))
                .replace('{events}', String(binaryResult.eventsNeeded))
                .replace('{n}', String(binaryResult.nPreferred))}
            </p>
          </div>

          <WarningNote text={t.predictors.approxWarning} />
        </div>
      )}

      {/* Continuous result */}
      {outcomeType === 'continuous' && contResult && (
        <div className="space-y-4 animate-fadeIn">
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">{t.predictors.resultContinuousTitle}</h2>

            <div className="text-center mb-4">
              <div className="text-4xl sm:text-5xl font-bold text-sage-700">{contResult.nRecommended}</div>
              <div className="text-sm text-stone-500 mt-1">{t.predictors.resultRecommended}</div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm p-2 rounded bg-white border border-stone-200">
                <span className="text-stone-600">{t.predictors.resultModelRule}</span>
                <span className="font-semibold text-stone-800">{contResult.nModel}</span>
              </div>
              <div className="flex justify-between text-sm p-2 rounded bg-white border border-stone-200">
                <span className="text-stone-600">{t.predictors.resultPredRule}</span>
                <span className="font-semibold text-stone-800">{contResult.nPredictor}</span>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">
              {t.predictors.resultContinuousExplain
                .replace('{k}', String(predictors))
                .replace('{n}', String(contResult.nRecommended))}
            </p>
          </div>

          <WarningNote text={t.predictors.approxWarning} />
        </div>
      )}
    </CalculatorShell>
  );
}

export default function PredictorsPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8 text-stone-400">Loading...</div>}>
      <PredictorsCalc />
    </Suspense>
  );
}
