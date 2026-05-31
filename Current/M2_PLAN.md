# M2 — Tabular Training Worker (Detailed Plan)

## Context

M0 stood up the worker skeleton; M1 made the marketplace real (`imodels/diabetes-readmission`
@ `191ab1f0…`, label `readmitted`). M2 turns the skeleton into the **actual training engine** —
the first milestone that produces a real metric.

It is **contract-critical**: the worker is the Rust↔Python boundary. Rust (M3/M5) writes a
`plan.json` and spawns `python -m doclab_worker --job <plan.json>`; the worker writes a
`metrics.json` beside it on success, or an `error.json` + non-zero exit on failure. These schemas
are fixed contracts other layers depend on.

M2 ships **no Rust and no UI**. Exit: run the worker by hand on a sample plan → valid
`metrics.json` with accuracy + majority-class baseline.

## Contracts (fixed — match the seed bundle + MILESTONES exactly)

**`plan.json` (worker input):** `schema_version:1, dataset_id, hf_id, revision, label_column,
model_type, framework, device:"cpu", seed, split:[0.8,0.1,0.1], primary_metric:"accuracy"`. Plus
optional `local_csv` (offline test mode). The worker treats the plan as authoritative and never
touches `datasets.yaml`. Unknown `schema_version` → `bad_plan`.

**`metrics.json` (output) — exact 12 keys:** `schema_version:1, primary_metric, metric_value,
baseline_metric, device:"cpu", seed, split, n_train, n_val, n_test, model_type, framework`.

**`error.json` (failure) — exact keys:** `schema_version:1, code, message, stage,
device_fallback:false`. `stage` ∈ `load|preprocess|train|eval|write`; `code` closed set:
`dataset_missing, bad_plan, train_failed, oom, unknown`. Echoed to stderr; non-zero exit.

## Key decisions (resolved)

- **HF cache via `datasets` lib.** `load_dataset(hf_id, revision=…, cache_dir=~/.doclab/datasets/<id>)`
  downloads once. The diabetes set ships `train.csv` + `test.csv`; the worker concatenates all
  splits and re-splits 80/10/10 itself with the fixed seed for determinism.
- **`local_csv` plan key** lets the fixture test run fully offline (no HF hit).
- **Light, general preprocessing**: median-impute numerics, one-hot object columns, factorize the
  label to int — not overfit to the diabetes set.
- **XGBoost with sklearn fallback.** `XGBClassifier` (CPU, seeded); any exception → fall back to
  `LogisticRegression(max_iter=1000)`, recording the model actually used. A fallback is NOT an
  error; only total failure writes `error.json`.
- **Determinism.** The plan `seed` drives the split and the model. Two runs → identical metrics.
- **Module split.** Engine in `tabular.py` (importable funcs); `__main__.py` is thin
  (parse → `run_job()` → write metrics/error + exit code); error contract in `errors.py`.
- **Device always `"cpu"`** for tabular; `device_fallback:false`. MPS belongs to M9.

## Files added/changed

- `worker/doclab_worker/tabular.py` — engine: `load_plan, load_data, preprocess, split, train,
  evaluate, build_metrics`. Assembles the metrics contract.
- `worker/doclab_worker/__main__.py` — CLI boundary Rust spawns; owns exit codes + which JSON.
- `worker/doclab_worker/errors.py` — `WorkerError(code, stage, message)` + `write_error_json`.
- `worker/requirements.txt` — added `datasets`, `pytest`.
- `worker/tests/` — `fixtures/tiny.csv` (120-row learnable binary), `fixtures/plan.json`
  (`local_csv` mode), `test_tabular.py` (4 tests).

## Implementation note (surfaced during build)

XGBoost on macOS needs the OpenMP runtime (`libomp`) or its import fails with
`libxgboost.dylib could not be loaded`. Fixed with `brew install libomp`. Without it the worker
still runs via the LogisticRegression fallback, but the intended demo path is XGBoost — document
`brew install libomp` as a worker setup prerequisite (worker/README + later packaging in M12).

## Verification (M2 exit criteria — all passed)

1. `pytest worker/tests` → **4/4 green** (metrics-shape+baseline, determinism, bad_plan error,
   missing-label error).
2. Fixture hand-run twice via the CLI → byte-identical `metrics.json` (determinism confirmed).
3. Real smoke (`diabetes_readmission`, 81 410 train / 10 176 val / 10 177 test) → valid
   `metrics.json`, all 12 keys, `device:"cpu"`, **accuracy 0.643 > baseline 0.539** (xgboost).
4. Failure path (`schema_version:99`) → no `metrics.json`; `error.json` with `code:"bad_plan"`,
   stage `load`, `device_fallback:false`; non-zero exit; blob on stderr.

## Out of scope (deferred)

- Rust spawning the worker / reading metrics back / SQLite `experiments` row → M3.
- Agent emitting the plan, `intent.json`/`data_profile.json` → M5.
- `model_card.md` generation → M6. Device selection / MPS / `device_fallback:true` → M9.
