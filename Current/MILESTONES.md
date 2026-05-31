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

## M1 — Dataset marketplace ☐ (P0) — depends on M0

The curated index the agent is allowed to choose from. **No live HF search ever.**

- [ ] Define `datasets.yaml` schema (one entry per dataset) — **contract**:
      `id, name, hf_id, revision, description, category, data_type, task_types[], modality,
      license, size, label_column, limitations`.
- [ ] Add **1–2 real tabular** datasets with binary label + pinned `revision` (replace spec placeholders).
- [ ] Loader: parse YAML → validate required fields → expose query API (keyword + `data_type`/`task_type` filter).
- [ ] Mirror index into SQLite `datasets` table on startup (idempotent upsert).
- [ ] Unit test: query "readmission" returns the tabular dataset; unknown id returns nothing.

**Exit:** a query call returns a ranked list of curated datasets; agent can only see these ids.

## M2 — Tabular training worker ☐ (P0) — depends on M0, M1

The Python engine. JSON in (`plan.json`) → JSON out (`metrics.json`). **Contract-critical.**

- [ ] `python -m doclab_worker --job <plan.json>` reads plan, writes `metrics.json` beside it.
- [ ] Load dataset from local HF cache (download once to `datasets/<id>/`, pinned revision).
- [ ] Preprocess: handle missing values, encode categoricals, separate `label_column`.
- [ ] Split 80/10/10 with **fixed seed** (record seed in metrics).
- [ ] Train XGBoost classifier; fallback to sklearn LogisticRegression if XGBoost errors.
- [ ] Compute test **accuracy** + **majority-class baseline accuracy**.
- [ ] Emit `metrics.json` — **contract**: `schema_version:1, primary_metric, metric_value,
      baseline_metric, device:"cpu", seed, split, n_train/n_val/n_test, model_type, framework`.
- [ ] Worker exits non-zero with a JSON error blob on failure (Rust needs to detect this).
      **Error contract** (write to `error.json` beside the plan + echo to stderr):
      `{ "schema_version": 1, "code": "<machine_slug>", "message": "<human text>",
      "stage": "load|preprocess|train|eval|write", "device_fallback": false }`.
      `code` values are a closed set: `dataset_missing`, `bad_plan`, `train_failed`,
      `oom`, `unknown`.
- [ ] Test on a tiny fixture CSV: deterministic accuracy across two runs (seed works).

**Exit:** run worker by hand on a sample plan → valid `metrics.json` with accuracy + baseline.

## M3 — Rust orchestration & SQLite ☐ (P0) — depends on M0

The Rust shell owns jobs, file paths, and the experiment database.

- [ ] Create data root + subdirs on first run: `doclab.db`, `datasets/`, `experiments/`.
- [ ] SQLite schema (migrations). Start with a **minimal P0 schema** — only what M5–M7 read/write:
      `id, created_at, goal_text, dataset_id, primary_metric, metric_value, baseline_metric,
      model_card_path, plan_path`. **Defer** these until needed: `model_type, framework,
      dataset_size_warning, device, checkpoint_path, is_best` (add in M7/M9 via migration).
      A narrow first schema means fewer migration/debug surprises before the first E2E run.
- [ ] Job runner: write `plan.json` to `experiments/<id>/`, spawn worker, capture stdout/stderr.
- [ ] Detect worker success (exit 0 + valid `metrics.json`) vs failure (non-zero + error blob).
- [ ] Read `metrics.json` back, insert an `experiments` row.
- [ ] Tauri commands exposed to the frontend: `create_plan`, `run_experiment`, `list_experiments`, `get_experiment`.
- [ ] Generate unique experiment ids (timestamp + short random); never collide.

**Exit:** a Tauri command kicks off the worker and a finished run lands as a SQLite row + files on disk.

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

## M6 — Model card generation ☐ (P0) — depends on M5

Auto-generate the doctor-facing markdown card from the run. Uses the spec template verbatim.

> **🔒 Judge-pass subset:** a readable card with result + baseline + the non-clinical disclaimer
> is enough to pass. The full template (all limitation/reproducibility sections) is polish.

- [ ] **(🔒 minimum)** Render result + baseline + non-clinical disclaimer into `model_card.md`.
- [ ] (polish) Full template per spec: Goal, Intended use, Summary (dataset/task/model/result),
      Limitations, Risks, Reproducibility (`hf_id@revision`, seed, split, hyperparams).
- [ ] Inject **sanity check** into the card: if `metric_value ≈ baseline_metric`, add
      *"Model may not be learning signal."*
- [ ] Pull dataset-specific limitation line from the marketplace entry.
- [ ] Always include the non-clinical disclaimer + "research/prototyping only".
- [ ] In-app viewer renders the card; store `model_card_path` on the experiment row.

**Exit:** every completed run has a readable `model_card.md` with result, baseline, limitations, risks.

## M7 — Experiment history & best run ☐ (P0) — depends on M5

The iteration story for judging.

