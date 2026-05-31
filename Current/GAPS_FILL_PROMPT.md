# DocLab — Fill All Remaining Gaps (Claude/Codex Prompt)

**Copy everything below the line into Agent mode.** Do not re-implement M0–M10 or redo M12 core (checkpoints, `run_predict`, Results Try for image/text) — those already exist. This task closes **documented holes** only.

Read first: `CLAUDE.md`, `Current/M12_PLAN.md`, `Current/TESTING.md`, `Current/handoff.md`, `Current/MILESTONES.md`.

---

## Mission

Ship the **remaining gaps** so DocLab is demo-complete, test-covered, and docs-accurate:

1. **Tabular Try** on Results (replace “coming soon”)
2. **Models** screen → **Try** entry point
3. **Predict tests** in `worker/tests/`
4. **Demo seed** with minimal checkpoints (Fallback A can Try tabular or show honest message)
5. **Docs sync**: `MILESTONES.md` (M12 ☑), `handoff.md`, `Current/TESTING.md`
6. **Optional polish** (only if quick): `test_main.py` covers `--predict` help

**Do not:** cloud inference, patient uploads, LLM training, async training refactor, or scope creep from `Current/LLM_HYBRID_AGENT_PROMPT.md` unless env wiring is already broken.

---

## Current state (do not rebuild)

Already in tree:

- Train: tabular / image / text → `checkpoints/` + `manifest.json`
- `python -m doclab_worker --predict predict_request.json`
- Tauri `run_predict` in `experiments.rs` + `lib.rs`
- Results **Try this prototype**: image file picker + text textarea (`src/screens/Results.tsx`)
- Hybrid LLM: `src-tauri/src/agent_llm.rs`, `src/agent/index.ts` (env-gated)

**Gap:** Tabular Try UI, Models Try button, predict tests, seed checkpoints, milestone docs.

---

## Task 1 — Tabular Try on Results (P0)

**File:** `src/screens/Results.tsx`

When `detail.modelType` is `xgboost` or `logistic_regression` and `detail.checkpointPath` is set:

- Remove “Tabular prediction coming soon”.
- Add UI:
  - Short help: paste a JSON object of feature names → values (same schema as training after one-hot — document that users should mirror training columns or provide a minimal example).
  - **MVP simplification (preferred):** show 3–5 **example feature keys** from `data_profile.json` / experiment artifacts if available via `get_experiment` (extend Rust to include profile snippet OR read `data_profile.json` path if stored).
  - If profile not available in API, show static hint: “Use numeric/boolean fields matching the training dataset; missing keys default to 0” (matches `tabular.predict` behavior).
  - Textarea for JSON + **Run prediction** → `invoke("run_predict", { experimentId, input: { inputType: "tabular_json", value: "<stringified json>" } })`.
  - Render `prediction` + `confidence` + disclaimers (same card as image/text).

**Worker:** `worker/doclab_worker/tabular.py` already has `predict()` — verify `input.type` === `tabular_json` in `predict.py` dispatch (add if missing).

**Types:** `src/types/tauri.ts` — ensure `PredictInput` matches Rust.

**Exit:** Complete a tabular train → Results → paste minimal valid JSON → see class prediction.

---

## Task 2 — Models screen Try button (P1)

**File:** `src/screens/Models.tsx`

On each completed experiment card:

- Add button **Try** (secondary style).
- `navigate("results", { experimentId: exp.id, focusTry: true })`.

**File:** `src/screens/Results.tsx`

- If `params.focusTry === true`, scroll to Try section on mount (`useEffect` + ref on Try card) or `id="try-prototype"` + `scrollIntoView`.

**Exit:** Models → Try → lands on Results with Try section visible.

---

## Task 3 — Worker predict tests (P0)

**New files:** `worker/tests/test_predict.py` (or split by modality)

Follow `Current/TESTING.md`: **offline, fast**, monkeypatch heavy imports.

Minimum tests:

1. **Dispatch routing** — mock `tabular.predict` / `image.predict` / `text.predict`; `dispatch_predict` calls correct module for each manifest modality.
2. **Tabular predict** — tiny fake `checkpoints/` with minimal `manifest.json`, `preprocess.json`, and mock `model.joblib` (or mock `joblib.load` + `predict_proba`).
3. **Image predict** — mock `torch.load` + forward; assert `prediction.json` keys: `schema_version`, `modality`, `prediction`, `warning`.
4. **CLI** — `test_main.py` or `test_predict.py`: subprocess `--predict` with invalid request → non-zero exit + `error.json` with `checkpoint_missing` or `bad_input`.

Do **not** download HF or train real models in unit tests.

**Exit:** `cd worker && python -m pytest -q` all green including new tests.

---

## Task 4 — Demo seed checkpoints (P1)

**Goal:** Fallback A (`demo/seed_experiment/`) supports Try without a live train.

**Approach (pick one):**

**A (preferred):** Add minimal synthetic checkpoint files under `demo/seed_experiment/checkpoints/`:

