# M12 — Checkpoints + Try Prototype (Implementation Plan)

**Hand this file to Claude/Codex** to implement saved weights and a local inference path so users can test trained prototypes without retraining.

**Depends on:** M0–M10 (training loop shipped). **Does not** replace training; it extends it.

**Source of truth for contracts:** `Current/spec.md`, `CLAUDE.md`, `AGENTS.md`, `Current/TESTING.md`.

---

## Problem

Today DocLab trains locally but **discards model weights** when the Python worker exits. Users only keep `metrics.json` and `model_card.md`. There is **no UI or CLI** to run inference on a saved prototype.

**User requirement:** weights must **not** be trashed; users need a clear place to **try out** the model after training.

---

## Goal

1. Every successful train writes **`experiments/<id>/checkpoints/`** with loadable artifacts + `manifest.json`.
2. A **predict path** (worker CLI + Tauri command) loads those checkpoints and returns a result JSON.
3. A **Try prototype** UI on **Results** (primary) and **Models** (secondary) for local test inputs—with existing non-clinical disclaimers.

**Out of scope for M12 v1:** cloud inference, batch scoring, EHR/upload of patient data, clinical wording on outputs, retraining from Try screen.

---

## Where the user tests the model (UX — locked)

| Surface | Role |
|---------|------|
| **Results screen** (`src/screens/Results.tsx`) | **Primary.** After `status === "complete"` and checkpoint exists, show **Try this prototype** section. |
| **Models screen** (`src/screens/Models.tsx`) | **Secondary.** Each completed card: **Try** → navigate to Results with `experimentId` (+ optional `focusTry: true`). |
| **CLI** | `python -m doclab_worker --predict <predict_request.json>` — debugging and tests. |
| **Notebook** (optional) | `worker/notebooks/try_checkpoint.ipynb` — documentation only. |

**Do not** add a new top-level nav item unless Results feels crowded; prefer a section on Results first.

**Safety copy (required on Try UI):**

- Prototype only — not for diagnosis or treatment.
- Use only de-identified, synthetic, or public test inputs — not real patient data.

**Input methods:**

| Modality | Input | Notes |
|----------|--------|--------|
| Image | Tauri file dialog → local path | No cloud upload |
| Text | Textarea paste | Summarization = generation, not clinical advice |
| Tabular | JSON object of features (MVP) or defer with “coming soon” | Ship image + text first if time-boxed |

---

## Architecture

```
Training (existing)
  run_experiment → python -m doclab_worker --job plan.json
  → metrics.json + NEW checkpoints/*

Inference (new)
  UI "Run try" → invoke run_predict(experiment_id, input)
  → Rust writes predict_request.json under experiment dir
  → python -m doclab_worker --predict predict_request.json
  → prediction.json
  → Rust returns PredictionResult to UI
```

**Boundary:** JSON files on disk (same as `plan.json` / `metrics.json`). No live Python socket.

---

## On-disk layout (per experiment)

```
~/.doclab/experiments/<experiment_id>/
  intent.json
  dataset_selection.json
  data_profile.json
  plan.json
  metrics.json
  model_card.md
  checkpoints/
    manifest.json       # modality, model_type, class names, paths
    model.joblib        # tabular (xgboost / sklearn)
    preprocess.json     # tabular: column order / dummy schema for inference
    model.pt            # image: state_dict + img_size + n_classes
    adapter/            # text: PEFT adapter + tokenizer files
  predict_request.json  # written per try (ephemeral)
  prediction.json       # written per try (ephemeral)
```

---

## Contracts

### `checkpoints/manifest.json`

```json
{
  "schema_version": 1,
  "modality": "tabular|image|text",
  "model_type": "xgboost|logistic_regression|cnn|lora_t5_small",
  "framework": "xgboost|sklearn|pytorch|transformers",
  "label_column": "readmitted",
  "text_column": "Text",
  "classes": ["NORMAL", "PNEUMONIA"],
  "img_size": 64,
  "n_classes": 2
}
```

Omit fields not applicable to the modality.

### `metrics.json` extension (optional)

Add after train:

```json
"checkpoint_dir": "checkpoints"
```

### `predict_request.json` (input to `--predict`)

```json
{
  "schema_version": 1,
  "experiment_dir": "/absolute/path/to/.doclab/experiments/exp_...",
  "input": {
    "type": "image_path|text|tabular_json",
    "value": "/path/to/file.png"
  }
}
```

For `tabular_json`, `value` is a stringified JSON object of feature key → value.

### `prediction.json` (output from `--predict`)

```json
{
  "schema_version": 1,
  "modality": "image",
  "prediction": "PNEUMONIA",
  "confidence": 0.82,
  "detail": "Prototype label only.",
  "warning": "Not for clinical use."
}
```

Text modality: `prediction` = generated summary string; include `reference_note` that this is generation, not validation.

### `error.json` (predict failures)

Reuse worker error contract. Codes: `checkpoint_missing`, `bad_input`, `predict_failed`, `unknown`. Stages: `load|predict|write`.

