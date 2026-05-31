# DocLab — Milestones & Progression

_Build roadmap for the hackathon MVP. Source of truth for scope: [spec.md](./spec.md). Demo flow: [DEMO.md](./DEMO.md)._

This document breaks the build into ordered milestones. Each milestone is **independently
testable**, but **only M5+ is demo-able to judges** — M0–M4 are horizontal plumbing with no
standalone story. Each has explicit **exit criteria**; do not advance until they're met.
When in doubt, deepen Phase 1 (M0–M8) rather than starting image/text.

## Legend

- **Status:** ☐ not started · ◐ in progress · ☑ done
- **P0** = must-have for judging · **P1** = should-have · **P2** = nice-to-have
- **🔒 = judge-pass minimum** (the hard gate below); everything else is polish that improves the
  story but is the first thing cut under time pressure.
- "Contract" = a fixed artifact/schema other layers depend on; do not change unilaterally.

## Dependency graph (high level)

```
M0 scaffold ─┬─> M1 marketplace ─┐
             ├─> M2 worker(tabular) ─┐
             └─> M3 rust+sqlite ─────┼─> M5 E2E tabular ─> M6 card ─> M7 history ─> M8 harden
                  M4 ui shell ───────┘                                              │
                                                              M9 image ──> M10 text ┘ (P1/P2)
                                                                          M11 demo dry-run
```

M1, M2, M4 can be built in parallel once M0 lands. M5 is the integration gate for Phase 1.

---

## 🔒 Judge-pass minimum (the real hard gate)

DEMO.md needs **one clean loop + one readable card + a working fallback** — nothing more. Treat
this short list as the only true must-have. Everything else (full card template polish, best-run
logic, broad hardening, stretch phases) is *polish-grade* and is the first thing cut under time.

Judge-pass = **M0 + M1 + M2 + M3 + M4 + M5 + minimal model card (M6 subset) + one history row
(M7 subset) + Fallback A (M8 subset)**. If you have only this, you can still demo and pass.

**Timebox kill-switches (set absolute clock times on day 1):**
- If **M5 (E2E gate) is not green by T-36h**, freeze scope: finish judge-pass minimum only, drop
  all polish backlog.
- If **M8 is not complete by T-24h**, **lock out M9/M10** (no image/text) and spend remaining
  time on rehearsal + fallbacks (M11).
- If a stretch path (M9 or M10) is not demo-able by **T-6h**, cut it from the live script and keep
  it as "coming soon" UI only.

> Fill in real clock times once the hackathon end time is known, e.g. "T-24h = Sat 10:00".

---

# Phase 1 — Tabular (P0, must-have)

The golden demo path: type goal → approve plan → train XGBoost locally → accuracy + baseline
+ model card. Everything here is required for judging.

## M0 — Repo scaffold & toolchain ☑ (P0)

Stand up the three runtimes so later milestones have somewhere to land.

- [x] `src/` — Tauri + React + Tailwind app boots to a blank Home screen (`npm run tauri dev`).
- [x] `worker/` — Python package `doclab_worker` with `__main__.py`, venv, `requirements.txt`
      (pandas, scikit-learn, xgboost to start).
- [x] Rust side (`src-tauri/`) compiles and can shell out to a dummy `python -m doclab_worker`.
- [x] `marketplace/datasets.yaml` exists (can be empty list).
- [x] Decide + document data root: `~/.doclab/` vs `./doclab/` (spec open decision → recommend `~/.doclab/`).
- [x] **Seed fallback bundle** — committed at `demo/seed_experiment/` with sample
      `plan.json` / `metrics.json` / `model_card.md` (per DEMO.md Fallback B). _Deviation: `demo/`
      not runtime `experiments/_demo_seed/`, which is gitignored._ De-risks integration early and
      gives M11 something to point at from day one. Refine as real artifacts firm up.
- [x] Root `.gitignore` covers `node_modules/`, `.venv/`, `target/`, `dist/`, `doclab/`, `*.db`.

**Exit:** `npm run tauri dev` opens a window; `python -m doclab_worker --help` runs; Rust build green.

## M1 — Dataset marketplace ☑ (P0) — depends on M0

The curated index the agent is allowed to choose from. **No live HF search ever.**

- [x] Define `datasets.yaml` schema (one entry per dataset) — **contract**:
      `id, name, hf_id, revision, description, category, data_type, task_types[], modality,
      license, size, label_column, limitations`.
