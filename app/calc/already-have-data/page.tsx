'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { CalculatorShell } from '@/components/CalculatorShell';
import { FieldRow, NumberInput, PercentInput, SelectInput, SegmentedControl } from '@/components/FormFields';
import { ResultSummaryCard, HelperCallout, WarningNote } from '@/components/ResultCards';
import { PlotCard } from '@/components/PlotCard';
import { ahdPrevalence, ahdTwoMeans, ahdTwoProportions, additionalSampleNeeded, ahdPrevalencePlotData } from '@/lib/stats/alreadyHaveData';
import { getNumParam, getStrParam } from '@/lib/urlState';

type AHDMode = 'select' | 'precision' | 'detect' | 'additional';

function AlreadyHaveDataCalc() {
  const { t, lang } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mode, setMode] = useState<AHDMode>(() => {
    const m = getStrParam(searchParams, 'mode');
    return (m as AHDMode) || 'select';
  });

  // Precision inputs
  const [precN, setPrecN] = useState(() => getNumParam(searchParams, 'n', 100) ?? 100);
  const [precPrev, setPrecPrev] = useState(() => getNumParam(searchParams, 'p', 30) ?? 30);
  const [precCl, setPrecCl] = useState(() => getNumParam(searchParams, 'cl', 95) ?? 95);

  // Detect inputs
  const [detectType, setDetectType] = useState<string>(() => getStrParam(searchParams, 'dtype', 'means') ?? 'means');
  const [detectN, setDetectN] = useState(() => getNumParam(searchParams, 'dn', 50) ?? 50);
  const [detectSigma, setDetectSigma] = useState(() => getNumParam(searchParams, 'dsigma', 10) ?? 10);
  const [detectBaseline, setDetectBaseline] = useState(() => getNumParam(searchParams, 'dbase', 30) ?? 30);
  const [detectAlpha, setDetectAlpha] = useState(() => getNumParam(searchParams, 'dalpha', 0.05) ?? 0.05);
  const [detectPower, setDetectPower] = useState(() => getNumParam(searchParams, 'dpower', 0.80) ?? 0.80);

  // Additional inputs
  const [addCurrent, setAddCurrent] = useState(() => getNumParam(searchParams, 'acur', 80) ?? 80);
  const [addTarget, setAddTarget] = useState(() => getNumParam(searchParams, 'atgt', 200) ?? 200);

  // Results
  const [precResult, setPrecResult] = useState<{ halfWidth: number } | null>(null);
  const [detectMeansResult, setDetectMeansResult] = useState<{ detectableDelta: number } | null>(null);
  const [detectPropResult, setDetectPropResult] = useState<{ detectableDifference: number } | null>(null);

  // Calculations
  const calcPrecision = useCallback(() => {
    if (precN <= 0 || precPrev <= 0 || precPrev >= 100) { setPrecResult(null); return; }
    const r = ahdPrevalence({ currentN: precN, prevalence: precPrev, confidenceLevel: precCl });
    setPrecResult(r);
  }, [precN, precPrev, precCl]);

  const calcDetect = useCallback(() => {
    if (detectN <= 0) { setDetectMeansResult(null); setDetectPropResult(null); return; }
    if (detectType === 'means') {
      if (detectSigma <= 0) { setDetectMeansResult(null); return; }
      const r = ahdTwoMeans({ currentNPerGroup: detectN, sigma: detectSigma, alpha: detectAlpha, power: detectPower });
      setDetectMeansResult(r);
    } else {
      if (detectBaseline <= 0 || detectBaseline >= 100) { setDetectPropResult(null); return; }
      const r = ahdTwoProportions({ currentNPerGroup: detectN, baselineProportion: detectBaseline, alpha: detectAlpha, power: detectPower });
      setDetectPropResult(r);
    }
  }, [detectN, detectType, detectSigma, detectBaseline, detectAlpha, detectPower]);

  useEffect(() => {
    if (mode === 'precision') calcPrecision();
    if (mode === 'detect') calcDetect();
  }, [mode, calcPrecision, calcDetect]);

  // URL state
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('mode', mode);
    params.set('lang', lang);
    if (mode === 'precision') {
      params.set('n', String(precN));
      params.set('p', String(precPrev));
      params.set('cl', String(precCl));
    } else if (mode === 'detect') {
      params.set('dtype', detectType);
      params.set('dn', String(detectN));
      if (detectType === 'means') params.set('dsigma', String(detectSigma));
      else params.set('dbase', String(detectBaseline));
      params.set('dalpha', String(detectAlpha));
      params.set('dpower', String(detectPower));
    } else if (mode === 'additional') {
      params.set('acur', String(addCurrent));
      params.set('atgt', String(addTarget));
    }
    router.replace(`/calc/already-have-data?${params.toString()}`, { scroll: false });
  }, [mode, precN, precPrev, precCl, detectType, detectN, detectSigma, detectBaseline, detectAlpha, detectPower, addCurrent, addTarget, lang, router]);

  const addNeeded = additionalSampleNeeded(addCurrent, addTarget);

  return (
    <CalculatorShell title={t.alreadyHaveData.title} subtitle={t.alreadyHaveData.subtitle}>
      <HelperCallout text={t.alreadyHaveData.leadText} variant="tip" />

      {/* Mode selection */}
      {mode === 'select' && (
        <div className="mt-6 space-y-3 animate-fadeIn">
          <ModeCard title={t.alreadyHaveData.opt1} example={t.alreadyHaveData.opt1Ex} onClick={() => setMode('precision')} />
          <ModeCard title={t.alreadyHaveData.opt2} example={t.alreadyHaveData.opt2Ex} onClick={() => setMode('detect')} />
          <ModeCard title={t.alreadyHaveData.opt3} example={t.alreadyHaveData.opt3Ex} onClick={() => setMode('additional')} />
        </div>
      )}

      {/* Precision mode */}
      {mode === 'precision' && (
        <div className="mt-6 animate-fadeIn">
          <BackButton onClick={() => setMode('select')} label={t.backToCalc} />
          <h2 className="text-xl font-semibold text-stone-800 mb-4">{t.alreadyHaveData.precisionTitle}</h2>
          <div className="space-y-5 mb-6">
            <FieldRow label={t.alreadyHaveData.currentNLabel} htmlFor="precN">
              <NumberInput id="precN" value={precN} onChange={setPrecN} min={1} step={1} />
            </FieldRow>
            <FieldRow label={t.alreadyHaveData.prevalenceLabel} htmlFor="precPrev" suffix="%">
              <PercentInput id="precPrev" value={precPrev} onChange={setPrecPrev} min={1} max={99} />
            </FieldRow>
            <FieldRow label={t.alreadyHaveData.confidenceLabel} htmlFor="precCl">
              <SelectInput
                id="precCl"
                value={precCl}
                onChange={(v) => setPrecCl(parseInt(v))}
                options={[
                  { value: 90, label: '90%' },
                  { value: 95, label: '95%' },
                  { value: 99, label: '99%' },
                ]}
              />
            </FieldRow>
          </div>

          {precResult && (
            <div className="space-y-4">
              <ResultSummaryCard
                title={t.alreadyHaveData.precisionResult}
                mainValue={precResult.halfWidth}
                mainLabel={t.alreadyHaveData.precisionMargin}
                items={[]}
                explanation={t.alreadyHaveData.precisionExplain
                  .replace('{n}', String(precN))
                  .replace('{p}', String(precPrev))
                  .replace('{hw}', String(precResult.halfWidth))}
              />
              <PlotCard
                title={t.alreadyHaveData.precisionPlotTitle}
                data={ahdPrevalencePlotData(precPrev, precCl, precN)}
                xLabel={t.prevalence.plotXLabel}
                yLabel={t.prevalence.plotYLabel}
                highlightX={precN}
              />
            </div>
          )}

          {/* Post-hoc power note */}
          <details className="mt-6">
            <summary className="text-sm text-stone-400 cursor-pointer hover:text-stone-600 transition-colors">
              {t.alreadyHaveData.postHocTitle}
            </summary>
            <p className="mt-2 text-sm text-stone-500 p-3 rounded-lg bg-stone-50 border border-stone-200">
              {t.alreadyHaveData.postHocWarning}
            </p>
          </details>
        </div>
      )}

      {/* Detect mode */}
      {mode === 'detect' && (
        <div className="mt-6 animate-fadeIn">
          <BackButton onClick={() => setMode('select')} label={t.backToCalc} />
          <h2 className="text-xl font-semibold text-stone-800 mb-4">{t.alreadyHaveData.detectTitle}</h2>
          <div className="space-y-5 mb-6">
            <FieldRow label={t.alreadyHaveData.detectType} htmlFor="detectType">
              <SegmentedControl
                options={[
                  { value: 'means', label: t.alreadyHaveData.detectMeans },
                  { value: 'proportions', label: t.alreadyHaveData.detectProportions },
                ]}
                value={detectType}
                onChange={setDetectType}
              />
            </FieldRow>

            <FieldRow label={t.alreadyHaveData.currentNPerGroupLabel} htmlFor="detectN">
              <NumberInput id="detectN" value={detectN} onChange={setDetectN} min={2} step={1} />
            </FieldRow>

            {detectType === 'means' ? (
              <FieldRow label={t.alreadyHaveData.sigmaLabel} htmlFor="detectSigma">
                <NumberInput id="detectSigma" value={detectSigma} onChange={setDetectSigma} min={0.01} step="any" />
              </FieldRow>
            ) : (
              <FieldRow label={t.alreadyHaveData.baselineLabel} htmlFor="detectBaseline" suffix="%">
                <PercentInput id="detectBaseline" value={detectBaseline} onChange={setDetectBaseline} min={1} max={99} />
              </FieldRow>
            )}

            <FieldRow label={t.alreadyHaveData.alphaLabel} htmlFor="detectAlpha">
              <SelectInput
                id="detectAlpha"
                value={detectAlpha}
                onChange={(v) => setDetectAlpha(parseFloat(v))}
                options={[
                  { value: 0.01, label: '0.01' },
                  { value: 0.05, label: '0.05' },
                  { value: 0.10, label: '0.10' },
                ]}
              />
            </FieldRow>

            <FieldRow label={t.alreadyHaveData.powerLabel} htmlFor="detectPower">
              <SelectInput
                id="detectPower"
                value={detectPower}
                onChange={(v) => setDetectPower(parseFloat(v))}
                options={[
                  { value: 0.70, label: '70%' },
                  { value: 0.80, label: '80%' },
                  { value: 0.90, label: '90%' },
                ]}
              />
            </FieldRow>
          </div>

          {detectType === 'means' && detectMeansResult && (
            <ResultSummaryCard
              title={t.alreadyHaveData.detectMeansResult}
              mainValue={detectMeansResult.detectableDelta}
              mainLabel={t.alreadyHaveData.detectMeansResult}
              items={[]}
              explanation={t.alreadyHaveData.detectMeansExplain
                .replace('{n}', String(detectN))
                .replace('{sigma}', String(detectSigma))
                .replace('{delta}', String(detectMeansResult.detectableDelta))}
            />
          )}

          {detectType === 'proportions' && detectPropResult && (
            <ResultSummaryCard
              title={t.alreadyHaveData.detectPropResult}
              mainValue={detectPropResult.detectableDifference}
              mainLabel={`${detectPropResult.detectableDifference}%`}
              items={[]}
              explanation={t.alreadyHaveData.detectPropExplain
                .replace('{n}', String(detectN))
                .replace('{p}', String(detectBaseline))
                .replace('{diff}', String(detectPropResult.detectableDifference))}
            />
          )}
        </div>
      )}

      {/* Additional mode */}
      {mode === 'additional' && (
        <div className="mt-6 animate-fadeIn">
          <BackButton onClick={() => setMode('select')} label={t.backToCalc} />
          <h2 className="text-xl font-semibold text-stone-800 mb-4">{t.alreadyHaveData.additionalTitle}</h2>
          <div className="space-y-5 mb-6">
            <FieldRow label={t.alreadyHaveData.targetNLabel} htmlFor="addTarget">
              <NumberInput id="addTarget" value={addTarget} onChange={setAddTarget} min={1} step={1} />
            </FieldRow>
            <FieldRow label={t.alreadyHaveData.currentNTotalLabel} htmlFor="addCurrent">
              <NumberInput id="addCurrent" value={addCurrent} onChange={setAddCurrent} min={0} step={1} />
            </FieldRow>
          </div>

          <div className="rounded-xl border border-sage-200 bg-sage-50/50 p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-stone-800 mb-2">{t.alreadyHaveData.additionalResult}</h3>
            {addNeeded > 0 ? (
              <>
                <div className="text-4xl font-bold text-sage-700 mb-2">{addNeeded}</div>
                <p className="text-sm text-stone-600">
                  {t.alreadyHaveData.additionalExplain.replace('{n}', String(addNeeded))}
                </p>
              </>
            ) : (
              <p className="text-sm text-stone-600">
                {t.alreadyHaveData.additionalNone}
              </p>
            )}
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}

function ModeCard({ title, example, onClick }: { title: string; example: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border border-stone-200 bg-white p-5 
                 shadow-sm hover:shadow-md hover:border-sage-300 transition-all duration-300
                 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
    >
      <p className="text-base font-medium text-stone-800">{title}</p>
      <p className="text-sm text-stone-500 mt-1">{example}</p>
    </button>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-sage-700 
                 transition-colors duration-200 mb-4"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}

export default function AlreadyHaveDataPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8 text-stone-400">Loading...</div>}>
      <AlreadyHaveDataCalc />
    </Suspense>
  );
}
