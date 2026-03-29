/**
 * "Already have data" calculators.
 *
 * These help users who already collected data understand
 * what their current sample can support.
 */

import { zForConfidence } from './zscores';
import { detectableDifferenceTwoMeans } from './twoMeans';
import { detectableDifferenceTwoProportions } from './twoProportions';
import type {
  AHDPrevalenceInputs,
  AHDPrevalenceResult,
  AHDTwoMeansInputs,
  AHDTwoMeansResult,
  AHDTwoProportionsInputs,
  AHDTwoProportionsResult,
  PlotPoint,
} from '@/types';

/**
 * AHD1: Prevalence precision with current n.
 * Computes the margin of error achievable with the current sample size.
 *
 * half_width = Z * sqrt(p * (1 - p) / n)
 */
export function ahdPrevalence(inputs: AHDPrevalenceInputs): AHDPrevalenceResult {
  const p = inputs.prevalence / 100;
  const Z = zForConfidence(inputs.confidenceLevel);

  const halfWidth = Z * Math.sqrt((p * (1 - p)) / inputs.currentN);

  return {
    halfWidth: Math.round(halfWidth * 10000) / 100, // convert to percentage, 2 dp
    currentN: inputs.currentN,
    prevalence: inputs.prevalence,
    confidenceLevel: inputs.confidenceLevel,
  };
}

/**
 * AHD2: Detectable mean difference with current n.
 */
export function ahdTwoMeans(inputs: AHDTwoMeansInputs): AHDTwoMeansResult {
  const delta = detectableDifferenceTwoMeans(
    inputs.currentNPerGroup,
    inputs.sigma,
    inputs.alpha,
    inputs.power,
  );

  return {
    detectableDelta: delta,
    currentNPerGroup: inputs.currentNPerGroup,
    sigma: inputs.sigma,
    alpha: inputs.alpha,
    power: inputs.power,
  };
}

/**
 * AHD3: Detectable absolute difference for two proportions with current n.
 */
export function ahdTwoProportions(inputs: AHDTwoProportionsInputs): AHDTwoProportionsResult {
  const diff = detectableDifferenceTwoProportions(
    inputs.currentNPerGroup,
    inputs.baselineProportion,
    inputs.alpha,
    inputs.power,
  );

  return {
    detectableDifference: diff,
    currentNPerGroup: inputs.currentNPerGroup,
    baselineProportion: inputs.baselineProportion,
    alpha: inputs.alpha,
    power: inputs.power,
  };
}

/**
 * Compute additional sample needed.
 */
export function additionalSampleNeeded(currentN: number, targetN: number): number {
  return Math.max(0, targetN - currentN);
}

/**
 * Plot data: precision vs sample size for AHD prevalence.
 * Marks the user's current n on the curve.
 */
export function ahdPrevalencePlotData(
  prevalence: number,
  confidenceLevel: number,
  currentN: number,
): PlotPoint[] {
  const p = prevalence / 100;
  const Z = zForConfidence(confidenceLevel);
  const points: PlotPoint[] = [];

  const nValues = [
    10, 20, 30, 50, 75, 100, 150, 200, 300, 400, 500,
    750, 1000, 1500, 2000, 3000, 5000,
  ];

  // Ensure currentN is included
  if (!nValues.includes(currentN) && currentN > 0) {
    nValues.push(currentN);
    nValues.sort((a, b) => a - b);
  }

  for (const n of nValues) {
    const hw = Z * Math.sqrt((p * (1 - p)) / n) * 100;
    points.push({
      x: n,
      y: Math.round(hw * 100) / 100,
      label: n === currentN ? 'current' : undefined,
    });
  }

  return points;
}
