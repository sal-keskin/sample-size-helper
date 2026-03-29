# Study Design & Sample Size Helper

A calm, bilingual (English / Turkish) web app that helps clinicians, fellows, and thesis writers plan simple clinical-epidemiology studies and estimate sample sizes.

> **This is a planning tool, not a substitute for statistical consultation.**

## Who it's for

- Internal medicine fellows
- Public health / epidemiology trainees
- Clinicians writing theses
- Physicians with limited formal statistics training

## What it does

| Calculator | Description |
|---|---|
| **Prevalence** | Sample size to estimate how common something is |
| **Two Proportions** | Compare two groups on a yes/no outcome |
| **Two Means** | Compare two groups on a numeric outcome |
| **Predictors** *(beta)* | Rough planning guidance for predictor studies |
| **Already Have Data** | What's possible with a current sample? |

Each calculator provides:
- Suggested target sample size
- Assumptions summary
- Interactive plot
- Shareable link (no patient data!)
- Copy-ready methods paragraph (English + Turkish)
- Reporting checklist

## What it does NOT do

- Replace statistical consultation for complex designs
- Handle cluster / multilevel / design-effect calculations
- Support survival analysis, non-inferiority, or equivalence designs
- Perform Bayesian sample size calculations
- Store any patient data

## Privacy

- **No data collection.** All calculations run entirely in the browser.
- **No cookies.** Only your language preference is saved locally.
- **No analytics.** No tracking tools are included.
- **Share links contain only calculator assumptions** (proportions, means, alpha, power). Never patient data.

## Predictor Studies Disclaimer

The predictor study path provides **rough planning guidance** based on simplified rules of thumb (events-per-variable for logistic models, Green's rules for linear models). It should not be treated as a definitive sample size calculation.

## Formulas Used

### Prevalence (one proportion)
```
n0 = (Z² × p × (1 - p)) / d²
n_adjusted = ceil(n0 / (1 - nonresponse))
```

### Two independent proportions
```
pbar = (p1 + p2) / 2
n_per_group = ceil(((Za × √(2 × pbar × (1-pbar)) + Zb × √(p1×(1-p1) + p2×(1-p2)))²) / (p1 - p2)²)
n_total_adjusted = ceil(2 × n_per_group / (1 - attrition))
```

### Two independent means
```
n_per_group = ceil(2 × ((Za + Zb)² × σ²) / δ²)
n_total_adjusted = ceil(2 × n_per_group / (1 - attrition))
```

### Predictors — Binary outcome (logistic)
```
events_needed = EPV × k
n_total = ceil(events_needed / event_rate)
```

### Predictors — Continuous outcome (linear)
```
n1 = 50 + 8k (overall model)
n2 = 104 + k (individual predictor)
recommended = max(n1, n2)
```

## How Share Links Work

Calculator state is encoded as readable URL query parameters:
```
/calc/two-proportions?p1=25&p2=40&alpha=0.05&power=0.80&att=10&lang=en
```
Links contain only calculator assumptions — never patient or personal information.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

Deploy-ready for Vercel or Netlify (free tier):

```bash
# Vercel
npx vercel

# Or connect your Git repo to Vercel/Netlify for automatic deploys
```

## Tech Stack

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Recharts** (charts)
- No database, no auth, no backend

## Limitations

1. Only supports the most common study designs
2. Assumes equal group allocation for two-group comparisons
3. Predictor calculations are simplified rules of thumb
4. No finite population correction
5. No design-effect / cluster adjustments
6. Z-approximation used (not exact t-distribution for small samples)

## Suggestions for v2

- Finite population correction
- Unequal allocation ratios
- Paired designs (paired t-test, McNemar)
- Sensitivity analysis mode (range of assumptions)
- PDF export of results
- More interactive plots (power curves)
- Dark mode
- Additional languages

## License

MIT