- [x] Add **1–2 real tabular** datasets with binary label + pinned `revision` (replace spec placeholders).
      _`imodels/diabetes-readmission` @ `191ab1f0…`, label `readmitted`._
- [x] Loader: parse YAML → validate required fields → expose query API (keyword + `data_type`/`task_type` filter).
      _`src-tauri/src/marketplace.rs`; fails loud on missing field or unpinned `main`._
- [x] Mirror index into SQLite `datasets` table on startup (idempotent upsert).
      _`src-tauri/src/db.rs`; `~/.doclab/doclab.db`, verified no dupes on re-run._
- [x] Unit test: query "readmission" returns the tabular dataset; unknown id returns nothing.
      _6 tests green via `cargo test`._

**Exit:** a query call returns a ranked list of curated datasets; agent can only see these ids.

## M2 — Tabular training worker ☑ (P0) — depends on M0, M1

The Python engine. JSON in (`plan.json`) → JSON out (`metrics.json`). **Contract-critical.**

- [x] `python -m doclab_worker --job <plan.json>` reads plan, writes `metrics.json` beside it.
- [x] Load dataset from local HF cache (download once to `datasets/<id>/`, pinned revision).
      _`local_csv` mode added for offline fixture tests._
- [x] Preprocess: handle missing values, encode categoricals, separate `label_column`.
- [x] Split 80/10/10 with **fixed seed** (record seed in metrics).
- [x] Train XGBoost classifier; fallback to sklearn LogisticRegression if XGBoost errors.
      _macOS needs `brew install libomp` for XGBoost; documented in worker/README._
- [x] Compute test **accuracy** + **majority-class baseline accuracy**.
- [x] Emit `metrics.json` — **contract**: `schema_version:1, primary_metric, metric_value,
      baseline_metric, device:"cpu", seed, split, n_train/n_val/n_test, model_type, framework`.
- [x] Worker exits non-zero with a JSON error blob on failure (Rust needs to detect this).
      **Error contract** (write to `error.json` beside the plan + echo to stderr):
      `{ "schema_version": 1, "code": "<machine_slug>", "message": "<human text>",
      "stage": "load|preprocess|train|eval|write", "device_fallback": false }`.
      `code` values are a closed set: `dataset_missing`, `bad_plan`, `train_failed`,
      `oom`, `unknown`.
- [x] Test on a tiny fixture CSV: deterministic accuracy across two runs (seed works).
      _4 pytest tests green; real smoke: accuracy 0.643 > baseline 0.539._

**Exit:** run worker by hand on a sample plan → valid `metrics.json` with accuracy + baseline.

## M3 — Rust orchestration & SQLite ☑ (P0) — depends on M0

The Rust shell owns jobs, file paths, and the experiment database.

- [x] Create data root + subdirs on first run: `doclab.db`, `datasets/`, `experiments/`.
- [x] SQLite schema: 19-column `experiments` table (wide schema avoids ALTER churn; includes
      `id, created_at_ms, updated_at_ms, status, goal_text, dataset_id, primary_metric,
      metric_value, baseline_metric, model_type, framework, device, plan_path, metrics_path,
      error_path, model_card_path, worker_stdout, worker_stderr, error_code, error_message`).
      Deferred: `is_best` (M7), `checkpoint_path` (not needed for tabular).
- [x] Job runner: write `plan.json` to `experiments/<id>/`, spawn worker via venv-first Python
      resolution (`DOCLAB_PYTHON` → `worker/.venv/bin/python` → `python3`), capture stdout/stderr.
- [x] Detect worker success (exit 0 + valid `metrics.json` with `schema_version:1`) vs failure
      (non-zero + `error.json` blob or stderr).
- [x] Read `metrics.json` back, insert/update `experiments` row (`running → complete/failed`).
- [x] Tauri commands exposed to the frontend: `create_plan`, `run_experiment`, `list_experiments`, `get_experiment`.
- [x] Generate unique experiment ids: `exp_<unix_ms>_<8-char-random>` via `uuid` crate; collision-tested.

**Exit:** a Tauri command kicks off the worker and a finished run lands as a SQLite row + files on disk.

**Evidence:** `cargo test -q` → 11 passed (6 marketplace, 5 experiments); ignored worker smoke
test → green, asserts `model_type == "xgboost"` (venv-first Python works); `npm run build` → 47 modules.

