/**
 * Z-score utilities for sample size calculations.
 * We avoid pulling in a full stats library by providing
 * the Z-values we actually need.
 */

/**
 * Standard normal quantile lookup for common confidence levels.
 * Maps confidence level (%) → Z_alpha/2 for two-sided tests.
 */
const Z_TABLE: Record<number, number> = {
  80: 1.2816,
  85: 1.4395,
  90: 1.6449,
  95: 1.9600,
  99: 2.5758,
};

/**
 * Returns Z_alpha/2 for a two-sided confidence level.
 * @param confidenceLevel confidence level as a percentage (e.g., 95)
 */
export function zForConfidence(confidenceLevel: number): number {
  const z = Z_TABLE[confidenceLevel];
  if (z !== undefined) return z;
  // Fallback: approximate via probit for unusual levels
  const alpha = 1 - confidenceLevel / 100;
  return zFromAlpha(alpha);
}

/**
 * Returns Z_alpha/2 for a given two-sided alpha.
 * @param alpha significance level (e.g. 0.05)
 */
export function zAlpha(alpha: number): number {
  return zFromAlpha(alpha);
}

/**
 * Returns Z_beta for a given power (1 - beta).
 * @param power statistical power (e.g. 0.80)
 */
export function zBeta(power: number): number {
  const beta = 1 - power;
  // We need the upper quantile for beta, which is the same as
  // the two-sided quantile for 2*beta
  return zFromAlpha(2 * beta);
}

/**
 * Rational approximation to the probit (inverse standard normal CDF).
 * Uses the Abramowitz & Stegun approximation (formula 26.2.23).
 * Accurate to ~4.5e-4.
 *
 * @param alpha two-sided significance level
 * @returns z such that P(Z > z) = alpha/2
 */
function zFromAlpha(alpha: number): number {
  const p = alpha / 2; // one-sided
  if (p <= 0 || p >= 1) {
    throw new Error(`alpha/2 must be between 0 and 1, got ${p}`);
  }

  // Abramowitz & Stegun constants
  const c0 = 2.515517;
  const c1 = 0.802853;
  const c2 = 0.010328;
  const d1 = 1.432788;
  const d2 = 0.189269;
  const d3 = 0.001308;

  const t = Math.sqrt(-2 * Math.log(p));
  const z = t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t);

  return z;
}