- `manifest.json` for tabular xgboost (match seed `plan.json` modality)
- `preprocess.json` with tiny column list
- `model.joblib` — train once locally on `worker/tests/fixtures/tiny.csv` via a one-off script `worker/scripts/build_seed_checkpoint.py` (commit the generated files OR document script in README)

**B:** If binary too large for git, add `worker/scripts/build_seed_checkpoint.py` and document in `README.md` + `Current/DEMO.md`: “run once before demo to populate seed checkpoints”.

**Rust:** `experiments.rs` seed/bootstrap path already checks for `checkpoints/manifest.json` — ensure copied seed bundle includes `checkpoint_path` when manifest exists.

**Exit:** Fresh install → Experiments shows seed run → Results → Try works for tabular (or documented one-command setup).

---

## Task 5 — Documentation sync (P0)

### `Current/MILESTONES.md`

Add section:

## M12 — Checkpoints + Try prototype ☑ (P0)

Checklist (mark ☑ as you verify):

- [ ] Checkpoints on train (all modalities)
- [ ] `--predict` CLI + `run_predict`
- [ ] Results Try: image, text, **tabular**
- [ ] Models → Try navigation
- [ ] `worker/tests/test_predict.py`
- [ ] Seed/demo checkpoint story documented

### `Current/handoff.md`

Update “Where things stand”:

- M12 done (list what shipped)
- M11 still presenter rehearsal
- How to Try: Results after complete run; `~/.doclab/experiments/<id>/checkpoints/`
- Tabular/image/text Try all work after **new** train
- Optional LLM: `DOCLAB_AGENT_MODE`, keys in env (Rust only)

### `Current/TESTING.md`

Add subsection **Predict / Try path**:

- `predict_request.json` / `prediction.json` contract
- Example CLI one-liner
- Note: unit tests mock inference; live try = manual or `cargo test --ignored` if added

### `README.md`

Ensure “Try a saved prototype” matches Tasks 1–2 (tabular included).

**Do not** edit `Archived_Plans/`.

---

## Task 6 — Verification gate (required before done)

Run and report in commit message / PR description:

```bash
npm run build
cd src-tauri && cargo test -q
cd worker && python -m pytest -q
```

Manual smoke (document in PR notes):

1. Tabular golden path: goal → train → Results → Try JSON → prediction shown.
2. Image: choose local file → prediction shown (if MPS slow, OK).
3. Models → Try → scroll to Try section.
4. Seed experiment (if checkpoints committed): Try works offline.

---

## Contracts (do not break)

- Agent only uses curated `marketplace/datasets.yaml` ids.
- Rust ↔ Python: JSON files only.
- Disclaimers on Try UI: research only, no real patient data.
- `schema_version: 1` on predict request/response.
- No API keys in frontend bundle.

---

## Files likely touched

| Path | Change |
|------|--------|
| `src/screens/Results.tsx` | Tabular Try + focusTry scroll |
| `src/screens/Models.tsx` | Try button |
| `worker/doclab_worker/predict.py` | Ensure `tabular_json` type |
| `worker/tests/test_predict.py` | NEW |
| `worker/tests/test_main.py` | predict CLI edge case |
| `demo/seed_experiment/checkpoints/` | NEW (or build script) |
| `worker/scripts/build_seed_checkpoint.py` | optional NEW |
| `Current/MILESTONES.md` | M12 section |
| `Current/handoff.md` | refresh |
| `Current/TESTING.md` | predict docs |
| `README.md` | tabular try |

---

## Out of scope (explicitly skip)

- Background/async `run_experiment`
- Full-dataset training (remove `MAX_TRAIN` caps)
- New datasets in marketplace
- Jupyter notebook (unless 15 min left)
- Implementing LLM hybrid from scratch (already exists)
- CUDA packaging in Tauri bundle

---

## Definition of done

- [ ] No “coming soon” for tabular Try on completed tabular runs with checkpoint.
- [ ] Models screen has Try → Results.
- [ ] `pytest` includes predict tests; all green.
- [ ] M12 reflected in MILESTONES + handoff accurate.
- [ ] `npm run build` + `cargo test -q` pass.
- [ ] User can answer: “Where do I test the model?” → **Results → Try this prototype** (all three modalities after new train).

---

## One-shot kickoff (paste into Claude Code)

```text
Fill all DocLab gaps per Current/GAPS_FILL_PROMPT.md.

Do NOT re-implement M0–M10 or redo existing M12 core (checkpoints, run_predict, image/text Try).

DO implement:
1. Tabular Try on Results (wire to existing tabular.predict + run_predict)
2. Models screen Try button + focusTry scroll on Results
3. worker/tests/test_predict.py (offline mocks per TESTING.md)
4. Demo seed checkpoints OR build_seed_checkpoint.py + DEMO.md note
5. Sync Current/MILESTONES.md (M12), handoff.md, TESTING.md, README.md

Run npm run build, cargo test -q, pytest -q before finishing. Minimize diff scope; match existing UI patterns and disclaimers.
```

---

*This prompt closes the gap between “M12 mostly landed” and “demo-complete with tests and docs.”*
