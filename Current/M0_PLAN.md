# M0 — Repo Scaffold & Toolchain (Detailed Plan)

## Context

DocLab is docs-only today. M0 is the first code milestone in `Current/MILESTONES.md`: stand up
the three runtimes (React/Tauri frontend, Rust orchestration shell, Python worker) so M1–M5 have
somewhere to land. M0 ships **no ML logic** — it only proves the plumbing: the app window opens,
Rust can shell out to the Python worker, and the worker runs. Exit criteria from MILESTONES:
`npm run tauri dev` opens a window; `python -m doclab_worker --help` runs; Rust build is green.

Toolchain verified on this machine: Node v26, npm 11, Rust 1.95, Python 3.13, Xcode CLT.

## Key decisions (resolved before coding)

- **Data root:** `~/.doclab/` (per MILESTONES). M0 only *documents* it (in `worker/README.md`);
  directory creation is deferred to M3.
- **Layout:** `create-tauri-app` (react-ts) generates `src/` (React) + `src-tauri/` (Rust) at repo
  root — matches the README target layout. Scaffolded into a temp dir and copied app files in,
  preserving the existing `README.md` and writing a merged root `.gitignore`.
- **Tailwind v4** via the `@tailwindcss/vite` plugin + `@import "tailwindcss";` — no
  `tailwind.config.js` needed.
- **Seed fallback bundle location:** committed at `demo/seed_experiment/` (NOT runtime
  `doclab/experiments/`, which is gitignored). MILESTONES says `experiments/_demo_seed/`; a
  committed fallback must survive in git, so it lives in `demo/`. Intentional deviation.
- **Rust→Python shell-out:** `std::process::Command` (no extra plugin). Resolves the worker dir via
  `env!("CARGO_MANIFEST_DIR")/../worker`. `--help` runs on stdlib only, so system `python3` suffices.

## Target tree after M0

```
DocLAB/
├── src/                      # React + TS frontend
│   ├── App.tsx               # Home: title + disclaimer + "Check worker" button
│   ├── main.tsx, index.css   # index.css uses @import "tailwindcss";
├── src-tauri/                # Rust shell
│   ├── src/lib.rs            # commands: greet (smoke), worker_healthcheck
│   ├── src/main.rs, Cargo.toml, tauri.conf.json, build.rs, icons/
├── worker/
│   ├── doclab_worker/__init__.py
│   ├── doclab_worker/__main__.py   # argparse: --help and --job (stub) only
│   ├── requirements.txt      # pandas, scikit-learn, xgboost (unused until M2)
│   └── README.md             # venv + run instructions + data-root note
├── marketplace/datasets.yaml # empty list: `datasets: []`
├── demo/seed_experiment/     # committed Fallback B bundle (plan/metrics/model_card placeholders)
├── package.json, vite.config.ts, tsconfig.json, index.html
├── .gitignore                # node_modules, .venv, target, dist, doclab/, *.db
└── (existing docs unchanged: README.md, CLAUDE.md, AGENTS.md, Current/, Archived_Plans/)
```

## Implementation steps

1. Scaffold frontend+shell with `create-tauri-app` (react-ts, npm); move app files to root,
   preserve `README.md`, write merged `.gitignore`.
2. Tailwind v4: install `tailwindcss @tailwindcss/vite`; add plugin to `vite.config.ts`;
   `src/index.css` = `@import "tailwindcss";`, imported from `main.tsx`.
3. Rust `worker_healthcheck` command in `lib.rs` running `python3 -m doclab_worker --help` from
   `<manifest>/../worker`; registered in `invoke_handler`.
4. Frontend: minimal Home (title, non-clinical disclaimer banner, "Check worker" button invoking
   the command). Real screens are M4.
5. Python worker package: `doclab_worker/__main__.py` (argparse `--help` + `--job` stub),
   `requirements.txt`, `worker/README.md`.
6. `marketplace/datasets.yaml` (`datasets: []`); `demo/seed_experiment/` placeholders; data-root
   note in `worker/README.md`.
7. `.gitignore` covers build/runtime dirs; run verification.

## Critical files

- `src-tauri/src/lib.rs` — only non-generated Rust logic (healthcheck command).
- `worker/doclab_worker/__main__.py` — worker entrypoint contract (`python -m doclab_worker`).
- `vite.config.ts` + `src/index.css` — Tailwind v4 wiring.
- `.gitignore` — excludes build/runtime dirs before the first scaffold commit.

## Verification (M0 exit criteria) — all passed

1. `cargo build` in `src-tauri/` → green (`doclab v0.1.0` compiled).
2. `python3 -m doclab_worker --help` from `worker/` → prints usage, exits 0.
3. `npm run tauri dev` → Vite ready on :1420, Rust compiled, `Running target/debug/doclab`
   (window launched). "Check worker" button invokes the Rust→Python bridge.
4. `git status` / `git check-ignore` → `node_modules`, `dist`, `target`, `doclab/` excluded.

## Out of scope (deferred)

- SQLite schema / data-root creation → M3. Dataset entries → M1. ML training → M2. Real UI
  screens, routing, disclaimers polish → M4. Worker venv/dependency install is documented but not
  executed in M0.
