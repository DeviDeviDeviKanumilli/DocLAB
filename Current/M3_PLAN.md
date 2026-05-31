# M3 — Rust Orchestration & SQLite (Detailed Plan)

## Context

M0 stood up the scaffold; M1 made the marketplace real; M2 built the Python training
engine. M3 is the **missing link** — the Rust layer that owns `~/.doclab/`, spawns the
worker, persists experiments to SQLite, and exposes four Tauri commands the M5 agent will
call. Without M3, the M4 UI runs on mock data and the M2 worker runs only by hand.

M3 is **contract-critical**: it writes `plan.json` (the M2 input contract), parses
`metrics.json`/`error.json` (the M2 output contracts), and defines the `experiments` table
schema M5–M7 read/write. Get the schemas exactly right now.

M3 ships **no agent and no UI changes**. Exit criterion (MILESTONES): a Tauri command kicks
off the worker and a finished run lands as a SQLite row + files on disk.

## Contracts (fixed — match M2 + MILESTONES exactly)

**`plan.json` (M3 writes, M2 reads):**
`schema_version:1, dataset_id, hf_id, revision, label_column, model_type, framework,
device:"cpu", seed, split:[0.8,0.1,0.1], primary_metric:"accuracy"`, plus optional
`goal_text`, `summary`, `local_csv` (test mode). M3 validates `schema_version==1` before
writing; unknown versions rejected.

**`metrics.json` (M2 writes, M3 reads) — exact 12 keys:**
`schema_version:1, primary_metric, metric_value, baseline_metric, device:"cpu", seed,
split, n_train, n_val, n_test, model_type, framework`. M3 rejects unknown `schema_version`.

**`error.json` (M2 writes, M3 reads) — exact keys:**
`schema_version:1, code, message, stage, device_fallback:false`. `code` closed set:
`dataset_missing, bad_plan, train_failed, oom, unknown`. M3 parses this on non-zero exit.

**`experiments` SQLite table (M3 creates, M5–M7 query):**
19 columns: `id, created_at_ms, updated_at_ms, status, goal_text, dataset_id,
primary_metric, metric_value, baseline_metric, model_type, framework, device, plan_path,
metrics_path, error_path, model_card_path, worker_stdout, worker_stderr, error_code,
error_message`. All nullable except `id, created_at_ms, updated_at_ms, status, goal_text,
dataset_id, plan_path`. Wide schema avoids ALTER churn before M5.

## Key decisions (resolved)

- **Python resolution order**: `DOCLAB_PYTHON` env → `worker/.venv/bin/python` if exists →
  `python3` fallback. The venv is the default (not the override) because system `python3`
  lacks xgboost, causing silent fallback to LogisticRegression. A venv-first default keeps
  the demo on the intended model.
- **Experiment IDs**: `exp_<unix_ms>_<8-char-random>` via `uuid` crate. Collision-resistant,
  sortable by creation time, filesystem-safe.
- **Synchronous `run_experiment`**: blocks the Tauri command thread until training finishes.
  Fine for M3 (backend-only, no live UI); M5 will want async + events for the Training
  screen progress steps.
- **`insert running → update complete/failed`**: M3 writes a `running` row before spawning
  the worker, then updates to `complete` (exit 0 + valid `metrics.json`) or `failed`
  (non-zero or bad metrics). This pattern is the foundation for M5's async progress.
- **Plan validation in `run_experiment`**: re-checks `schema_version==1` + required fields
  even though `create_plan` already validated. Defends the "agent may only select curated
  dataset ids" invariant against a client-supplied plan struct.
- **Absolute artifact paths**: `plan_path`, `metrics_path`, `error_path` stored as absolute
  strings under `~/.doclab/experiments/<id>/`. The worker writes `metrics.json` beside the
  plan (`plan_path.parent`), so an absolute `--job` arg makes output land correctly
  regardless of the `worker/` cwd.
- **Device always `"cpu"`** for tabular (M3 Phase 1 scope); `device_fallback` stays `false`.
  MPS belongs to M9.

## Target additions after M3

```
src-tauri/src/
├── experiments.rs       # NEW: M3 orchestration (create_plan, run_experiment, list, get)
├── db.rs                # EXTENDED: create experiments/ dir + experiments table
├── lib.rs               # EXTENDED: register 4 new Tauri commands
└── marketplace.rs       # unchanged

Cargo.toml               # + uuid crate
```

