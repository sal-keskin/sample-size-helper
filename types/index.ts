// ── Shared types for Study Design & Sample Size Helper ──

export type Language = 'en' | 'tr';

export interface PrevalenceInputs {
  prevalence: number;      // expected prevalence (%)
  marginOfError: number;   // desired margin of error (%)
  confidenceLevel: number; // e.g. 95
  nonresponse: number;     // attrition / nonresponse (%)
}

export interface PrevalenceResult {
  n0: number;              // unadjusted sample size
  nAdjusted: number;       // adjusted for nonresponse
  prevalence: number;
  marginOfError: number;
  confidenceLevel: number;
  nonresponse: number;
}

export interface TwoProportionsInputs {
  p1: number;              // group 1 proportion (%)
  p2: number;              // group 2 proportion (%)
  alpha: number;           // significance level (e.g. 0.05)
  power: number;           // e.g. 0.80
  attrition: number;       // attrition (%)
}

export interface TwoProportionsResult {
  nPerGroup: number;
  nTotal: number;
  nPerGroupAdjusted: number;
  nTotalAdjusted: number;
  p1: number;
  p2: number;
  alpha: number;
  power: number;
  attrition: number;
}

export interface TwoMeansInputs {
  delta: number;           // smallest mean difference worth detecting
  sigma: number;           // common SD (or pooled planning SD)
  alpha: number;
  power: number;
  attrition: number;       // attrition (%)
}

export interface TwoMeansResult {
  nPerGroup: number;
  nTotal: number;
  nPerGroupAdjusted: number;
  nTotalAdjusted: number;
  delta: number;
  sigma: number;
  alpha: number;
  power: number;
  attrition: number;
}

export interface PredictorsBinaryInputs {
  eventRate: number;       // anticipated event rate (%)
  predictors: number;      // number of candidate predictors
  epv: number;             // events per variable (default 15)
}

export interface PredictorsBinaryResult {
  eventsNeeded: number;
  nRecommended: number;
  nLow: number;            // EPV 10
  nPreferred: number;      // EPV 15
  nHigh: number;           // EPV 20
  eventRate: number;
  predictors: number;
}

export interface PredictorsContinuousInputs {
  predictors: number;
}

export interface PredictorsContinuousResult {
  nModel: number;          // 50 + 8k
  nPredictor: number;      // 104 + k
  nRecommended: number;    // max(nModel, nPredictor)
  predictors: number;
}

// Already-have-data types
export interface AHDPrevalenceInputs {
  currentN: number;
  prevalence: number;      // expected/observed (%)
  confidenceLevel: number;
}

export interface AHDPrevalenceResult {
  halfWidth: number;       // margin of error (%)
  currentN: number;
  prevalence: number;
  confidenceLevel: number;
}

export interface AHDTwoMeansInputs {
  currentNPerGroup: number;
  sigma: number;
  alpha: number;
  power: number;
}

export interface AHDTwoMeansResult {
  detectableDelta: number;
  currentNPerGroup: number;
  sigma: number;
  alpha: number;
  power: number;
}

export interface AHDTwoProportionsInputs {
  currentNPerGroup: number;
  baselineProportion: number; // (%)
  alpha: number;
  power: number;
}

export interface AHDTwoProportionsResult {
  detectableDifference: number; // absolute difference (%)
  currentNPerGroup: number;
  baselineProportion: number;
  alpha: number;
  power: number;
}

// Validation
export interface ValidationError {
  field: string;
  message: string;
}

// Plot data
export interface PlotPoint {
  x: number;
  y: number;
  label?: string;
}
