'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { CalculatorShell } from '@/components/CalculatorShell';
import { FieldRow, PercentInput, SelectInput } from '@/components/FormFields';
import { AttritionToggle } from '@/components/AttritionToggle';
import { ResultSummaryCard, AssumptionsCard, MethodsCard, ChecklistCard, ShareLinkCard, HelperCallout } from '@/components/ResultCards';
import { PlotCard } from '@/components/PlotCard';
import { LiteratureHelper } from '@/components/LiteratureHelper';
import { calculatePrevalence, prevalencePlotData } from '@/lib/stats/prevalence';
import { getNumParam } from '@/lib/urlState';
import type { PrevalenceResult } from '@/types';

function PrevalenceCalc() {
  const { t, lang } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Inputs with URL state restoration
  const [prevalence, setPrevalence] = useState(() => getNumParam(searchParams, 'p', 50) ?? 50);
  const [marginOfError, setMarginOfError] = useState(() => getNumParam(searchParams, 'd', 5) ?? 5);
  const [confidenceLevel, setConfidenceLevel] = useState(() => getNumParam(searchParams, 'cl', 95) ?? 95);
  const [nonresponse, setNonresponse] = useState(() => getNumParam(searchParams, 'nr', 0) ?? 0);
  const [result, setResult] = useState<PrevalenceResult | null>(null);

  // Calculate on input change
  const doCalc = useCallback(() => {
    if (prevalence <= 0 || prevalence >= 100 || marginOfError <= 0 || marginOfError > 50) {
      setResult(null);
      return;
    }
    try {
      const r = calculatePrevalence({ prevalence, marginOfError, confidenceLevel, nonresponse });
      setResult(r);
    } catch {
      setResult(null);
    }
  }, [prevalence, marginOfError, confidenceLevel, nonresponse]);

  useEffect(() => { doCalc(); }, [doCalc]);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('p', String(prevalence));
    params.set('d', String(marginOfError));
    params.set('cl', String(confidenceLevel));
    params.set('nr', String(nonresponse));
    params.set('lang', lang);
    router.replace(`/calc/prevalence?${params.toString()}`, { scroll: false });
  }, [prevalence, marginOfError, confidenceLevel, nonresponse, lang, router]);

  // Methods paragraph
  const methodsText = result
    ? t.methods.prevalence
        .replace('{p}', String(prevalence))
        .replace('{d}', String(marginOfError))
        .replace('{cl}', String(confidenceLevel))
        .replace('{n0}', String(result.n0))
        .replace('{nr}', String(nonresponse))
        .replace('{n}', String(result.nAdjusted))
    : '';

  // Plot data
  const plotData = prevalencePlotData(prevalence, confidenceLevel);

  const resultExplain = result
    ? t.prevalence.resultExplain
        .replace('{n}', String(result.nAdjusted))
        .replace('{margin}', String(marginOfError))
    : '';

  return (
    <CalculatorShell title={t.prevalence.title} subtitle={t.prevalence.subtitle}>
      {/* Input form */}
      <div className="space-y-5 mb-8">
        <FieldRow
          label={t.prevalence.prevalenceLabel}
          htmlFor="prevalence"
          help={t.prevalence.prevalenceHelp}
          suffix="%"
        >
          <PercentInput
            id="prevalence"
            value={prevalence}
            onChange={setPrevalence}
            min={1}
            max={99}
          />
        </FieldRow>

        <HelperCallout text={t.prevalence.prevalenceUnknown} variant="tip" />

        <FieldRow
          label={t.prevalence.marginLabel}
          htmlFor="margin"
          help={t.prevalence.marginHelp}
          suffix="%"
        >
          <PercentInput
            id="margin"
            value={marginOfError}
            onChange={setMarginOfError}
            min={0.5}
            max={25}
            step={0.5}
          />
        </FieldRow>

        <FieldRow label={t.prevalence.confidenceLabel} htmlFor="confidence">
          <SelectInput
            id="confidence"
            value={confidenceLevel}
            onChange={(v) => setConfidenceLevel(parseInt(v))}
            options={[
              { value: 90, label: '90%' },
              { value: 95, label: '95%' },
              { value: 99, label: '99%' },
            ]}
          />
        </FieldRow>

        <AttritionToggle
          value={nonresponse}
          onChange={setNonresponse}
        />

        <LiteratureHelper path="prevalence" />
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fadeIn">
          <ResultSummaryCard
            title={t.prevalence.resultTitle}
            mainValue={result.nAdjusted}
            mainLabel={t.prevalence.resultNAdj}
            items={[
              { label: t.prevalence.resultN0, value: result.n0 },
            ]}
            explanation={resultExplain}
          />

          <AssumptionsCard
            items={[
              { label: t.prevalence.prevalenceLabel, value: `${prevalence}%` },
              { label: t.prevalence.marginLabel, value: `±${marginOfError}%` },
              { label: t.prevalence.confidenceLabel, value: `${confidenceLevel}%` },
              ...(nonresponse > 0 ? [{ label: t.prevalence.nonresponseLabel, value: `${nonresponse}%` }] : []),
            ]}
          />

          <PlotCard
            title={t.prevalence.plotTitle}
            data={plotData}
            xLabel={t.prevalence.plotXLabel}
            yLabel={t.prevalence.plotYLabel}
            highlightX={result.nAdjusted}
          />

          <ShareLinkCard
            basePath="/calc/prevalence"
            state={{ p: prevalence, d: marginOfError, cl: confidenceLevel, nr: nonresponse }}
          />

          <MethodsCard text={methodsText} />
          <ChecklistCard />
        </div>
      )}
    </CalculatorShell>
  );
}

export default function PrevalencePage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8 text-stone-400">Loading...</div>}>
      <PrevalenceCalc />
    </Suspense>
  );
}
