"""CLI entrypoint for the DocLab training worker.

Usage:
    python -m doclab_worker --help
    python -m doclab_worker --job <path/to/plan.json>

M0 ships only the CLI skeleton. Training (load -> preprocess -> split ->
train -> metrics.json) is implemented in M2.
"""

import argparse
import sys


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


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.job is None:
        parser.print_help()
        return 0

    print(
        f"doclab_worker: received job '{args.job}', but training is not "
        "implemented until milestone M2.",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
