# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project State

DocLab is a **hackathon MVP with all milestones (M0–M11) shipped**. The full stack is built —
`src/` (Tauri + React), `worker/` (Python `doclab_worker`), `src-tauri/` (Rust), and
`marketplace/datasets.yaml`. All three modality paths (tabular, image, text) work end-to-end.
M11 is partially complete: machine-verifiable demo-readiness items are done; presenter-side
rehearsal items are open.

Docs are split into current vs. archived:

- `Current/spec.md` - full spec (original source of truth for product scope).
- `Current/MILESTONES.md` - what each milestone delivered + exit criteria; authoritative record
  of shipped scope.
- `Current/M0_PLAN.md` … `Current/M11_PLAN.md` - per-milestone implementation notes.
- `Current/TESTING.md` - how to write tests in this repo; read before adding any test.
- `Current/DEMO.md` - judge demo script and fallback ladder.
- `Archived_Plans/` - superseded earlier versions; do not build from these.
- `README.md` - product overview, stack, and layout.
- `handoff.md` - current handoff and next-step summary.

Follow the established layout and contracts below; do not invent new ones.

## Commands

```bash
# Frontend (Tauri + React)
npm install
npm run tauri dev          # run the desktop app
npm run build              # tsc strict + vite — the frontend gate (no JS test runner yet)

# Python worker
cd worker
python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
python -m doclab_worker --job plan.json   # invoke the worker (Rust calls this)
python -m pytest -q                         # worker tests (offline, fast)

# Rust orchestration
cd src-tauri && cargo test -q               # fast suite (skips #[ignore])
cd src-tauri && cargo test -- --ignored     # live worker smoke test

# Demo setup
python worker/scripts/prefetch.py           # pre-cache datasets for an offline demo
```

macOS: XGBoost needs `brew install libomp`. The Rust side resolves Python venv-first
(`DOCLAB_PYTHON` → `worker/.venv/bin/python` → `python3`).

## Product Architecture

DocLab is a **local-first healthcare ML prototyping lab**. A clinician types a goal in plain
English, the agent matches it to a curated public dataset, the user approves a plan, training
runs locally, and the output is metrics plus a doctor-readable model card.

Core promise: **nothing leaves the machine; no private patient data is ever uploaded.**

The system has four layers:

- **ML Planning Agent** - turns goal text into a plan, orchestrates the staged flow, and produces
  the model card. Keep it predictable rather than autonomously "magic". The agent may only select
  dataset IDs present in the curated marketplace.
- **Dataset Marketplace** - a hand-curated index of about 10-15 datasets in
  `marketplace/datasets.yaml`, mirrored into SQLite. This file is the source of truth. Do not add
  live Hugging Face search at runtime.
- **Training Engine** - a single Python worker invoked by Rust as
  `python -m doclab_worker --job plan.json`. It is JSON in / JSON out: load data, preprocess,
  split, train, save checkpoint, and return `metrics.json`.
- **Experiment Tracker** - SQLite (`doclab.db`) plus per-run folders under `experiments/<id>/`.

Layer boundaries:

- Rust orchestrates jobs, SQLite, and file paths.
- Rust shells out to the Python worker.
- React + Tailwind is the UI inside a Tauri shell.
- The Rust/Python boundary is JSON files on disk, not a live protocol.

## Fixed Contracts

Every run writes the same artifacts to `experiments/<id>/`. These filenames and roles are fixed
contracts across the agent, worker, and tracker:

| File | Purpose |
| --- | --- |
| `intent.json` | Parsed goal: task type, modality, metric hint |
| `dataset_selection.json` | Chosen dataset plus rationale |
| `data_profile.json` | Schema, label column, row count, missing percent |
| `plan.json` | Model, preprocessing, splits, metric; machine and human text; worker input |
| `metrics.json` | Primary metric plus sanity checks; worker output |
| `model_card.md` | Doctor-facing summary |

Task to model mapping for the MVP:

| Data | Task | Model | Framework |
| --- | --- | --- | --- |
| Tabular | predict / classify | XGBoost, fallback logistic regression | XGBoost / sklearn |
| Image | classify | small CNN | PyTorch |
| Text | summarize / classify | small LM + LoRA | Transformers + PEFT only |

Do not add frameworks beyond these for the hackathon MVP. In particular, do not use Unsloth.

## Required Sanity Checks

Sanity checks are a product requirement, not optional polish:

- Tabular: report accuracy and majority-class baseline. If the model is approximately baseline,
  the model card must say: "Model may not be learning signal."
- Image: if the training set has fewer than 500 samples, the model card must warn about
  overfitting.
- Text: report ROUGE-L plus 3 fixed example input/summary pairs in the card. These examples are
  qualitative only.

## Build Order

Build in demo-able phases. When in doubt, deepen Phase 1 instead of starting a later phase.

1. **Phase 1, must-have:** Tauri shell, goal input, plan view, approve flow, curated tabular
   dataset, XGBoost worker, accuracy plus baseline, SQLite experiment, model card.
2. **Phase 2, should-have:** image dataset, CNN worker, small-data warning.
3. **Phase 3, nice-to-have:** text dataset, Transformers/LoRA, ROUGE-L.

Phase 1 exit criteria: type a goal, approve a plan, see accuracy plus baseline and a model card.

## Safety And Scope Guardrails

These are non-negotiable product safety constraints:

- No private patient uploads.
- No hospital EHR integration.
- No PHI handling.
- No diagnosis, treatment, or clinical-decision claims.
- Every model card and the UI must include a "research and prototyping only - not for clinical
  care" disclaimer.
- Use only public, synthetic, or de-identified datasets from the curated marketplace.
- UI copy uses clinical intent words such as "predict", "classify", and "summarize"; do not put
  model names like "XGBoost" or "LoRA" in primary user-facing flows.

## Runtime Data Layout

Created on first run under `./doclab/` or `~/.doclab/`:

```text
doclab/
├── doclab.db
├── datasets/<id>/
└── experiments/<id>/
    ├── intent.json
    ├── dataset_selection.json
    ├── data_profile.json
    ├── plan.json
    ├── metrics.json
    ├── model_card.md
    └── checkpoints/
```

Datasets must pin a Hugging Face revision for reproducibility.

## Implementation Notes For Agents

- Read `Current/spec.md` before making architectural decisions.
- Treat `Archived_Plans/` as historical context only.
- Preserve fixed filenames and JSON-on-disk boundaries.
- Keep the planning agent deterministic and staged where possible. A rules-based parser over the
  curated marketplace is acceptable for Phase 1.
- Never let the agent hallucinate datasets; only choose IDs present in `marketplace/datasets.yaml`.
- Do not introduce runtime network dataset search.
- Keep frontend user flows clinician-centered and avoid exposing framework details in primary UI.
- Prefer shipping the tabular path end to end over partially implementing multiple modalities.