## M4 — UI shell & screens ☐ (P0) — depends on M0 (mock data ok until M5)

The five minimal screens from the spec. Clinical-intent copy only — never "XGBoost"/"LoRA" in primary flow.

- [ ] **Home** — goal textarea + example chips ("Predict readmission risk", "Classify medical images…").
- [ ] **Plan review** — dataset card, task, **model family shown only as a secondary detail**
      (lay wording in the primary line, e.g. "a decision-tree model" / "an image recognizer";
      keep "XGBoost"/"CNN"/"LoRA" out of headline copy — see invariants), the
      *"approved public data only"* warning, a confirm checkbox, and **Start prototype** button.
- [ ] **Training** — progress steps (Loading data → Training → Evaluating) + optional log tail.
- [ ] **Results** — big metric, one-line sanity message, **Open model card**, **View experiment**.
- [ ] **History** — table of past runs (goal, dataset, metric, date); current session highlighted.
- [ ] Routing/state between the five screens; wire to Tauri commands (mocked responses acceptable here).
- [ ] Global footer/banner disclaimer: *research & prototyping only — not for clinical care*.

**Exit:** click through all five screens with mock data; copy uses intent language; disclaimer visible.

## M5 — End-to-end tabular loop ☐ (P0, 🔒 INTEGRATION GATE) — depends on M1, M2, M3, M4

Wire the agent together so a typed goal produces a real trained model. **This is the Phase 1 gate.**

- [ ] **Agent parse goal** → `intent.json` (task type, modality, metric hint). Rule-based is fine;
      optional LLM call only for parsing (see spec Option A/B). Dataset choice **constrained to curated ids**.
- [ ] **Agent select + profile dataset** → `dataset_selection.json` + `data_profile.json`
      (schema, label column, row count, missing %).
- [ ] **Agent emit plan** → `plan.json` (**contract**: `schema_version:1`, model, preprocessing,
      split, seed, metric, device, + human-readable summary) and render it on Plan review.
      Rust must reject a plan whose `schema_version` it doesn't recognize (fail loud, not silent).
- [ ] On approve → real worker run (M2) → real metrics → real SQLite row (M3) → Results screen.
- [ ] Replace all mock data in M4 with live Tauri calls.
- [ ] Error path: worker failure shows a friendly message, not a crash; experiment marked failed.

**Exit (Phase 1 spec exit criteria):** Type the readmission goal → approve plan → see test
accuracy + majority-class baseline on Results, end-to-end on a laptop in **< 5 min**.

## M6 — Model card generation ☑ (P0) — depends on M5

Auto-generate the doctor-facing markdown card from the run. Uses the spec template verbatim.

> **🔒 Judge-pass subset:** a readable card with result + baseline + the non-clinical disclaimer
> is enough to pass. The full template (all limitation/reproducibility sections) is polish.

- [x] **(🔒 minimum)** Render result + baseline + non-clinical disclaimer into `model_card.md`.
- [x] (polish) Full template per spec: Goal, Intended use, Summary (dataset/task/model/result),
      Limitations, Risks, Reproducibility (`hf_id@revision`, seed, split, hyperparams).
- [x] Inject **sanity check** into the card: if `metric_value ≈ baseline_metric`, add
      *"Model may not be learning signal."* _Triggers when `metric_value <= baseline + 0.02`._
- [x] Pull dataset-specific limitation line from the marketplace entry.
- [x] Always include the non-clinical disclaimer + "research/prototyping only".
- [x] In-app viewer renders the card; store `model_card_path` on the experiment row.
      _Card text also returned via `model_card_content` in `ExperimentDetail`; Results renders
      with `react-markdown` + `@tailwindcss/typography`._

**Exit:** every completed run has a readable `model_card.md` with result, baseline, limitations, risks.

## M7 — Experiment history & best run ☑ (P0) — depends on M5

The iteration story for judging.

> **🔒 Judge-pass subset:** one history row that reopens its saved results is enough. Best-run
> badging and cross-session persistence are polish.

- [x] **(🔒 minimum)** History screen lists runs from SQLite (goal, dataset, metric, date), newest first.
- [x] Click a row → reopen its Results + model card (read from stored paths).
      _Results reads everything from `get_experiment`; persisted card renders on reopen._