## Implementation steps

1. **`Cargo.toml`**: add `uuid = "1"` for experiment IDs.
2. **`db.rs`**: extend `data_root()` to create `datasets/` + `experiments/` subdirs;
   add `experiments_dir()` helper; add `create_experiments_table()` (19-column schema);
   call it from `open_db()`.
3. **`experiments.rs`** — new module with:
   - `WorkerPlan` struct (matches M2 input contract).
   - `PlanPreview`, `ExperimentSummary`, `ExperimentDetail` structs (all `#[serde(rename_all = "camelCase")]`).
   - `create_plan(market, goal_text, dataset_id) -> PlanPreview` — validates `dataset_id`
     is in the curated marketplace + is `tabular`; builds a Phase 1 plan (xgboost, cpu,
     seed 42, 80/10/10 split).
   - `run_experiment(plan, goal_text) -> ExperimentDetail` — validates plan, generates ID,
     creates `experiments/<id>/`, writes `plan.json`, inserts `running` row, spawns worker
     via `worker_python()`, parses `metrics.json`/`error.json`, updates `complete`/`failed`,
     returns full detail.
   - `list_experiments() -> Vec<ExperimentSummary>` — newest-first query.
   - `get_experiment(id) -> ExperimentDetail` — single-row lookup + parse artifact JSONs.
   - `worker_python()` — resolution order: `DOCLAB_PYTHON` → `worker/.venv/bin/python` → `python3`.
   - `generate_experiment_id()` — `exp_<unix_ms>_<8-char-random>`.
   - `validate_plan()`, `insert_running()`, `update_complete()`, `update_failed()`,
     `parse_metrics_file()`, `parse_error_file()` — internal helpers.
4. **`lib.rs`**: `mod experiments;`, register 4 new commands: `create_plan`,
   `run_experiment`, `list_experiments`, `get_experiment`.
5. **Tests** (in `experiments.rs`):
   - `experiment_ids_do_not_collide` — 100 IDs, all unique.
   - `insert_update_list_get_roundtrip` — in-memory DB, insert running → update complete →
     list → get, assert metrics parsed.
   - `missing_experiment_is_clean_error` — get non-existent ID returns "not found".
   - `metrics_parser_rejects_unknown_schema` — `schema_version: 99` → error.
   - `error_parser_accepts_worker_error_contract` — valid M2 `error.json` parses.
   - `worker_smoke_plan_to_metrics_to_sqlite` (ignored) — real worker run on fixture CSV,
     assert `status == "complete"`, `metric_value` present, `model_type == "xgboost"`.

## Critical files

- `src-tauri/src/experiments.rs` — the M3 orchestration layer; owns experiment lifecycle.
- `src-tauri/src/db.rs` — creates `experiments/` dir + `experiments` table.
- `src-tauri/src/lib.rs` — registers the 4 new Tauri commands.
- `src-tauri/Cargo.toml` — adds `uuid` crate.
- `worker/doclab_worker/__main__.py` — the CLI boundary M3 spawns.
- `worker/tests/fixtures/tiny.csv` — the smoke test fixture.

## Verification (M3 exit criteria)

1. `cargo fmt --check` → clean.
2. `cargo check -q` → no warnings.
3. `cargo test -q` → 11 passed, 1 ignored (6 marketplace, 5 experiments).
4. `cargo test -- --ignored worker_smoke` → green; asserts `model_type == "xgboost"` (proves
   venv-first Python resolution works).
5. `npm run build` → green (47 modules, no M4 regressions).
6. `worker/.venv/bin/python -m pytest worker/tests -q` → 4 passed (M2 still works).

## Out of scope (deferred)

- Agent emitting `intent.json`/`dataset_selection.json`/`data_profile.json` → M5.
- Replacing M4 mock data with live Tauri `invoke` calls → M5.
- `model_card.md` generation → M6.
- Best-run badging (`is_best`) → M7.
- Async `run_experiment` + progress events → M5 (Training screen needs it).
- Device selection / MPS / `device_fallback:true` → M9 (tabular is always CPU).
- Image/text worker paths → M9/M10.

## Commit (after approval + verification)

Tick M3 in `Current/MILESTONES.md`, save this plan to `Current/M3_PLAN.md`, update
`Current/handoff.md` to reflect M3 completion + M5 as next, commit, push to origin master
— matching the M0/M1/M2 workflow.