---

## Phase A — Save checkpoints on train (required first)

**Without Phase A, nothing else works.**

### A1. Worker — tabular (`worker/doclab_worker/tabular.py`)

After `train()` + `evaluate()`:

- `checkpoints_dir = experiment_dir / "checkpoints"` (experiment dir = parent of `plan.json`; worker must know job dir — today `plan_path.parent`).
- `joblib.dump(model, checkpoints_dir / "model.joblib")`
- Save `preprocess.json`: label column, list of feature column names after `get_dummies` (or save fitted preprocessor — minimal approach: save training column list + dtypes hint).
- Write `manifest.json`.

**Note:** `run_job` in `__main__.py` must pass `plan_path.parent` into tabular/image/text `run_job` if not already available.

### A2. Worker — image (`worker/doclab_worker/image.py`)

After training:

- `torch.save({"state_dict": model.state_dict(), "img_size": IMG_SIZE, "n_classes": n_classes}, checkpoints_dir / "model.pt")`
- `manifest.json` with `classes` from dataset labels if available (NORMAL/PNEUMONIA for chest x-ray).

### A3. Worker — text (`worker/doclab_worker/text.py`)

After training:

- Save adapter + tokenizer under `checkpoints/adapter/`
- `manifest.json` with `text_column`, `label_column` (summary), `MODEL_NAME`.

### A4. Rust — `src-tauri/src/experiments.rs`

- After successful worker run, verify `experiment_dir/checkpoints/manifest.json` exists.
- `update_complete`: set `checkpoint_path` to relative `checkpoints` or absolute path string.

### A5. SQLite migration — `src-tauri/src/db.rs`

- `add_column_if_missing(conn, "experiments", "checkpoint_path", "TEXT")`
- Include in `ExperimentSummary` / `ExperimentDetail` with camelCase in JSON API.

### A6. TypeScript — `src/types/tauri.ts`

- `checkpointPath?: string | null` on experiment types.

### A7. Tests

- Tabular subprocess test: after `--job`, `checkpoints/model.joblib` exists.
- Image/text: in-process mocked train still writes manifest (lightweight).

**Exit Phase A:** Complete one train in app → `~/.doclab/experiments/<id>/checkpoints/manifest.json` exists.

---

## Phase B — Worker predict mode (CLI)

### B1. CLI (`worker/doclab_worker/__main__.py`)

```bash
python -m doclab_worker --predict <path/to/predict_request.json>
```

- Reads request, loads `manifest.json` from `experiment_dir/checkpoints/`.
- Dispatches to `tabular.predict`, `image.predict`, or `text.predict` (new modules or functions).
- Writes `prediction.json` next to request (or fixed name in experiment dir).
- Non-zero exit + `error.json` on failure.

### B2. Implement predict

| Modality | Load | Preprocess input | Output |
|----------|------|------------------|--------|
| Tabular | joblib + preprocess.json | JSON features → align columns → `model.predict_proba` | label + confidence |
| Image | model.pt | same transforms as train (`IMG_SIZE`, grayscale) | argmax class name |
| Text | adapter + tokenizer | prefix + user text | `model.generate` summary |

Use `resolve_device()` from `device.py` for image/text predict.

### B3. Tests (`worker/tests/test_predict_*.py`)

- Fixture checkpoint dir (tiny fake manifest + mock model) or train-then-predict integration behind `@pytest.mark.slow` if needed.
- Assert `prediction.json` schema.

**Exit Phase B:** CLI predict works on an experiment that completed Phase A.

---

## Phase C — Rust Tauri command

### C1. `run_predict` in `experiments.rs`

```rust
#[derive(Deserialize)]
pub struct PredictInput {
    pub input_type: String,  // image_path | text | tabular_json
    pub value: String,
}

#[tauri::command]
pub fn run_predict(experiment_id: String, input: PredictInput) -> Result<PredictionResult, String>
```

Steps:

1. Load experiment from SQLite; require `status == "complete"`.
2. Require `checkpoint_path` / manifest on disk.
3. Write `predict_request.json` under experiment dir.
4. Spawn `python -m doclab_worker --predict ...` (same `worker_python()` helper as train).
5. Parse `prediction.json`; return to frontend.
6. On failure, surface friendly message (reuse `friendlyError` patterns).

Register in `src-tauri/src/lib.rs`.

**Exit Phase C:** `invoke("run_predict", { experimentId, input })` returns prediction from devtools or a minimal test.

---

## Phase D — UI: Try prototype

### D1. Results (`src/screens/Results.tsx`)

When `detail.status === "complete"`:

- If `checkpointPath` / manifest exists → show **Try this prototype** card.
- If missing (old runs) → “Retrain this prototype to enable local try.”

**Image:**

- Button “Choose test image” → `@tauri-apps/plugin-dialog` `open` → path.
- “Run try” → `invoke("run_predict", ...)`.
- Show `prediction` + `confidence` + disclaimer.

**Text:**