- [x] Within one goal session ("project"), mark highest `primary_metric` as `is_best = true`; show a badge.
      _`recompute_best_for_goal` groups by `goal_text` (Phase 1 has no project id); "Best" badge in Experiments._
- [x] History survives app restart (reads persisted DB, not session memory).
      _`~/.doclab/doclab.db`; added guarded `add_column_if_missing` migration for the new `is_best` column._

**Exit:** run two experiments → both appear in history → best is flagged → reopening shows saved results.

## M8 — Phase 1 hardening & demo safety ☑ (P0) — depends on M5, M6, M7

Make the golden path bulletproof for a live demo. Maps to spec "Success criteria".

- [x] **Pre-cache** the tabular dataset locally so the demo needs no download.
      _`worker/scripts/prefetch.py` caches tabular datasets into `~/.doclab/datasets/<id>/`; documented in DEMO.md._
- [x] Cap/seed everything so the run is deterministic and finishes in < 5 min on the demo laptop.
      _Fixed seed (42) end-to-end; real run on ~101k rows completes in ~2 min on CPU._
- [x] Friendly errors on every failure surface (no raw stack traces in UI).
      _`src/lib/errors.ts` maps the closed worker error-code set to calm copy; raw code/message/stderr
      moved behind a "Technical details" disclosure on Training + Results._
- [x] Verify all disclaimers present: Home warning, plan checkbox, model card risks.
      _Added the missing Home non-clinical warning under the goal input; Plan checkbox + card Risks already present._
- [x] Promote the M0 seed bundle into a real Fallback A: one pre-completed run visible in history.
      _`seed_demo_experiment()` (called at startup) copies `demo/seed_experiment/` into a `complete` row;
      bundle refreshed with real metrics (64% vs 54% baseline) + matching card._

> Rehearsal, MPS warmup, and the full fallback set (B/C) are **not** repeated here — they live in
> M11, which references the single demo checklist in [DEMO.md](./DEMO.md). M8 just ensures the app
> is *capable* of a clean run; M11 owns the dress rehearsal.

**Exit:** Phase 1 success criteria all checked; app produces a clean deterministic run on the demo laptop.

---

# Phase 2 — Image (P1, should-have)

Second demo path. Reuses the M5 loop; adds a PyTorch CNN worker and MPS device handling.
Do **not** start until Phase 1 (M0–M8) is solid.

## M9 — Image classification path ☑ (P1) — depends on M8

- [x] Add **1 curated image** dataset to `datasets.yaml` (2-class, small enough for laptop training).
      _`chest_xray_pneumonia` (NORMAL vs PNEUMONIA) was already curated; now wired end-to-end._
- [x] Extend worker: PyTorch CNN (simple ConvNet or small ResNet), short epoch budget.
      _`image.py`: TinyConvNet, 3 epochs, 64×64 grayscale, subsampled to 800 train / 200 test._
- [x] **Device selection** — use the spec's `resolve_device()`: `mps` on Apple Silicon else `cpu`.
      Record `device` in `plan.json` + `metrics.json`. _`device.py::resolve_device()`._
- [x] **MPS → CPU fallback**: catch MPS op errors once, retry job on `cpu`, log `device_fallback: true`.
      _Proven by `test_mps_failure_falls_back_to_cpu`._
- [x] Cap epochs so a demo run finishes in < 3–5 min; fixed seed.
      _Real MPS run completed in ~1 min; seed 42 throughout._
- [x] Sanity check: if training set **< 500 samples**, set `dataset_size_warning` → model card note
      *"Small dataset; high accuracy may reflect overfitting."* _Emitted as `warning`; folded into the card._
- [x] Agent routes image goals ("classify medical images as normal/abnormal") to this path.
      _`parser.ts` maps x-ray/image/scan → image modality; `create_plan` builds a CNN plan._
- [x] `metrics.json` reports test accuracy + `device`.
      _Real run: 76% accuracy vs 62.5% baseline on `device: mps`, `device_fallback: false`._

**Exit (spec Phase 2):** type an image-classification goal → approve → accuracy + small-data
warning in the model card; one MPS run verified on the demo Mac (with CPU fallback proven to work).

---

# Phase 3 — Text (P2, nice-to-have)

Third path. Transformers + PEFT LoRA on a small model. Highest risk on MPS — rehearse early or
fall back to CPU. Do **not** start until Phase 2 is demo-able.

## M10 — Text summarization path ☑ (P2) — depends on M9

