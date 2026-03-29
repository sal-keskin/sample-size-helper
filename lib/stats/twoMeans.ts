/**
 * Two independent means sample size calculation.
 *
 * Goal: Determine sample size to compare two groups
 * with a continuous/numeric outcome.
 *
 * Formula (equal allocation):
 *   n_per_group = 2 * ((Za + Zb)^2) * (sigma^2) / (delta^2)
 *
 * Where:
 *   Za    = z-value for two-sided alpha
 *   Zb    = z-value for power
 *   sigma = common SD (or pooled planning SD)
 *   delta = smallest mean difference worth detecting
 */

import { zAlpha, zBeta } from './zscores';
import type { TwoMeansInputs, TwoMeansResult, PlotPoint } from '@/types';

export function calculateTwoMeans(inputs: TwoMeansInputs): TwoMeansResult {
  const att = inputs.attrition / 100;
  const Za = zAlpha(inputs.alpha);
  const Zb = zBeta(inputs.power);

  // n_per_group = 2 * ((Za + Zb)^2) * (sigma^2) / (delta^2)
  const numerator = 2 * Math.pow(Za + Zb, 2) * Math.pow(inputs.sigma, 2);
  const denominator = Math.pow(inputs.delta, 2);

  const nPerGroup = Math.ceil(numerator / denominator);
  const nTotal = 2 * nPerGroup;
  const nTotalAdj = Math.ceil(nTotal / (1 - att));
  const nPerGroupAdj = Math.ceil(nTotalAdj / 2);

  return {
    nPerGroup,
    nTotal,
    nPerGroupAdjusted: nPerGroupAdj,
    nTotalAdjusted: 2 * nPerGroupAdj,
    delta: inputs.delta,
    sigma: inputs.sigma,
    alpha: inputs.alpha,
    power: inputs.power,
    attrition: inputs.attrition,
  };
}

/**
 * Compute pooled planning SD from two group-specific SDs.
 *   sigma = sqrt((sd1^2 + sd2^2) / 2)
 */
export function pooledSD(sd1: number, sd2: number): number {
  return Math.sqrt((sd1 * sd1 + sd2 * sd2) / 2);
}

/**
 * Plot data: required sample size vs detectable mean difference.
 */
export function twoMeansPlotData(
  sigma: number,
  alpha: number,
  power: number,
  attrition: number,
): PlotPoint[] {
  const points: PlotPoint[] = [];
  const Za = zAlpha(alpha);
  const Zb = zBeta(power);
  const att = attrition / 100;

  // Generate deltas from 0.1*sigma to 2*sigma
  const steps = 15;
  for (let i = 1; i <= steps; i++) {
    const delta = (sigma * i * 2) / steps; // 0 to 2*sigma
    if (delta <= 0) continue;

    const nPerGroup = Math.ceil(
      (2 * Math.pow(Za + Zb, 2) * Math.pow(sigma, 2)) / Math.pow(delta, 2)
    );
    const nTotal = 2 * nPerGroup;
    const nTotalAdj = Math.ceil(nTotal / (1 - att));

    points.push({
      x: Math.round(delta * 100) / 100,
      y: nTotalAdj,
    });
  }

  return points;
}

/**
 * Detectable mean difference for a given sample size.
 * Used in "already have data" mode.
 *
 * Rearranged: delta = sqrt(2 * ((Za + Zb)^2) * sigma^2 / n_per_group)
 */
export function detectableDifferenceTwoMeans(
  currentNPerGroup: number,
  sigma: number,
  alpha: number,
  power: number,
): number {
  const Za = zAlpha(alpha);
  const Zb = zBeta(power);

  const delta = Math.sqrt(
    (2 * Math.pow(Za + Zb, 2) * Math.pow(sigma, 2)) / currentNPerGroup
  );

  return Math.round(delta * 100) / 100;
}
