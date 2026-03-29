'use client';

import { useState, ReactNode } from 'react';
import { useTranslation } from '@/lib/i18n';
import { FieldRow, NumberInput, PercentInput, SelectInput } from './FormFields';

interface AdvancedOptionsProps {
  alpha: number;
  onAlphaChange: (v: number) => void;
  power: number;
  onPowerChange: (v: number) => void;
  attrition: number;
  onAttritionChange: (v: number) => void;
  showAlpha?: boolean;
  showPower?: boolean;
  showAttrition?: boolean;
  children?: ReactNode;
}

export function AdvancedOptions({
  alpha,
  onAlphaChange,
  power,
  onPowerChange,
  attrition,
  onAttritionChange,
  showAlpha = true,
  showPower = true,
  showAttrition = true,
  children,
}: AdvancedOptionsProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-sage-700 
                   transition-colors duration-200 focus:outline-none focus:ring-2 
                   focus:ring-sage-500 rounded-lg px-2 py-1 -ml-2"
        aria-expanded={isOpen}
      >
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {isOpen ? t.hideAdvanced : t.showAdvanced}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-4 p-4 rounded-lg bg-stone-50 border border-stone-200 animate-in fade-in duration-200">
          {showAlpha && (
            <FieldRow label={t.twoProportions.alphaLabel} htmlFor="alpha">
              <SelectInput
                id="alpha"
                value={alpha}
                onChange={(v) => onAlphaChange(parseFloat(v))}
                options={[
                  { value: 0.01, label: '0.01' },
                  { value: 0.05, label: '0.05' },
                  { value: 0.10, label: '0.10' },
                ]}
              />
            </FieldRow>
          )}
          {showPower && (
            <FieldRow label={t.twoProportions.powerLabel} htmlFor="power">
              <SelectInput
                id="power"
                value={power}
                onChange={(v) => onPowerChange(parseFloat(v))}
                options={[
                  { value: 0.70, label: '70%' },
                  { value: 0.80, label: '80%' },
                  { value: 0.85, label: '85%' },
                  { value: 0.90, label: '90%' },
                  { value: 0.95, label: '95%' },
                ]}
              />
            </FieldRow>
          )}
          {showAttrition && (
            <FieldRow
              label={t.twoProportions.attritionLabel}
              htmlFor="attrition"
              help=""
            >
              <PercentInput
                id="attrition"
                value={attrition}
                onChange={onAttritionChange}
                min={0}
                max={50}
              />
            </FieldRow>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
