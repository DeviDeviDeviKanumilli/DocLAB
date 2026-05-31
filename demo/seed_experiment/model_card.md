# Readmission Prototype (PLACEHOLDER)

**Goal:** I want to predict whether a patient is likely to be readmitted to the hospital.
**Intended use:** Research and prototyping only — not for clinical decisions.

> Placeholder Fallback B model card (DEMO.md). Replaced with a real generated
> card once M6 lands.

## Summary
- **Dataset:** PLACEHOLDER curated tabular readmission set (public / de-identified)
- **Task:** binary classification
- **Model:** XGBoost classifier
- **Result:** 83% accuracy (baseline: 58%)

## Limitations
- Trained on a public prototype dataset; may not generalize to real hospitals.
- Placeholder values — not from a real training run.

## Risks
- Not validated for patient care. Do not use for diagnosis or treatment decisions.

## Reproducibility
- Dataset: `<hf_id>@<revision>`
- Seed 42, 80/10/10 split; see `plan.json`.
