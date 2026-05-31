# TESTING.md — How to Write Tests in DocLab

Guidance for AI agents (and humans) writing tests in this repo. Follow the
patterns already established in `worker/tests/` and the Rust `#[cfg(test)]`
modules rather than inventing new ones. Match the existing style.

## Where tests live

| Layer | Location | Runner |
|-------|----------|--------|
| Python worker | `worker/tests/test_*.py` | `pytest` |
| Rust orchestration | inline `#[cfg(test)] mod tests` in `src-tauri/src/*.rs` | `cargo test` |
| Frontend | none yet | (build is the gate: `npm run build`) |

## Commands

```bash
# Python worker
cd worker && python -m pytest -q            # all worker tests
cd worker && python -m pytest tests/test_tabular.py -q

# Rust
cd src-tauri && cargo test -q               # all (skips #[ignore])
cd src-tauri && cargo test -- --ignored     # the live worker smoke test

# Frontend typecheck + build (the only frontend gate today)
npm run build
```

## Core principle: tests run offline and fast

Every worker test **mocks the network, the model, and Metal**. No HF downloads,
no real fine-tuning, no MPS kernels in CI. The tests prove the **contracts**
(metrics shape, error codes, device fallback) — not that PyTorch trains well.
A real MPS run is a separate manual smoke, not a unit test.

## Python worker tests

### Two styles, pick by what you're testing

**1. Subprocess (black-box, contract-level)** — used by `test_tabular.py`.
Run the worker exactly as Rust does and assert on the files it writes. Best for
the JSON-in/JSON-out contract and exit codes.

```python
def run_worker(plan_path: Path):
    return subprocess.run(
        [sys.executable, "-m", "doclab_worker", "--job", str(plan_path)],
        cwd=str(WORKER_ROOT), capture_output=True, text=True,
    )

def test_metrics_shape_and_baseline(tmp_path):
    plan_path = write_plan(tmp_path)          # writes plan.json into tmp_path
    result = run_worker(plan_path)
    assert result.returncode == 0, result.stderr
    metrics = json.loads((tmp_path / "metrics.json").read_text())
    assert set(metrics.keys()) == METRICS_KEYS
```

**2. In-process with `monkeypatch` (mock the heavy parts)** — used by
`test_image.py` / `test_text.py`. Call `module.run_job(plan, tmp_path)` directly
and patch out data loading, model build, training, and `resolve_device` so it's
instant and offline.

```python
def test_metrics_contract_and_examples(monkeypatch, tmp_path):
    monkeypatch.setattr(text, "load_text_data", lambda plan, root: (rows, rows))
    monkeypatch.setattr(text, "_build_model", lambda seed: ("MODEL", "TOK"))
    monkeypatch.setattr(text, "_train_once", lambda m, t, rows, dev, seed: m)
    monkeypatch.setattr(text, "_generate", lambda m, t, texts, dev: ["summary 0"] * len(texts))
    monkeypatch.setattr(text, "resolve_device", lambda: "cpu")

    metrics = text.run_job(_plan(), tmp_path)
    assert metrics["primary_metric"] == "rouge_l"
```

### Always use fixtures and `tmp_path`
- Use the pytest `tmp_path` fixture for any file the worker writes — never write
  into the repo or `~/.doclab/`.
- Tabular tests use a committed CSV (`worker/tests/fixtures/tiny.csv`) via the
  plan's `local_csv` mode — an offline path that skips HF entirely. Reuse it.
- Build plans with a small `write_plan(tmp_path, **overrides)` / `_plan()` helper
  and override only the field under test (see `test_tabular.py`).

## What every worker test must assert (the contracts)

These are product requirements, not nice-to-haves. A new worker path is not done
until its tests cover:

### Predict / Try path tests

**Location:** `worker/tests/test_predict.py`

**Pattern:** Mock checkpoint files and model loading; verify dispatch routing and error codes.

```python
def test_tabular_predict_with_mock_checkpoint(monkeypatch, tmp_path):
    # Create fake checkpoints/manifest.json, preprocess.json, model.joblib
    # Mock joblib.load to return fake model
    # Call predict() and verify result structure
```

