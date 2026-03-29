'use client';

import { useTranslation } from '@/lib/i18n';
import { FieldRow, PercentInput } from './FormFields';

interface AttritionToggleProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  help?: string;
}

export function AttritionToggle({ value, onChange, label, help }: AttritionToggleProps) {
  const { t } = useTranslation();
  const isActive = value > 0 || false;
  const displayLabel = label || t.prevalence.nonresponseLabel;
  const displayHelp = help || t.prevalence.nonresponseHelp;

  if (!isActive) {
    return (
      <button
        type="button"
        onClick={() => onChange(10)}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-sage-700 
                   transition-colors duration-200 focus:outline-none focus:ring-2 
                   focus:ring-sage-500 rounded-lg px-2 py-1.5 -ml-2
                   border border-dashed border-stone-300 hover:border-sage-400"
      >
        <i className="fa fa-plus" />
        {displayLabel}
      </button>
    );
  }

  return (
    <div className="relative">
      <FieldRow label={displayLabel} htmlFor="attrition" help={displayHelp} suffix="%">
        <div className="flex gap-2">
          <div className="flex-1">
            <PercentInput
              id="attrition"
              value={value}
              onChange={onChange}
              min={0}
              max={50}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(0)}
            className="px-2 py-2 text-stone-400 hover:text-red-500 transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-sage-500 rounded-lg"
            aria-label="Remove attrition adjustment"
          >
            <i className="fa fa-times" />
          </button>
        </div>
      </FieldRow>
    </div>
  );
}
