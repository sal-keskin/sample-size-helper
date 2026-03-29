/**
 * Prevalence (one-proportion) sample size estimation.
 *
 * Goal: Determine the sample size needed to estimate a population
 * prevalence with a desired precision (margin of error).
 *
 * Formula:
 *   n0 = (Z^2 * p * (1 - p)) / d^2
 *   n_adjusted = n0 / (1 - nonresponse)
 *
 * Where:
 *   Z  = z-value for the desired confidence level
 *   p  = expected prevalence (as a proportion)
 *   d  = desired margin of error (as a proportion)
 */

import { zForConfidence } from './zscores';
import type { PrevalenceInputs, PrevalenceResult, PlotPoint } from '@/types';

export function calculatePrevalence(inputs: PrevalenceInputs): PrevalenceResult {
  const p = inputs.prevalence / 100;
  const d = inputs.marginOfError / 100;
  const nonResp = inputs.nonresponse / 100;
  const Z = zForConfidence(inputs.confidenceLevel);

  // Core formula: n0 = (Z^2 * p * (1-p)) / d^2
  const n0 = (Z * Z * p * (1 - p)) / (d * d);

  // Adjust for nonresponse: n_adjusted = n0 / (1 - nonresponse)
  const nAdjusted = Math.ceil(n0 / (1 - nonResp));

  return {
    n0: Math.ceil(n0),
    nAdjusted,
    prevalence: inputs.prevalence,
    marginOfError: inputs.marginOfError,
    confidenceLevel: inputs.confidenceLevel,
    nonresponse: inputs.nonresponse,
  };
}

/**
 * Generate plot data: precision (CI half-width) vs sample size.
 * Shows how margin of error decreases as n increases.
 */
export function prevalencePlotData(
  prevalence: number,       // %
  confidenceLevel: number,  // %
  currentN?: number         // optional marker point
): PlotPoint[] {
  const p = prevalence / 100;
  const Z = zForConfidence(confidenceLevel);
  const points: PlotPoint[] = [];

  // Generate a range of sample sizes
  const nValues = [
    10, 20, 30, 50, 75, 100, 150, 200, 300, 400, 500,
    750, 1000, 1500, 2000, 3000, 5000,
  ];

  for (const n of nValues) {
    // CI half-width = Z * sqrt(p*(1-p)/n)
    const halfWidth = Z * Math.sqrt((p * (1 - p)) / n) * 100; // back to %
    points.push({ x: n, y: Math.round(halfWidth * 100) / 100 });
  }

  // Include current N if provided
  if (currentN && currentN > 0) {
    const hw = Z * Math.sqrt((p * (1 - p)) / currentN) * 100;
    const existing = points.find(pt => pt.x === currentN);
    if (!existing) {
      points.push({ x: currentN, y: Math.round(hw * 100) / 100, label: 'current' });
      points.sort((a, b) => a.x - b.x);
    }
  }

  return points;
}

/**
 * Generate plot data: required n vs margin of error.
 */
export function prevalenceNvsMarginPlotData(
  prevalence: number,
  confidenceLevel: number,
  nonresponse: number,
): PlotPoint[] {
  const p = prevalence / 100;
  const Z = zForConfidence(confidenceLevel);
  const nonResp = nonresponse / 100;
  const points: PlotPoint[] = [];

  const margins = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20];

  for (const m of margins) {
    const d = m / 100;
    const n0 = (Z * Z * p * (1 - p)) / (d * d);
    const nAdj = Math.ceil(n0 / (1 - nonResp));
    points.push({ x: m, y: nAdj });
  }

  return points;
}
