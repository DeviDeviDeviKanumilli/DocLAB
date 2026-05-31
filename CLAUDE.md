# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

DocLab is a **hackathon MVP in the spec stage**. The repo currently contains only docs and
**no code scaffold yet** — `src/` (Tauri + React) and `worker/` (Python) are TBD.

Docs are split into current vs. archived:
- `Current/spec.md` — full spec, read this first (source of truth)
- `Current/DEMO.md` — judge demo script
- `Archived_Plans/` — superseded earlier versions of the spec/demo/handoff; do not build from these
- `README.md` — product overview

When scaffolding, follow the target layout and contracts below rather than inventing new ones.

## Commands

No build/lint/test tooling exists yet. The expected commands once scaffolded (from README):

```bash
npm install && npm run tauri dev    # Tauri + React app
cd worker && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
python -m doclab_worker --job plan.json   # invoke the training worker (Rust calls this)
```

Add real commands to this file as the scaffold lands.

## Architecture

DocLab is a **local-first healthcare ML prototyping lab**: a clinician types a goal in plain
English, the agent matches it to a curated public dataset, the user approves a plan, training
runs locally, and the output is metrics plus a doctor-readable model card. **Nothing leaves the
machine; no private patient data is ever uploaded.**

Four parts, each a separate layer:

- **ML Planning Agent** — turns goal text → plan → orchestration → model card. Keep it
  predictable and staged, not autonomously "magic". The agent must only ever select dataset IDs
  that exist in the curated marketplace (never hallucinate a dataset).
- **Dataset Marketplace** — a hand-curated index of ~10–15 datasets in `marketplace/datasets.yaml`
  (source of truth), mirrored into SQLite. The agent queries this index only — **no live Hugging
  Face search at runtime** (reliability + safety).
- **Training Engine** — a single Python worker invoked by Rust as
  `python -m doclab_worker --job plan.json`, JSON in / JSON out. Loads data → preprocess →
  split → train → save checkpoint → return `metrics.json`.
- **Experiment Tracker** — SQLite (`doclab.db`) + per-run folders under `experiments/<id>/`.

Layer boundaries: **Rust** orchestrates (jobs, SQLite, file paths) and shells out to the
**Python** worker. **React + Tailwind** is the UI inside a **Tauri** shell. The Rust↔Python
boundary is JSON files on disk, not a live protocol.

## Fixed contracts (do not drift from these)

Every run writes the same artifacts to `experiments/<id>/`. These filenames and their roles are a
fixed contract across the agent, worker, and tracker:

| File | Purpose |
|------|---------|
| `intent.json` | Parsed goal: task type, modality, metric hint |
| `dataset_selection.json` | Chosen dataset + rationale |
| `data_profile.json` | Schema, label column, row count, missing % |
| `plan.json` | Model, preprocessing, splits, metric (machine + human text) — the worker's input |
| `metrics.json` | Primary metric + sanity checks — the worker's output |
| `model_card.md` | Doctor-facing summary |

**Task → model mapping (MVP, do not add frameworks beyond these):**

| Data | Task | Model | Framework |
|------|------|-------|-----------|
| Tabular | predict / classify | XGBoost (fallback: logistic regression) | XGBoost / sklearn |
| Image | classify | small CNN | PyTorch |
| Text | summarize / classify | small LM + LoRA | Transformers + PEFT only (no Unsloth) |

**Sanity checks are a product requirement, not optional polish:**
- Tabular: report accuracy **and** majority-class baseline. If model ≈ baseline, the model card
  must say "Model may not be learning signal."
- Image: if training set < 500 samples, model card must warn about overfitting.
- Text: ROUGE-L plus **3 fixed example** input/summary pairs in the card (qualitative only).

## Build order

Phased and demo-able in order — when in doubt, deepen Phase 1 rather than starting a later phase:
1. **Phase 1 (must-have):** Tauri shell + goal input + plan view + approve → curated tabular
   dataset → XGBoost worker (accuracy + baseline) → SQLite experiment + model card.
2. **Phase 2 (should-have):** image dataset + CNN worker + small-data warning.
3. **Phase 3 (nice-to-have):** text dataset + Transformers/LoRA + ROUGE-L.

## Non-negotiable scope guardrails

These are product safety constraints — do not implement features that violate them:
- No private patient uploads, no hospital EHR integration, no PHI handling.
- No diagnosis / treatment / clinical-decision claims. Every model card and the UI must carry a
  "research and prototyping only — not for clinical care" disclaimer.
- Use only public / synthetic / de-identified datasets from the curated marketplace.
- UI copy uses clinical intent ("predict", "classify", "summarize"), never model names like
  "XGBoost" or "LoRA" in primary user-facing flows.

## Runtime data layout

Created on first run under `./doclab/` (or `~/.doclab/`): `doclab.db`, `datasets/<id>/` (cached HF
snapshots), `experiments/<id>/` (the artifacts above + `checkpoints/`). Datasets pin a Hugging Face
revision for reproducibility.
