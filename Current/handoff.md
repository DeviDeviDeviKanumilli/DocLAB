# Handoff — DocLab

_Last updated: 2026-06-01_

## Where things stand

**M0, M1, M2, M3, and M4 are done.** The next milestone is **M5** (end-to-end tabular loop),
which is the Phase 1 integration gate — it wires the agent, swaps M4 mock data for live
Tauri commands, and delivers the first complete prototype flow.

Milestone status (see `Current/MILESTONES.md` for the checklists):
- ✅ **M0** — Tauri + React scaffold; Rust→Python `worker_healthcheck` bridge.
- ✅ **M1** — curated marketplace: `marketplace/datasets.yaml` + Rust loader/query + SQLite mirror.
- ✅ **M2** — Python tabular worker: `plan.json` → train → `metrics.json` / `error.json`.
- ✅ **M3** — Rust orchestration: `experiments.rs`, SQLite `experiments` table, 4 Tauri commands.
- ✅ **M4** — React UI shell (8 screens) on mock data; merged via `feat/ui-shell`.
- ⬜ **M5** — end-to-end loop (Phase 1 gate). **DO THIS NEXT.**

What exists in the tree now:
- `src/` — React UI shell: `router.tsx`, `App.tsx`, `components/` (AppShell, Sidebar,
  TopAppBar, Disclaimer, Badge, Icon), `screens/` (Home, Plan, Training, Results,
  Experiments, Models, Datasets, Settings), `mock/data.ts`. Tailwind v4 design system in `index.css`.
- `src-tauri/` — Rust shell. `src/lib.rs` (7 commands: `greet`, `worker_healthcheck`,
  `query_datasets`, `create_plan`, `run_experiment`, `list_experiments`, `get_experiment`),
  `src/experiments.rs` (M3 orchestration), `src/marketplace.rs`, `src/db.rs` (creates
  `~/.doclab/`, `datasets/`, `experiments/` on startup; `datasets` + `experiments` tables).
  Crates: `serde_yaml`, `rusqlite` (bundled), `dirs`, `uuid`.
- `worker/` — Python worker. `doclab_worker/` (`__main__.py`, `tabular.py`, `errors.py`),
  `tests/` (fixture CSV + 4 pytest tests), `requirements.txt`, `.venv/` (gitignored).
- `marketplace/datasets.yaml` — **4 curated entries** (tabular ×2, image ×1, text ×1);
  research notes in `marketplace/DATASETS_RESEARCH.md`. Phase 1 worker trains
  `diabetes_readmission` (M3 default); M9/M10 add image/text paths.
- Per-milestone plans saved as `Current/M1_PLAN.md`, `Current/M2_PLAN.md`, `Current/M3_PLAN.md`.
- Runtime data root `~/.doclab/` (`doclab.db`, `datasets/<id>/`, `experiments/<id>/`)
  created on app startup.

Docs (source of truth): `Current/spec.md`, `Current/DEMO.md`, `Current/MILESTONES.md`,
`Current/UI.md`, `README.md`, `CLAUDE.md` / `AGENTS.md`. `Archived_Plans/` is superseded — don't build from it.

## What to do next

**Build M5 — end-to-end tabular loop.** M3 provides the backend plumbing; M5 wires the
agent and replaces M4 mock data with live Tauri commands. See the M5 checklist in
`Current/MILESTONES.md`. In short:
1. Agent parse goal → `intent.json` (task type, modality, metric hint). Rule-based is fine;
   optional LLM call only for parsing (spec Option A/B). Dataset choice **constrained to
   curated ids**.
2. Agent select + profile dataset → `dataset_selection.json` + `data_profile.json`
   (schema, label column, row count, missing %).
3. Agent emit plan → call `create_plan` Tauri command, render on Plan review screen.
4. On approve → call `run_experiment`, poll/stream status → Results screen with real metrics.
5. Replace all M4 mock imports with live Tauri `invoke` calls.
6. Error path: worker failure shows friendly message, experiment marked `failed`.

After M5, **M6** generates `model_card.md` from the spec template, and **M7** adds
best-run badging + cross-session history persistence.

**Phase 1 exit:** type goal → approve plan → see accuracy + baseline + model card, < 5 min on a laptop.

## Already-resolved decisions (were open at spec stage)

- **Dataset cache** lives at `~/.doclab/datasets/<id>/` (worker sets `cache_dir`); DB at `~/.doclab/doclab.db`.
- **Curated dataset id** is `imodels/diabetes-readmission` @ `191ab1f0…`, label `readmitted` (public, UCI-derived).
- **Tabular metric** is accuracy vs. majority-class baseline (M2 verified: 0.643 vs 0.539 on the real set).
- **macOS prereq**: XGBoost needs `brew install libomp` or it falls back to LogisticRegression (documented in worker/README).

## Still-open decisions

- Agent parsing: rule-based over `datasets.yaml` vs. optional LLM call (spec leans rule-based; decide in M5).
- Text metric: ROUGE-L via `rouge-score` or `evaluate` (Phase 2 / M10).
- Fill in real clock times for the MILESTONES timebox kill-switches once the hackathon end is known.

## Must-honor contracts (detail in Current/spec.md, CLAUDE.md, AGENTS.md)

- Per-run artifacts in `experiments/<id>/`: `intent.json`, `dataset_selection.json`,
  `data_profile.json`, `plan.json`, `metrics.json`, `model_card.md` — fixed filenames.
- Rust↔Python boundary is JSON files on disk, not a live protocol. Carry `schema_version` in
  `plan.json` / `metrics.json`; Rust rejects unknown versions.
- Agent may only select dataset IDs that exist in the curated marketplace — never hallucinate one.
- No live Hugging Face search at runtime.
- Frameworks: tabular = XGBoost/sklearn, image = PyTorch, text = Transformers + PEFT LoRA (no Unsloth).

## Safety guardrails (non-negotiable)

- No private patient uploads, no EHR integration, no PHI.
- No clinical/diagnosis/treatment claims; every model card + UI carries a "research only — not for
  clinical care" disclaimer.
- Curated public / synthetic / de-identified datasets only.
- Sanity checks are required: tabular baseline comparison, image small-data (<500) warning,
  text 3 example outputs.

## Build / test commands

- **UI**: `npm run build` (tsc + vite), `npm run dev`, `npm run tauri dev` (full app).
- **Rust**: `cargo test` / `cargo build` from `src-tauri/` (11 tests: 6 marketplace, 5 experiments).
  Ignored worker smoke test: `cargo test -- --ignored worker_smoke`.
- **Worker**: `worker/.venv/bin/python -m pytest worker/tests` (4 tabular tests);
  run a job with `python -m doclab_worker --job <plan.json>`.
- **M3 smoke (backend-only)**: `cargo test -- --ignored` runs a real plan → worker → SQLite roundtrip.

## Notes

- If time runs short, ship Phase 1 only; keep image/text as "coming soon" but leave modality logic in place.
- The M4 UI is wired to `mock/data.ts`; M5 replaces those imports with live Tauri command calls.
