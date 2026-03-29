'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { CalculatorShell } from '@/components/CalculatorShell';
import { FieldRow, PercentInput, SegmentedControl } from '@/components/FormFields';
import { AdvancedOptions } from '@/components/AdvancedOptions';
import { AttritionToggle } from '@/components/AttritionToggle';
import { ResultSummaryCard, AssumptionsCard, MethodsCard, ChecklistCard, ShareLinkCard, HelperCallout } from '@/components/ResultCards';
import { PlotCard } from '@/components/PlotCard';
import { LiteratureHelper } from '@/components/LiteratureHelper';
import { calculateTwoProportions, twoProportionsPlotData } from '@/lib/stats/twoProportions';
import { getNumParam, getStrParam } from '@/lib/urlState';
import type { TwoProportionsResult } from '@/types';

function TwoProportionsCalc() {
  const { t, lang } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [inputMode, setInputMode] = useState<string>(() => getStrParam(searchParams, 'mode', 'direct') ?? 'direct');
  const [p1, setP1] = useState(() => getNumParam(searchParams, 'p1', 25) ?? 25);
  const [p2, setP2] = useState(() => getNumParam(searchParams, 'p2', 40) ?? 40);
  const [baseline, setBaseline] = useState(() => getNumParam(searchParams, 'base', 25) ?? 25);
  const [diff, setDiff] = useState(() => getNumParam(searchParams, 'diff', 15) ?? 15);
  const [alpha, setAlpha] = useState(() => getNumParam(searchParams, 'alpha', 0.05) ?? 0.05);
  const [power, setPower] = useState(() => getNumParam(searchParams, 'power', 0.80) ?? 0.80);
  const [attrition, setAttrition] = useState(() => getNumParam(searchParams, 'att', 0) ?? 0);
  const [result, setResult] = useState<TwoProportionsResult | null>(null);

  // Compute effective p1, p2
  const effectiveP1 = inputMode === 'direct' ? p1 : baseline;
  const effectiveP2 = inputMode === 'direct' ? p2 : baseline + diff;

  const doCalc = useCallback(() => {
    const ep1 = effectiveP1;
    const ep2 = effectiveP2;
    if (ep1 <= 0 || ep1 >= 100 || ep2 <= 0 || ep2 >= 100 || Math.abs(ep1 - ep2) < 0.1) {
      setResult(null);
      return;
    }
    try {
      const r = calculateTwoProportions({ p1: ep1, p2: ep2, alpha, power, attrition });
      setResult(r);
    } catch {
      setResult(null);
    }
  }, [effectiveP1, effectiveP2, alpha, power, attrition]);

  useEffect(() => { doCalc(); }, [doCalc]);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('mode', inputMode);
    if (inputMode === 'direct') {
      params.set('p1', String(p1));
      params.set('p2', String(p2));
    } else {
      params.set('base', String(baseline));
      params.set('diff', String(diff));
    }
    params.set('alpha', String(alpha));
    params.set('power', String(power));
    params.set('att', String(attrition));
    params.set('lang', lang);
    router.replace(`/calc/two-proportions?${params.toString()}`, { scroll: false });
  }, [inputMode, p1, p2, baseline, diff, alpha, power, attrition, lang, router]);

  const absDiff = Math.abs(effectiveP1 - effectiveP2);

  const methodsText = result
    ? t.methods.twoProportions
        .replace('{p1}', String(effectiveP1))
        .replace('{p2}', String(effectiveP2))
        .replace('{alpha}', String(alpha))
        .replace('{power}', String(power * 100))
        .replace('{n}', String(result.nPerGroup))
        .replace('{total}', String(result.nTotal))
        .replace('{att}', String(attrition))
        .replace('{nAdj}', String(result.nPerGroupAdjusted))
        .replace('{totalAdj}', String(result.nTotalAdjusted))
    : '';

  const resultExplain = result
    ? t.twoProportions.resultExplain
        .replace('{n}', String(result.nPerGroupAdjusted))
        .replace('{total}', String(result.nTotalAdjusted))
        .replace('{diff}', String(Math.round(absDiff)))
    : '';

  const plotData = twoProportionsPlotData(effectiveP1, alpha, power, attrition);

  return (
    <CalculatorShell title={t.twoProportions.title} subtitle={t.twoProportions.subtitle}>
      <div className="space-y-5 mb-8">
        {/* Input mode toggle */}
        <FieldRow label={t.twoProportions.inputMode} htmlFor="inputMode">
          <SegmentedControl
            options={[
              { value: 'direct', label: t.twoProportions.inputModeDirect },
              { value: 'diff', label: t.twoProportions.inputModeDiff },
            ]}
            value={inputMode}
            onChange={setInputMode}
          />
        </FieldRow>

        {inputMode === 'direct' ? (
          <>
            <FieldRow label={t.twoProportions.p1Label} htmlFor="p1" help={t.twoProportions.p1Help} suffix="%">
              <PercentInput id="p1" value={p1} onChange={setP1} min={1} max={99} />
            </FieldRow>
            <FieldRow label={t.twoProportions.p2Label} htmlFor="p2" help={t.twoProportions.p2Help} suffix="%">
              <PercentInput id="p2" value={p2} onChange={setP2} min={1} max={99} />
            </FieldRow>
          </>
        ) : (
          <>
            <FieldRow label={t.twoProportions.baselineLabel} htmlFor="baseline" suffix="%">
              <PercentInput id="baseline" value={baseline} onChange={setBaseline} min={1} max={98} />
            </FieldRow>
            <FieldRow label={t.twoProportions.diffLabel} htmlFor="diff" help={t.twoProportions.diffHelp} suffix="%">
              <PercentInput id="diff" value={diff} onChange={setDiff} min={1} max={50} />
            </FieldRow>
          </>
        )}

        {/* Effect size shortcuts */}
        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-sm space-y-1">
          <p className="font-medium text-stone-600">{t.twoProportions.effectHelper}</p>
          <p className="text-stone-500">{t.twoProportions.effectSmall}</p>
          <p className="text-stone-500">{t.twoProportions.effectMedium}</p>
          <p className="text-stone-500">{t.twoProportions.effectLarge}</p>
          <p className="text-stone-400 text-xs italic mt-1">{t.twoProportions.effectNote}</p>
        </div>

        <AdvancedOptions
          alpha={alpha}
          onAlphaChange={setAlpha}
          power={power}
          onPowerChange={setPower}
          attrition={0}
          onAttritionChange={() => {}}
          showAttrition={false}
        />

        <AttritionToggle
          value={attrition}
          onChange={setAttrition}
          label={t.twoProportions.attritionLabel}
        />

        <LiteratureHelper path="twoProportions" />
      </div>

      {result && (
        <div className="space-y-4 animate-fadeIn">
          <ResultSummaryCard
            title={t.twoProportions.resultTitle}
            mainValue={result.nTotalAdjusted}
            mainLabel={t.twoProportions.resultTotalAdj}
            items={[
              { label: t.twoProportions.resultPerGroup, value: result.nPerGroup },
              { label: t.twoProportions.resultTotal, value: result.nTotal },
              { label: t.twoProportions.resultPerGroupAdj, value: result.nPerGroupAdjusted },
              { label: t.twoProportions.resultTotalAdj, value: result.nTotalAdjusted },
            ]}
            explanation={resultExplain}
          />

          <AssumptionsCard
            items={[
              { label: t.twoProportions.p1Label, value: `${effectiveP1}%` },
              { label: t.twoProportions.p2Label, value: `${effectiveP2}%` },
              { label: t.twoProportions.alphaLabel, value: alpha },
              { label: t.twoProportions.powerLabel, value: `${power * 100}%` },
              ...(attrition > 0 ? [{ label: t.twoProportions.attritionLabel, value: `${attrition}%` }] : []),
            ]}
          />

          <PlotCard
            title={t.twoProportions.plotTitle}
            data={plotData}
            xLabel={t.twoProportions.plotXLabel}
            yLabel={t.twoProportions.plotYLabel}
          />

          <ShareLinkCard
            basePath="/calc/two-proportions"
            state={{
              mode: inputMode,
              ...(inputMode === 'direct' ? { p1, p2 } : { base: baseline, diff }),
              alpha, power, att: attrition,
            }}
          />

          <MethodsCard text={methodsText} />
          <ChecklistCard />
        </div>
      )}
    </CalculatorShell>
  );
}

export default function TwoProportionsPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8 text-stone-400">Loading...</div>}>
      <TwoProportionsCalc />
    </Suspense>
  );
}
