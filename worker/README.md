# DocLab Worker

Python training worker. Invoked by the Rust shell as:

```bash
python -m doclab_worker --job <path/to/plan.json>
```

JSON in (`plan.json`) → JSON out (`metrics.json`). Training logic lands in M2;
M0 ships only the package skeleton + CLI.

## Setup

```bash
cd worker
python3 -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

`--help` runs on the standard library alone (no venv needed for the M0 healthcheck).

## Runtime data

DocLab stores datasets and experiments under the data root **`~/.doclab/`**
(`doclab.db`, `datasets/<id>/`, `experiments/<id>/`). The Rust shell creates
this on first run (M3); the worker reads/writes paths handed to it via the plan.
