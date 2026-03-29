/**
 * Two independent proportions sample size calculation.
 *
 * Goal: Determine sample size to compare two groups with a binary outcome.
 *
 * Formula (equal allocation):
 *   pbar = (p1 + p2) / 2
 *   n_per_group = ((Za * sqrt(2 * pbar * (1 - pbar)) + Zb * sqrt(p1*(1-p1) + p2*(1-p2)))^2) / (p1 - p2)^2
 *
 * Then adjust for attrition:
 *   n_total = 2 * n_per_group
 *   n_total_adjusted = n_total / (1 - attrition)
 */

import { zAlpha, zBeta } from './zscores';
import type { TwoProportionsInputs, TwoProportionsResult, PlotPoint } from '@/types';

export function calculateTwoProportions(inputs: TwoProportionsInputs): TwoProportionsResult {
  const p1 = inputs.p1 / 100;
  const p2 = inputs.p2 / 100;
  const att = inputs.attrition / 100;

  const Za = zAlpha(inputs.alpha);
  const Zb = zBeta(inputs.power);

  const pbar = (p1 + p2) / 2;
  const diff = p1 - p2;

  // Numerator: (Za * sqrt(2*pbar*(1-pbar)) + Zb * sqrt(p1*(1-p1) + p2*(1-p2)))^2
  const term1 = Za * Math.sqrt(2 * pbar * (1 - pbar));
  const term2 = Zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
  const numerator = Math.pow(term1 + term2, 2);

  // Denominator: (p1 - p2)^2
  const denominator = diff * diff;

  const nPerGroup = Math.ceil(numerator / denominator);
  const nTotal = 2 * nPerGroup;
  const nTotalAdj = Math.ceil(nTotal / (1 - att));
  const nPerGroupAdj = Math.ceil(nTotalAdj / 2);

  return {
    nPerGroup,
    nTotal,
    nPerGroupAdjusted: nPerGroupAdj,
    nTotalAdjusted: 2 * nPerGroupAdj,
    p1: inputs.p1,
    p2: inputs.p2,
    alpha: inputs.alpha,
    power: inputs.power,
    attrition: inputs.attrition,
  };
}

/**
 * Plot data: required sample size vs absolute difference.
 * Fixes p1 (baseline) and varies the absolute difference.
 */
export function twoProportionsPlotData(
  baselineP: number,       // baseline proportion (%)
  alpha: number,
  power: number,
  attrition: number,
): PlotPoint[] {
  const points: PlotPoint[] = [];
  const diffs = [3, 5, 7, 10, 12, 15, 20, 25, 30];

  for (const d of diffs) {
    const p2 = baselineP + d;
    if (p2 > 99 || p2 < 1) continue;

    try {
      const result = calculateTwoProportions({
        p1: baselineP,
        p2,
        alpha,
        power,
        attrition,
      });
      points.push({ x: d, y: result.nTotalAdjusted });
    } catch {
      // skip impossible combinations
    }
  }

  return points;
}

/**
 * Find the detectable absolute difference given a fixed sample size.
 * Used in "already have data" mode.
 * Binary search over candidate differences.
 */
export function detectableDifferenceTwoProportions(
  currentNPerGroup: number,
  baselineProportion: number, // %
  alpha: number,
  power: number,
): number {
  const p1 = baselineProportion / 100;
  let low = 0.01;
  let high = 0.50;

  // Binary search: find smallest difference whose required n <= currentNPerGroup
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const p2 = Math.min(p1 + mid, 0.999);

    try {
      const result = calculateTwoProportions({
        p1: baselineProportion,
        p2: p2 * 100,
        alpha,
        power,
        attrition: 0,
      });

      if (result.nPerGroup <= currentNPerGroup) {
        high = mid;
      } else {
        low = mid;
      }
    } catch {
      low = mid;
    }

    if (high - low < 0.001) break;
  }

  return Math.round(high * 1000) / 10; // return as percentage
}