- [x] Add **1 curated text** dataset with reference summaries (train/eval split, `summary` column).
      _`medical_text_summarization_synthetic` (Text→Summary, 1481 examples) wired end-to-end._
- [x] Extend worker: `transformers` + PEFT **LoRA** on a small model (100M–350M class), **no Unsloth**.
      _`text.py`: LoRA adapter on `t5-small` (q/v modules); plain transformers + peft, no Unsloth._
- [x] LoRA rank 8–16, 1–3 epochs; cap steps so the demo finishes in < 3–5 min; fixed seed.
      _rank 8, alpha 16, 1 epoch, subsampled to 200 train / 40 eval; seed 42; real run ~2 min on MPS._
- [x] Device: `mps` if available else `cpu`; `.to("mps")`; CPU fallback on op errors.
      _Shared `resolve_device()`; one-shot MPS→CPU fallback on both train and generate._
- [x] Metric: **ROUGE-L** (via `rouge-score`); labeled "similarity" in the card.
      _`_rouge_l()` fmeasure; card renders "ROUGE-L similarity 0.xx (0–1; higher = closer)"._
- [x] Model card: include **3 fixed example** input→summary pairs vs reference (qualitative only).
      _Worker emits `examples[]`; card renders an Examples section (input / model summary / reference)._
- [x] Agent routes summarization goals to this path.
      _`parser.ts` maps summarize/text/note/document → text modality; `create_plan` builds a LoRA plan._

**Exit (spec Phase 3):** "summarize medical education text" runs on a small model →
ROUGE-L + 3 examples in the card.

---

# Cross-cutting milestone

## M11 — Final demo rehearsal & fallbacks ◐ (P0) — depends on whatever phases shipped

Per [DEMO.md](./DEMO.md). Do this last, regardless of how far image/text got.

- [~] 15-min pre-demo checklist passes (app builds, dataset cached, power, notifications off).
      _Verified on dev machine: frontend build green, all 3 datasets cached in `~/.doclab/datasets/`.
      Power/notifications/laptop items are presenter-side._
- [ ] Golden tabular path rehearsed on the **presentation laptop** (not just dev machine). _Presenter._
- [x] For any deep-learning path shipped: one **MPS warmup** dry run so Metal is compiled.
      _Real MPS runs completed for both image (M9) and text (M10) — Metal kernels compiled on this machine._
- [x] Fallback A (training slow/fails): pre-completed run in history ready to open.
      _`seed_demo_experiment()` seeds a `complete` run at startup (M8)._
- [x] Fallback B (agent/plan fails): exported artifact bundle (`plan.json`/`metrics.json`/`model_card.md`).
      _`demo/seed_experiment/` holds a real, consistent bundle (64% vs 54% baseline)._
- [ ] Fallback C (app crash): slides/screenshots/GIF of the loop. _Presenter._
- [ ] 30-second pitch memorized; timing within 4–5 min live. _Presenter._

**Exit:** can deliver the demo end-to-end and recover gracefully from any single failure.

---

## Definition of "hackathon done" (mirrors spec success criteria)

- [ ] One complete tabular prototype loop with plan approval (M5)
- [ ] Curated marketplace, no live HF search in demo (M1)
- [ ] Experiment saved with metrics + model card (M6, M7)
- [ ] Sanity checks visible — baseline or small-data warning (M2, M6, M9)
- [ ] Clear non-clinical disclaimers in UI and model card (M4, M6)
- [ ] (Stretch) Image and/or text path working (M9, M10)
- [ ] Demo rehearsed with fallbacks (M11)

## Invariants that hold across every milestone

These are restated from the spec and CLAUDE.md — violating any of them is a regression:
- Agent may only select dataset ids that exist in the curated marketplace; never hallucinate one.
- Rust ↔ Python boundary is JSON files on disk (`plan.json` in, `metrics.json` out), not a live protocol.
- The six per-run artifacts keep fixed names: `intent.json`, `dataset_selection.json`,
  `data_profile.json`, `plan.json`, `metrics.json`, `model_card.md`.
- Frameworks stay in scope: tabular = XGBoost/sklearn, image = PyTorch, text = Transformers + LoRA.
- No private uploads, no EHR, no PHI, no clinical claims. Disclaimers everywhere.
- Every deep-learning run records `device` (`mps`/`cpu`) and `device_fallback` for reproducibility.
