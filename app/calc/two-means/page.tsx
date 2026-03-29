'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { CalculatorShell } from '@/components/CalculatorShell';
import { FieldRow, NumberInput, SegmentedControl } from '@/components/FormFields';
import { AdvancedOptions } from '@/components/AdvancedOptions';
import { AttritionToggle } from '@/components/AttritionToggle';
import { ResultSummaryCard, AssumptionsCard, MethodsCard, ChecklistCard, ShareLinkCard, HelperCallout } from '@/components/ResultCards';
import { PlotCard } from '@/components/PlotCard';
import { LiteratureHelper } from '@/components/LiteratureHelper';
import { calculateTwoMeans, pooledSD, twoMeansPlotData } from '@/lib/stats/twoMeans';
import { getNumParam, getStrParam } from '@/lib/urlState';
import type { TwoMeansResult } from '@/types';

function TwoMeansCalc() {
  const { t, lang } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [delta, setDelta] = useState(() => getNumParam(searchParams, 'delta', 5) ?? 5);
  const [sdMode, setSdMode] = useState<string>(() => getStrParam(searchParams, 'sdmode', 'common') ?? 'common');
  const [sigma, setSigma] = useState(() => getNumParam(searchParams, 'sigma', 10) ?? 10);
  const [sd1, setSd1] = useState(() => getNumParam(searchParams, 'sd1', 10) ?? 10);
  const [sd2, setSd2] = useState(() => getNumParam(searchParams, 'sd2', 10) ?? 10);
  const [alpha, setAlpha] = useState(() => getNumParam(searchParams, 'alpha', 0.05) ?? 0.05);
  const [power, setPower] = useState(() => getNumParam(searchParams, 'power', 0.80) ?? 0.80);
  const [attrition, setAttrition] = useState(() => getNumParam(searchParams, 'att', 0) ?? 0);
  const [result, setResult] = useState<TwoMeansResult | null>(null);

  const effectiveSigma = sdMode === 'common' ? sigma : pooledSD(sd1, sd2);

  const doCalc = useCallback(() => {
    if (delta <= 0 || effectiveSigma <= 0) {
      setResult(null);
      return;
    }
    try {
      const r = calculateTwoMeans({ delta, sigma: effectiveSigma, alpha, power, attrition });
      setResult(r);
    } catch {
      setResult(null);
    }
  }, [delta, effectiveSigma, alpha, power, attrition]);

  useEffect(() => { doCalc(); }, [doCalc]);

  // URL state
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('delta', String(delta));
    params.set('sdmode', sdMode);
    if (sdMode === 'common') {
      params.set('sigma', String(sigma));
    } else {
      params.set('sd1', String(sd1));
      params.set('sd2', String(sd2));
    }
    params.set('alpha', String(alpha));
    params.set('power', String(power));
    params.set('att', String(attrition));
    params.set('lang', lang);
    router.replace(`/calc/two-means?${params.toString()}`, { scroll: false });
  }, [delta, sdMode, sigma, sd1, sd2, alpha, power, attrition, lang, router]);

  const methodsText = result
    ? t.methods.twoMeans
        .replace('{delta}', String(delta))
        .replace('{sigma}', String(Math.round(effectiveSigma * 100) / 100))
        .replace('{alpha}', String(alpha))
        .replace('{power}', String(power * 100))
        .replace('{n}', String(result.nPerGroup))
        .replace('{total}', String(result.nTotal))
        .replace('{att}', String(attrition))
        .replace('{nAdj}', String(result.nPerGroupAdjusted))
        .replace('{totalAdj}', String(result.nTotalAdjusted))
    : '';

  const resultExplain = result
    ? t.twoMeans.resultExplain
        .replace('{n}', String(result.nPerGroupAdjusted))
        .replace('{total}', String(result.nTotalAdjusted))
        .replace('{delta}', String(delta))
        .replace('{sigma}', String(Math.round(effectiveSigma * 100) / 100))
    : '';

  const plotData = twoMeansPlotData(effectiveSigma, alpha, power, attrition);

  // Cohen's d helper
  const applyCohen = (d: number) => {
    setDelta(Math.round(d * effectiveSigma * 100) / 100);
  };

  return (
    <CalculatorShell title={t.twoMeans.title} subtitle={t.twoMeans.subtitle}>
      <div className="space-y-5 mb-8">
        <FieldRow label={t.twoMeans.deltaLabel} htmlFor="delta" help={t.twoMeans.deltaHelp}>
          <NumberInput id="delta" value={delta} onChange={setDelta} min={0.01} step="any" />
        </FieldRow>

        {/* SD mode */}
        <FieldRow label={t.twoMeans.sdMode} htmlFor="sdMode">
          <SegmentedControl
            options={[
              { value: 'common', label: t.twoMeans.sdModeCommon },
              { value: 'separate', label: t.twoMeans.sdModeSeparate },
            ]}
            value={sdMode}
            onChange={setSdMode}
          />
        </FieldRow>

        {sdMode === 'common' ? (
          <FieldRow label={t.twoMeans.sigmaLabel} htmlFor="sigma" help={t.twoMeans.sigmaHelp}>
            <NumberInput id="sigma" value={sigma} onChange={setSigma} min={0.01} step="any" />
          </FieldRow>
        ) : (
          <>
            <FieldRow label={t.twoMeans.sd1Label} htmlFor="sd1">
              <NumberInput id="sd1" value={sd1} onChange={setSd1} min={0.01} step="any" />
            </FieldRow>
            <FieldRow label={t.twoMeans.sd2Label} htmlFor="sd2">
              <NumberInput id="sd2" value={sd2} onChange={setSd2} min={0.01} step="any" />
            </FieldRow>
            <HelperCallout
              text={`${t.twoMeans.pooledSD}: ${(Math.round(effectiveSigma * 100) / 100)}`}
              variant="info"
            />
          </>
        )}

        {/* Cohen's d shortcuts */}
        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-sm space-y-1.5">
          <p className="font-medium text-stone-600">{t.twoMeans.cohenHelper}</p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => applyCohen(0.2)}
              className="px-2.5 py-1 text-xs rounded border border-stone-300 hover:bg-sage-50 
                         hover:border-sage-300 transition-colors"
            >
              {t.twoMeans.cohenSmall}
            </button>
            <button
              onClick={() => applyCohen(0.5)}
              className="px-2.5 py-1 text-xs rounded border border-stone-300 hover:bg-sage-50 
                         hover:border-sage-300 transition-colors"
            >
              {t.twoMeans.cohenMedium}
            </button>
            <button
              onClick={() => applyCohen(0.8)}
              className="px-2.5 py-1 text-xs rounded border border-stone-300 hover:bg-sage-50 
                         hover:border-sage-300 transition-colors"
            >
              {t.twoMeans.cohenLarge}
            </button>
          </div>
          <p className="text-stone-400 text-xs italic">{t.twoMeans.cohenNote}</p>
          <p className="text-stone-400 text-xs">{t.twoMeans.cohenApply}</p>
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
          label={t.twoMeans.attritionLabel}
        />

        <LiteratureHelper path="twoMeans" />
      </div>

      {result && (
        <div className="space-y-4 animate-fadeIn">
          <ResultSummaryCard
            title={t.twoMeans.resultTitle}
            mainValue={result.nTotalAdjusted}
            mainLabel={t.twoMeans.resultTotalAdj}
            items={[
              { label: t.twoMeans.resultPerGroup, value: result.nPerGroup },
              { label: t.twoMeans.resultTotal, value: result.nTotal },
              { label: t.twoMeans.resultPerGroupAdj, value: result.nPerGroupAdjusted },
              { label: t.twoMeans.resultTotalAdj, value: result.nTotalAdjusted },
            ]}
            explanation={resultExplain}
          />

          <AssumptionsCard
            items={[
              { label: t.twoMeans.deltaLabel, value: delta },
              { label: t.twoMeans.sigmaLabel, value: Math.round(effectiveSigma * 100) / 100 },
              { label: t.twoMeans.alphaLabel, value: alpha },
              { label: t.twoMeans.powerLabel, value: `${power * 100}%` },
              ...(attrition > 0 ? [{ label: t.twoMeans.attritionLabel, value: `${attrition}%` }] : []),
            ]}
          />

          <PlotCard
            title={t.twoMeans.plotTitle}
            data={plotData}
            xLabel={t.twoMeans.plotXLabel}
            yLabel={t.twoMeans.plotYLabel}
          />

          <ShareLinkCard
            basePath="/calc/two-means"
            state={{
              delta,
              sdmode: sdMode,
              ...(sdMode === 'common' ? { sigma } : { sd1, sd2 }),
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

export default function TwoMeansPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8 text-stone-400">Loading...</div>}>
      <TwoMeansCalc />
    </Suspense>
  );
}
