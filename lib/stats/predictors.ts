/**
 * Simplified predictor-study sample size rough planning.
 *
 * IMPORTANT: This is approximate guidance, not a gold-standard engine.
 *
 * Binary outcome (logistic-style):
 *   events_needed = EPV * k
 *   n_total = events_needed / event_rate
 *
 * Continuous outcome (linear-model):
 *   n1 = 50 + 8k (overall model rule)
 *   n2 = 104 + k (individual predictor rule)
 *   recommended = max(n1, n2)
 */

import type {
  PredictorsBinaryInputs,
  PredictorsBinaryResult,
  PredictorsContinuousInputs,
  PredictorsContinuousResult,
} from '@/types';

export function calculatePredictorsBinary(inputs: PredictorsBinaryInputs): PredictorsBinaryResult {
  const eventRate = inputs.eventRate / 100;
  const k = inputs.predictors;

  // events_needed = EPV * k
  const eventsNeeded = inputs.epv * k;
  const nRecommended = Math.ceil(eventsNeeded / eventRate);

  // Range using EPV 10, 15, 20
  const nLow = Math.ceil((10 * k) / eventRate);
  const nPreferred = Math.ceil((15 * k) / eventRate);
  const nHigh = Math.ceil((20 * k) / eventRate);

  return {
    eventsNeeded,
    nRecommended,
    nLow,
    nPreferred,
    nHigh,
    eventRate: inputs.eventRate,
    predictors: k,
  };
}

export function calculatePredictorsContinuous(
  inputs: PredictorsContinuousInputs
): PredictorsContinuousResult {
  const k = inputs.predictors;

  // Overall model rule: n1 = 50 + 8k
  const nModel = 50 + 8 * k;

  // Individual predictor rule: n2 = 104 + k
  const nPredictor = 104 + k;

  // Recommended minimum = max(n1, n2)
  const nRecommended = Math.max(nModel, nPredictor);

  return {
    nModel,
    nPredictor,
    nRecommended,
    predictors: k,
  };
}
