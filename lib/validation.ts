/**
 * Input validation helpers.
 * Returns user-friendly messages in both languages.
 */

import type { Language } from '@/types';

type ValidatorFn = (value: number, lang: Language) => string | null;

const msgs = {
  percentRange: {
    en: 'Please enter a percentage between 0 and 100.',
    tr: 'Lütfen 0 ile 100 arasında bir yüzde girin.',
  },
  percentRangeExcl: {
    en: 'Please enter a percentage between 0 and 100 (exclusive).',
    tr: 'Lütfen 0 ile 100 arasında (0 ve 100 hariç) bir yüzde girin.',
  },
  positive: {
    en: 'Please enter a positive number.',
    tr: 'Lütfen pozitif bir sayı girin.',
  },
  positiveInt: {
    en: 'Please enter a positive whole number.',
    tr: 'Lütfen pozitif bir tam sayı girin.',
  },
  marginTooSmall: {
    en: 'The margin of error should be greater than 0.',
    tr: 'Hata payı 0\'dan büyük olmalıdır.',
  },
  differenceTooSmall: {
    en: 'The difference must be greater than 0.',
    tr: 'Fark 0\'dan büyük olmalıdır.',
  },
  tooSmallToCompute: {
    en: 'This difference is too small to compute reliably with the current inputs.',
    tr: 'Bu fark, mevcut girdilerle güvenilir bir şekilde hesaplamak için çok küçük.',
  },
  proportionsMustDiffer: {
    en: 'The two proportions must be different.',
    tr: 'İki oran birbirinden farklı olmalıdır.',
  },
};

export const validatePercentage: ValidatorFn = (value, lang) => {
  if (value < 0 || value > 100 || isNaN(value)) {
    return msgs.percentRange[lang];
  }
  return null;
};

export const validatePercentageExclusive: ValidatorFn = (value, lang) => {
  if (value <= 0 || value >= 100 || isNaN(value)) {
    return msgs.percentRangeExcl[lang];
  }
  return null;
};

export const validatePositive: ValidatorFn = (value, lang) => {
  if (value <= 0 || isNaN(value)) {
    return msgs.positive[lang];
  }
  return null;
};

export const validatePositiveInt: ValidatorFn = (value, lang) => {
  if (value <= 0 || !Number.isInteger(value) || isNaN(value)) {
    return msgs.positiveInt[lang];
  }
  return null;
};

export const validateMarginOfError: ValidatorFn = (value, lang) => {
  if (value <= 0 || isNaN(value)) {
    return msgs.marginTooSmall[lang];
  }
  if (value > 50) {
    return msgs.percentRange[lang];
  }
  return null;
};

export const validateDifference: ValidatorFn = (value, lang) => {
  if (value <= 0 || isNaN(value)) {
    return msgs.differenceTooSmall[lang];
  }
  return null;
};

export function validateProportionsDiffer(p1: number, p2: number, lang: Language): string | null {
  if (Math.abs(p1 - p2) < 0.001) {
    return msgs.proportionsMustDiffer[lang];
  }
  return null;
}