- Textarea + “Run try” → predict → show generated text.

**Tabular (if time):**

- Textarea for JSON features + Run; else disabled with short note.

Loading state on button; errors via `lib/errors.ts`.

### D2. Models (`src/screens/Models.tsx`)

Add **Try** button on completed cards → `navigate("results", { experimentId, scrollToTry: true })`.

### D3. Optional route

Only if Results is too busy: add `try` to `Route` in `router.tsx` + `TryPrototype.tsx`. Prefer Results section for v1.

**Exit Phase D:** User trains image run → on Results, picks local file → sees prototype label.

---

## Phase E — Docs & demo

- `Current/TESTING.md` — predict CLI, contract keys, offline test pattern.
- `README.md` — one section: “Try a saved prototype.”
- `Current/DEMO.md` — optional 20s Try beat; use non-clinical test image.
- `Current/MILESTONES.md` — add M12 checklist (optional).
- `demo/seed_experiment/` — only if seed run is updated to include fake checkpoints OR document that seed has no try.

---

## Implementation order (do in this sequence)

1. **A** — tabular checkpoint save (+ pass experiment dir into worker).
2. **A** — image checkpoint save.
3. **B** — `--predict` for **image** only.
4. **C** — `run_predict` Tauri command.
5. **D** — Results Try UI (image).
6. **A** — text checkpoint save.
7. **B** — text predict.
8. **D** — text Try UI.
9. **A/B/D** — tabular predict + UI (or defer tabular Try).
10. **E** — docs + tests green.

**MVP time-box:** Phases A + B + C + D for **image only** = shippable “try my CNN.”

---

## Acceptance criteria (definition of done)

- [ ] New train runs create `checkpoints/manifest.json` (+ modality-specific files).
- [ ] `checkpoint_path` stored in SQLite and returned on `get_experiment`.
- [ ] Old experiments without checkpoints show friendly UI (no crash).
- [ ] User can select a **local** image on Results and receive `prediction.json` outcome in &lt; 60s typical.
- [ ] Text: paste → summary returned with non-clinical disclaimer.
- [ ] CLI: `python -m doclab_worker --predict ...` documented and works.
- [ ] `cargo test -q`, `cd worker && python -m pytest -q`, `npm run build` pass.
- [ ] No cloud/API keys required for predict.
- [ ] Copy never implies diagnosis or deployment to care.

---

## What NOT to do

- Store API keys or send user images to OpenAI for predict.
- Let LLM generate `plan.json` or hyperparameters in this milestone.
- Claim “FDA cleared” or “ready for clinic.”
- Batch upload of patient CSVs / DICOM from hospital systems.
- Block the UI thread for multi-minute predict (predict should be seconds; if slow, show spinner only).

---

## Files likely touched

| Path | Change |
|------|--------|
| `worker/doclab_worker/__main__.py` | `--predict`, pass job dir to train |
| `worker/doclab_worker/tabular.py` | save/load checkpoint |
| `worker/doclab_worker/image.py` | save/load checkpoint |
| `worker/doclab_worker/text.py` | save/load checkpoint |
| `worker/doclab_worker/predict.py` | NEW — dispatch predict |
| `worker/tests/test_predict_*.py` | NEW |
| `src-tauri/src/experiments.rs` | checkpoint_path, `run_predict` |
| `src-tauri/src/db.rs` | migration |
| `src-tauri/src/lib.rs` | register command |
| `src/types/tauri.ts` | types |
| `src/screens/Results.tsx` | Try section |
| `src/screens/Models.tsx` | Try button |
| `Current/TESTING.md`, `README.md`, `Current/DEMO.md` | docs |

---

## Codex / Claude kickoff prompt

Copy below into Agent mode:

```text
Implement M12 per Current/M12_PLAN.md:

1. Save checkpoints during train (tabular joblib + preprocess.json, image model.pt, text adapter) under experiments/<id>/checkpoints/ with manifest.json.
2. SQLite migration checkpoint_path; expose on ExperimentDetail.
3. Add doclab_worker --predict (predict_request.json → prediction.json).
4. Add Tauri run_predict command.
5. Add "Try prototype" on Results (image first, then text; tabular if time) with file dialog / textarea and disclaimers.
6. Tests + update Current/TESTING.md and README.md.

Follow CLAUDE.md contracts. Do not expand scope beyond M12_PLAN.md.
```

---

## References

- Training dispatch: `worker/doclab_worker/__main__.py` (`modality` from plan).
- CNN: `worker/doclab_worker/image.py` (`TinyConvNet`, `MAX_TRAIN`, etc.).
- Orchestration: `src-tauri/src/experiments.rs` (`run_experiment`, `create_plan`).
- UI flow: `src/screens/Plan.tsx` → `Training.tsx` → `Results.tsx`.
- Current DB: `src-tauri/src/db.rs` (`experiments` table — add `checkpoint_path` via `add_column_if_missing`).

---

*M12 closes the gap between “train a prototype” and “use the prototype once locally” without cloud inference.*