**Contract:**
- `predict_request.json`: `{schema_version, experiment_id, experiment_dir, input: {type, value}}`
- `prediction.json`: `{schema_version, prediction, confidence, detail, warning}`
- Input types: `tabular_json`, `image_path`, `text`

**CLI test:**
```bash
cd worker
python -m doclab_worker --predict tests/fixtures/predict_request.json
```

**Live Try:** Manual smoke test after training; not covered by unit tests.

---

1. **Metrics shape** — exact key set, `schema_version == 1`, `metric_value` and
   `baseline_metric` in `[0, 1]`, integer counts > 0.
2. **Determinism** — same plan run twice → identical `metric_value` (seed works).
3. **Baseline sanity** — on a learnable fixture, `metric_value >= baseline_metric`.
4. **Error contract** — a bad plan exits non-zero, writes **no** `metrics.json`,
   writes `error.json` with `code` in the closed set
   `{dataset_missing, bad_plan, train_failed, oom, unknown}` and `stage` in
   `{load, preprocess, train, eval, write}`.
5. **Device fallback** (DL paths) — simulate an MPS op error, assert the job
   retries on `cpu`, `device == "cpu"`, `device_fallback is True`, and exactly
   2 train attempts.
6. **Modality-specific sanity** — image: `< 500` samples attaches an
   overfitting `warning`; text: `examples[]` has `N_EXAMPLES` entries each with
   `{input, prediction, reference}`, and ROUGE-L is 1.0 for identical / 0.0 for
   disjoint strings.

### Simulating MPS fallback (the standard pattern)

```python
def test_mps_failure_falls_back_to_cpu(monkeypatch, tmp_path):
    monkeypatch.setattr(mod, "resolve_device", lambda: "mps")
    calls = {"n": 0}
    def flaky_train(*args, device, **kw):
        calls["n"] += 1
        if device == "mps":
            raise RuntimeError("simulated MPS op failure")
        return ...  # succeed on cpu
    monkeypatch.setattr(mod, "_train_once", flaky_train)

    metrics = mod.run_job(_plan(), tmp_path)
    assert metrics["device"] == "cpu"
    assert metrics["device_fallback"] is True
    assert calls["n"] == 2
```

## Rust tests

Inline `#[cfg(test)] mod tests` at the bottom of the module under test
(`marketplace.rs`, `experiments.rs`). Use `std::env::temp_dir()` +
`generate_experiment_id()` for scratch dirs; never touch the real data root.

- **Marketplace:** query "readmission" returns the tabular dataset; an unknown
  id returns nothing; missing required fields / unpinned `main` revision fail loud.
- **Experiments / best-run:** insert two completed rows on the same `goal_text`,
  run the best-run recompute, assert exactly one row has `is_best = 1`.
- **Model card:** call `generate_model_card(...)` against a temp dir, read the
  file back, assert it contains the result %, baseline %, the dataset limitation,
  and the non-clinical disclaimer.
- **Live worker smoke:** mark with `#[ignore]` so `cargo test` stays fast and
  offline; run explicitly with `cargo test -- --ignored`. It asserts the real
  worker produces `model_type == "xgboost"` (proves venv-first Python resolution).

When you change a Rust function signature that a test calls (e.g. threading
`&Marketplace` into `run_experiment`), update the test in the same change — a
broken test fixture is a broken build.

## Frontend

There is no JS test runner yet. The gate is `npm run build` (`tsc` strict +
vite). Before claiming a frontend change works:
- `npm run build` must be green (catches type errors, unused imports, bad
  `CSSProperties` casts on inline `--i`/`--len` style objects).
- Type checking verifies **code** correctness, not **feature** correctness. For
  UI behavior, run `npm run tauri dev` and exercise the flow in the window —
  state that you did, or say explicitly that you could not.

## Definition of done for a test change

- New worker path → its `test_*.py` covers the relevant contracts above, runs
  offline, and passes `python -m pytest -q`.
- New/changed Rust logic → a `cargo test -q` case, signatures updated so the
  suite compiles.
- `npm run build` green if any frontend file changed.
- No test writes outside `tmp_path` / `temp_dir`; no test needs the network.
