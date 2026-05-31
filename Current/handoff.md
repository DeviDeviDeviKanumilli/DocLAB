# Handoff — DocLab

_Last updated: 2026-05-31_

## Where things stand

**All milestones M0–M10 are done; M11 is partial.** The full stack is built and all three
modality paths (tabular, image, text) work end-to-end. The remaining work is presenter-side
demo rehearsal, not code.

Milestone status (see `Current/MILESTONES.md` for checklists, `Current/M*_PLAN.md` for per-milestone notes):
- ✅ **M0** — Tauri + React scaffold; Rust→Python bridge; seed fallback bundle.
- ✅ **M1** — curated marketplace: `datasets.yaml` + Rust loader/query + SQLite mirror.
- ✅ **M2** — Python tabular worker: `plan.json` → train → `metrics.json` / `error.json`.
- ✅ **M3** — Rust orchestration: `experiments.rs`, SQLite `experiments` table, Tauri commands.
- ✅ **M4** — React UI shell (8 screens); originally mock data.
- ✅ **M5** — end-to-end tabular loop (Phase 1 gate): agent wired, mock data replaced with live Tauri calls.
- ✅ **M6** — `model_card.md` auto-generated (Rust) and rendered in Results via `react-markdown`.
- ✅ **M7** — experiment history + best-run badging; first schema migration (`is_best`).
- ✅ **M8** — hardening: prefetch, friendly errors, disclaimers audit, Fallback A seed run.
- ✅ **M9** — image CNN path (PyTorch), `resolve_device()`, MPS→CPU fallback.
- ✅ **M10** — text summarization path (LoRA t5-small), ROUGE-L, examples in card.
- ✅ **M12** — checkpoints + Try prototype: all modalities save weights, Results/Models Try UI, predict tests.
- ◐ **M11** — demo rehearsal: machine items done (MPS warmup, Fallbacks A/B); presenter items open.

Most recent work: the `feat/ui-shell` motion/visual polish was merged into `master` (re-applied
onto the real-data screens — count-up drives real metrics, no mock data), and the branch was
retired. `master` is synced with origin.

## What exists in the tree

- `src/` — React UI, fully wired to live Tauri commands. `agent/` (parser, selector, profiler),
  `screens/` (Home, Plan, Training, Results, Experiments, Models, Datasets, Settings),
  `components/`, `hooks/useCountUp.ts`, `lib/errors.ts`, `types/tauri.ts`. `mock/data.ts` remains
  but is no longer the data source for the golden path.
- `src-tauri/` — Rust shell: `lib.rs` (Tauri commands), `experiments.rs` (orchestration + model
  card + best-run), `marketplace.rs`, `db.rs` (data root, tables, `add_column_if_missing` migration).
- `worker/` — Python `doclab_worker`: `__main__.py` (modality dispatch), `tabular.py`, `image.py`,
  `text.py`, `device.py`, `errors.py`, `predict.py`; `scripts/prefetch.py`, `scripts/build_seed_checkpoint.py`; `tests/` (tabular/image/text/predict).
- `marketplace/datasets.yaml` — curated entries (tabular ×2, image ×1, text ×1), all wired.
- Runtime root `~/.doclab/` (`doclab.db`, `datasets/<id>/`, `experiments/<id>/`) created on startup.
- Checkpoints: `~/.doclab/experiments/<id>/checkpoints/` with `manifest.json`, model files, preprocessing metadata.
- Try prototype: Results screen after completed run; Models screen Try button; supports tabular/image/text.
- Predict: `python -m doclab_worker --predict predict_request.json` or Tauri `run_predict` command.

Docs (source of truth): `Current/spec.md`, `Current/MILESTONES.md`, `Current/DEMO.md`,
`Current/TESTING.md`, `Current/UI.md`, per-milestone `Current/M*_PLAN.md`, `README.md`,
`CLAUDE.md` / `AGENTS.md`. `Archived_Plans/` is superseded — don't build from it.

## What to do next

The build is feature-complete. Remaining work is **M11 presenter-side rehearsal**, not code
(see `Current/M11_PLAN.md` and `Current/DEMO.md`):
1. Rehearse the golden tabular path on the **presentation laptop** (not just the dev machine).
2. Prepare Fallback C assets (slides / screenshots / GIF of the loop) for a full app crash.
3. Memorize the 30-second pitch; keep live timing within 4–5 min.

Fallbacks A (pre-completed seed run in history) and B (exported artifact bundle in
`demo/seed_experiment/`) are already in place. MPS is warmed for the image + text paths.

If touching code: run the relevant tests before/after (see `Current/TESTING.md`), and keep the
golden tabular path deterministic and offline-capable.

## Must-honor contracts (detail in Current/spec.md, CLAUDE.md, AGENTS.md)

- Per-run artifacts in `experiments/<id>/`: `intent.json`, `dataset_selection.json`,
  `data_profile.json`, `plan.json`, `metrics.json`, `model_card.md` — fixed filenames.
- Rust↔Python boundary is JSON files on disk, not a live protocol. Carry `schema_version` in
  `plan.json` / `metrics.json`; Rust rejects unknown versions.
- Agent may only select dataset IDs that exist in the curated marketplace — never hallucinate one.
- No live Hugging Face search at runtime.
- Frameworks: tabular = XGBoost/sklearn, image = PyTorch, text = Transformers + PEFT LoRA (no Unsloth).
- Every deep-learning run records `device` (`mps`/`cpu`) and `device_fallback`.

## Safety guardrails (non-negotiable)

- No private patient uploads, no EHR integration, no PHI.
- No clinical/diagnosis/treatment claims; every model card + UI carries a "research only — not for
  clinical care" disclaimer.
- Curated public / synthetic / de-identified datasets only.
- Sanity checks are required: tabular baseline comparison, image small-data (<500) warning,
  text 3 example outputs.

## Build / test commands

- **UI**: `npm run build` (tsc + vite — the frontend gate), `npm run tauri dev` (full app).
- **Rust**: `cargo test -q` from `src-tauri/` (fast suite); `cargo test -- --ignored` for the
  live worker smoke test.
- **Worker**: `cd worker && python -m pytest -q` (tabular/image/text, offline + fast);
  run a job with `python -m doclab_worker --job <plan.json>`.
- **Demo prep**: `python worker/scripts/prefetch.py` pre-caches datasets for an offline demo.
- macOS: XGBoost needs `brew install libomp`; Python resolves venv-first
  (`DOCLAB_PYTHON` → `worker/.venv/bin/python` → `python3`).

## Still-open decisions

- Fill in real clock times for the MILESTONES timebox kill-switches once the hackathon end is known.