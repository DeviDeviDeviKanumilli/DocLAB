# DocLab Worker

Python training worker. Invoked by the Rust shell as:

```bash
python -m doclab_worker --job <path/to/plan.json>
```

JSON in (`plan.json`) → JSON out (`metrics.json`), or `error.json` + non-zero exit on failure.
The tabular training engine landed in M2.

## Setup

```bash
cd worker
python3 -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

**macOS prerequisite for XGBoost:** `brew install libomp` (XGBoost needs the OpenMP runtime, or
its import fails with `libxgboost.dylib could not be loaded`). Without it the worker still runs
via the LogisticRegression fallback, but the intended path is XGBoost.

`--help` runs on the standard library alone (no venv needed for the M0 healthcheck).

## Running a job

```bash
python -m doclab_worker --job <path/to/plan.json>
```

On success, writes `metrics.json` beside the plan and exits 0. On failure, writes `error.json`
(closed-set `code` + `stage`), echoes it to stderr, and exits non-zero.

## Tests

```bash
.venv/bin/python -m pytest tests
```

## Runtime data

DocLab stores datasets and experiments under the data root **`~/.doclab/`**
(`doclab.db`, `datasets/<id>/`, `experiments/<id>/`). The Rust shell creates
this on first run (M3); the worker reads/writes paths handed to it via the plan.
