'use client';

import { ReactNode } from 'react';

interface FieldRowProps {
  label: string;
  htmlFor: string;
  help?: string;
  error?: string | null;
  children: ReactNode;
  suffix?: string;
}

export function FieldRow({ label, htmlFor, help, error, children, suffix }: FieldRowProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-stone-700">
        {label}
        {suffix && <span className="text-stone-400 font-normal ml-1">({suffix})</span>}
      </label>
      {children}
      {help && !error && (
        <p className="text-xs text-stone-400 leading-relaxed">{help}</p>
      )}
      {error && (
        <p className="text-xs text-red-600 leading-relaxed" role="alert">{error}</p>
      )}
    </div>
  );
}

interface NumberInputProps {
  id: string;
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number | string;
  placeholder?: string;
  suffix?: string;
  disabled?: boolean;
}

export function NumberInput({
  id,
  value,
  onChange,
  min,
  max,
  step = 'any',
  placeholder,
  suffix,
  disabled = false,
}: NumberInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        value={typeof value === 'number' && isNaN(value) ? '' : value}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === '' ? NaN : parseFloat(raw));
        }}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800
                   text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500
                   disabled:bg-stone-100 disabled:text-stone-400
                   transition-colors duration-200
                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-stone-400 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

interface PercentInputProps {
  id: string;
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number | string;
  placeholder?: string;
  disabled?: boolean;
}

export function PercentInput({
  id,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  placeholder,
  disabled = false,
}: PercentInputProps) {
  return (
    <NumberInput
      id={id}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      suffix="%"
      disabled={disabled}
    />
  );
}

interface SegmentedControlProps {
  options: { value: string; label: string; sublabel?: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="flex rounded-lg border border-stone-300 overflow-hidden" role="radiogroup">
      {options.map((opt, i) => (
        <button
          key={opt.value}
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-inset
                      ${value === opt.value
                        ? 'bg-sage-600 text-white'
                        : 'bg-white text-stone-600 hover:bg-stone-50'}
                      ${i > 0 ? 'border-l border-stone-300' : ''}`}
        >
          {opt.label}
          {opt.sublabel && (
            <span className={`block text-xs mt-0.5 ${value === opt.value ? 'text-sage-200' : 'text-stone-400'}`}>
              {opt.sublabel}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

interface SelectInputProps {
  id: string;
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
}

export function SelectInput({ id, value, onChange, options }: SelectInputProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800
                 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500
                 transition-colors duration-200"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