> **🔒 Judge-pass subset:** one history row that reopens its saved results is enough. Best-run
> badging and cross-session persistence are polish.

- [ ] **(🔒 minimum)** History screen lists runs from SQLite (goal, dataset, metric, date), newest first.
- [ ] Click a row → reopen its Results + model card (read from stored paths).
- [ ] Within one goal session ("project"), mark highest `primary_metric` as `is_best = true`; show a badge.
- [ ] History survives app restart (reads persisted DB, not session memory).

**Exit:** run two experiments → both appear in history → best is flagged → reopening shows saved results.

## M8 — Phase 1 hardening & demo safety ☐ (P0) — depends on M5, M6, M7

Make the golden path bulletproof for a live demo. Maps to spec "Success criteria".

- [ ] **Pre-cache** the tabular dataset locally so the demo needs no download.
- [ ] Cap/seed everything so the run is deterministic and finishes in < 5 min on the demo laptop.
- [ ] Friendly errors on every failure surface (no raw stack traces in UI).
- [ ] Verify all disclaimers present: Home warning, plan checkbox, model card risks.
- [ ] Promote the M0 seed bundle into a real Fallback A: one pre-completed run visible in history.

> Rehearsal, MPS warmup, and the full fallback set (B/C) are **not** repeated here — they live in
> M11, which references the single demo checklist in [DEMO.md](./DEMO.md). M8 just ensures the app
> is *capable* of a clean run; M11 owns the dress rehearsal.

**Exit:** Phase 1 success criteria all checked; app produces a clean deterministic run on the demo laptop.

---

# Phase 2 — Image (P1, should-have)

Second demo path. Reuses the M5 loop; adds a PyTorch CNN worker and MPS device handling.
Do **not** start until Phase 1 (M0–M8) is solid.

## M9 — Image classification path ☐ (P1) — depends on M8

- [ ] Add **1 curated image** dataset to `datasets.yaml` (2-class, small enough for laptop training).
- [ ] Extend worker: PyTorch CNN (simple ConvNet or small ResNet), short epoch budget.
- [ ] **Device selection** — use the spec's `resolve_device()`: `mps` on Apple Silicon else `cpu`.
      Record `device` in `plan.json` + `metrics.json`.
- [ ] **MPS → CPU fallback**: catch MPS op errors once, retry job on `cpu`, log `device_fallback: true`.
- [ ] Cap epochs so a demo run finishes in < 3–5 min; fixed seed.
- [ ] Sanity check: if training set **< 500 samples**, set `dataset_size_warning` → model card note
      *"Small dataset; high accuracy may reflect overfitting."*
- [ ] Agent routes image goals ("classify medical images as normal/abnormal") to this path.
- [ ] `metrics.json` reports test accuracy + `device`.

**Exit (spec Phase 2):** type an image-classification goal → approve → accuracy + small-data
warning in the model card; one MPS run verified on the demo Mac (with CPU fallback proven to work).

---

# Phase 3 — Text (P2, nice-to-have)

Third path. Transformers + PEFT LoRA on a small model. Highest risk on MPS — rehearse early or
fall back to CPU. Do **not** start until Phase 2 is demo-able.

## M10 — Text summarization path ☐ (P2) — depends on M9

- [ ] Add **1 curated text** dataset with reference summaries (train/eval split, `summary` column).
- [ ] Extend worker: `transformers` + PEFT **LoRA** on a small model (100M–350M class), **no Unsloth**.
- [ ] LoRA rank 8–16, 1–3 epochs; cap steps so the demo finishes in < 3–5 min; fixed seed.
- [ ] Device: `mps` if available else `cpu`; `use_mps_device`/`.to("mps")`; CPU fallback on op errors.
- [ ] Metric: **ROUGE-L** (via `rouge-score` or `evaluate`); label it "similarity" in UI if clearer.
- [ ] Model card: include **3 fixed example** input→summary pairs vs reference (qualitative only).
- [ ] Agent routes summarization goals to this path.

**Exit (spec Phase 3):** "summarize medical education text" runs on a small model →
ROUGE-L + 3 examples in the card.

---

# Cross-cutting milestone

## M11 — Final demo rehearsal & fallbacks ☐ (P0) — depends on whatever phases shipped

Per [DEMO.md](./DEMO.md). Do this last, regardless of how far image/text got.

- [ ] 15-min pre-demo checklist passes (app builds, dataset cached, power, notifications off).
- [ ] Golden tabular path rehearsed on the **presentation laptop** (not just dev machine).
- [ ] For any deep-learning path shipped: one **MPS warmup** dry run so Metal is compiled.
- [ ] Fallback A (training slow/fails): pre-completed run in history ready to open.
- [ ] Fallback B (agent/plan fails): exported artifact bundle (`plan.json`/`metrics.json`/`model_card.md`).
- [ ] Fallback C (app crash): slides/screenshots/GIF of the loop.
- [ ] 30-second pitch memorized; timing within 4–5 min live.

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
