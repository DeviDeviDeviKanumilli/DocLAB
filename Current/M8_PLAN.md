# M8 — Phase 1 Hardening & Demo Safety (Implementation Plan)

## Context

M5–M7 made the tabular loop work. M8 makes it **bulletproof for a live demo**:
deterministic, offline-capable, and free of raw stack traces. It also promotes
the committed seed bundle into a real Fallback A — a pre-completed run that
already sits in history if the live run fails on stage.

This maps directly to the spec's "Success criteria" section.

## Goal

The golden path runs deterministically and offline on the demo laptop in under
5 minutes, every failure surface shows calm copy (not a traceback), all
disclaimers are present, and a pre-completed run is always available as a
fallback.

## What Shipped

### Pre-cache (offline demo)
- `worker/scripts/prefetch.py` downloads + caches the curated datasets into
  `~/.doclab/datasets/<id>/` once, so the demo needs no network. Documented in
  `Current/DEMO.md`.

### Determinism & time cap
- Fixed seed (42) end-to-end through plan → worker.
- Real tabular run on ~101k rows completes in ~2 min on CPU — inside the 5-min
  budget.

### Friendly errors
- `src/lib/errors.ts` maps the closed worker error-code set
  (`dataset_missing`, `bad_plan`, `train_failed`, `oom`, `unknown`) to calm,
  human-readable copy.
- Raw `error_code` / `error_message` / `worker_stderr` moved behind a
  "Technical details" disclosure on Training + Results — no traceback in the
  primary UI.

### Disclaimers audit
- Added the missing **Home** non-clinical warning under the goal input.
- Plan checkbox + model-card Risks section already present from M4/M6.

### Fallback A — pre-completed run
- `seed_demo_experiment()` (called at startup) copies `demo/seed_experiment/`
  into a `complete` row in SQLite, pointing at the bundled artifacts, so a
  working run with a real model card always appears in history.
- Guarded to run once / only when the row is missing.
- Bundle refreshed with real metrics (64% accuracy vs 54% baseline) + a matching
  card.

## Testing

- Manual offline check: prefetch, disable network, run the golden path — it
  completes from cache.
- Determinism: two runs of the same plan produce identical `metric_value`
  (covered by `worker/tests/test_tabular.py::test_determinism`).
- Error copy: trigger a `bad_plan` (e.g. unknown `schema_version`) and confirm
  the friendly message renders with the raw detail tucked behind the disclosure.
- Fallback A: fresh `~/.doclab/`, launch app, confirm the seed run shows in
  history and opens with a card.

## Exit Criteria (all met)

- [x] Tabular dataset pre-cached; golden path runs offline.
- [x] Deterministic run finishes < 5 min on the demo laptop.
- [x] Every failure surface shows friendly copy, raw detail behind a disclosure.
- [x] Home warning + plan checkbox + card Risks all present.
- [x] Fallback A seed run appears in history and opens with results + card.

## Files Changed

- `worker/scripts/prefetch.py` — one-shot dataset cache.
- `src/lib/errors.ts` — error-code → friendly copy map.
- `src/screens/Training.tsx`, `src/screens/Results.tsx` — technical-details
  disclosure.
- `src/screens/Home.tsx` — non-clinical warning.
- `src-tauri/src/experiments.rs` (or `db.rs`) — `seed_demo_experiment()`.
- `demo/seed_experiment/` — refreshed `plan.json` / `metrics.json` /
  `model_card.md`.
- `Current/DEMO.md` — prefetch + fallback docs.

## Note

Rehearsal, MPS warmup, and the B/C fallbacks are **not** here — they live in
M11, which owns the dress rehearsal. M8 only ensures the app is *capable* of a
clean run.
