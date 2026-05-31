"""CLI entrypoint for the DocLab training worker.

Usage:
    python -m doclab_worker --help
    python -m doclab_worker --job <path/to/plan.json>

Reads a plan.json, runs the tabular pipeline, and writes `metrics.json`
beside the plan on success — or `error.json` + non-zero exit on failure.
"""

import argparse
import json
import sys
from pathlib import Path

from . import tabular
from .errors import WorkerError, write_error_json


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="doclab_worker",
        description="DocLab training worker: reads a plan.json, writes metrics.json.",
    )
    parser.add_argument(
        "--job",
        metavar="PLAN_JSON",
        help="Path to a plan.json describing the training job.",
    )
    return parser


def data_root() -> Path:
    root = Path.home() / ".doclab"
    root.mkdir(parents=True, exist_ok=True)
    return root


def run_job(plan_path: Path) -> dict:
    """Dispatch to the right training engine based on the plan's modality.

    Tabular is the default; image plans route to the PyTorch CNN path. Both
    return a metrics dict; image runs may add `device_fallback` and `warning`.
    """
    plan = tabular.load_plan(plan_path)
    modality = (plan.get("modality") or plan.get("data_type") or "tabular").lower()

    if modality == "image":
        from . import image

        return image.run_job(plan, data_root())

    if modality == "text":
        from . import text

        return text.run_job(plan, data_root())

    df = tabular.load_data(plan, data_root())
    X, y = tabular.preprocess(df, plan.get("label_column", ""))
    splits = tabular.split(X, y, plan["split"], plan["seed"])
    (X_tr, y_tr), _, (X_te, y_te) = splits
    model, model_type, framework = tabular.train(X_tr, y_tr, plan["seed"])
    accuracy, baseline = tabular.evaluate(model, X_te, y_te)
    return tabular.build_metrics(
        plan, accuracy, baseline, splits, model_type, framework
    )


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.job is None:
        parser.print_help()
        return 0

    plan_path = Path(args.job)
    job_dir = plan_path.parent
    metrics_path = job_dir / "metrics.json"
    error_path = job_dir / "error.json"

    try:
        metrics = run_job(plan_path)
    except WorkerError as err:
        write_error_json(error_path, err)
        return 1
    except Exception as e:  # never crash without honoring the error contract
        write_error_json(error_path, WorkerError("unknown", "train", str(e)))
        return 1

    try:
        metrics_path.write_text(json.dumps(metrics, indent=2))
    except OSError as e:
        write_error_json(
            error_path, WorkerError("unknown", "write", f"cannot write metrics: {e}")
        )
        return 1

    print(f"wrote {metrics_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
