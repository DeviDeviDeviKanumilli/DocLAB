# DocLab — Hackathon Spec

**DocLab** (Doctor Laboratory) is a **local-first healthcare ML prototyping lab**. A doctor or healthcare professional describes an AI idea in plain language; DocLab turns it into a trained prototype on **approved public datasets**—with a clear plan, metrics, experiment history, and a plain-language model card.

DocLab is **not** a clinical product. It does not diagnose, recommend treatment, or replace medical judgment. It helps professionals **explore and document** early ML ideas using safe, indexed data—without writing training code or picking frameworks by hand.

---

## Vision

Healthcare professionals often understand the **clinical problem** better than engineers do, but they may not know how to build a classifier, train a CNN, or fine-tune a language model. DocLab bridges that gap.

**Organize around clinical intent, not model names.**

| Doctor says | DocLab figures out |
|-------------|-------------------|
| Predict hospital readmission risk | Tabular classification → curated readmission dataset → XGBoost → accuracy + baseline |
| Classify medical images as normal or abnormal | Image classification → curated imaging dataset → CNN → accuracy + dataset size note |
| Summarize medical education text | Text summarization → curated text dataset → small LM + LoRA (Transformers) → similarity + example outputs |

The core loop:

```
Doctor describes goal
  → Agent parses intent & searches curated marketplace
  → Doctor reviews plan (one click)
  → Training runs locally
  → Metrics + experiment saved
  → Model card generated
```

---

## What we are NOT building (hackathon scope)

- Private patient uploads or hospital EHR integration
- PHI detection / compliance automation
- Clinical validation, diagnosis claims, or treatment recommendations
- Sharing layer, marketplace for users, or community features
- Autonomous “deploy to clinic” workflows
- Time-series models (post-hackathon)
- Unsloth / heavy GPU stacks (use Transformers + LoRA only for text)

---

## Product principles

1. **Clinical intent first** — UI and copy use goals (predict, classify, summarize), not “XGBoost” or “LoRA”.
2. **Approved data only** — Curated Hugging Face datasets that are public, synthetic, or clearly de-identified. Show a one-line warning before training: *Use only approved public datasets. Do not upload private patient data.*
3. **Trust through transparency** — Always show **why** (dataset, model, metric) in the plan before training.
4. **Prototyping language everywhere** — “Prototype complete”, “research use only”, limitations and risks on every model card.
5. **Reliable demos** — Agent searches a **curated** marketplace, not live HF search at runtime.

---

## System overview (four parts)

```
DocLab
├── ML Planning Agent     — goal → plan → orchestration → model card
├── Dataset Marketplace   — curated index + metadata (HF as source)
├── Training Engine       — Python workers (sklearn/XGBoost, PyTorch, Transformers)
└── Experiment Tracker    — SQLite + local folders, metrics, best run, history
```

**Stack (hackathon-friendly):**

| Layer | Choice |
|-------|--------|
| Desktop shell | Tauri |
| UI | React + Tailwind |
| Orchestration | Rust (jobs, SQLite, file paths) |
| ML | Python (single worker entrypoint, JSON in/out) |
| Metadata | SQLite (`doclab.db`) |
| Artifacts | Local folders under `~/.doclab/` or `./doclab/` |

---

## ML Planning Agent

The agent is the “ML engineer” for the doctor. For hackathon, keep behavior **predictable and staged**—not fully autonomous magic.

### Agent steps

1. **Parse goal** — Extract task type (`predict` | `classify` | `detect` | `summarize` | `generate`), likely modality (tabular | image | text), and metric hint.
2. **Search marketplace** — Keyword + metadata match against **curated** index only.
3. **Select dataset** — Rank by relevance, data type, label availability, license, size.
4. **Profile dataset** — Columns/features, label field, missingness, row count (light inspect).
5. **Choose model** — Map data + task to one family (see table below).
6. **Emit plan** — JSON + human-readable summary; **wait for user approval**.
7. **Run train/eval** — Delegate to Training Engine.
8. **Save experiment** — Write metrics, checkpoint path, settings.
9. **Generate model card** — Markdown from template + run data.

### Task → model mapping (MVP)

| Data | Task | Model | Framework |
|------|------|-------|-----------|
| Tabular | Predict / classify | XGBoost (fallback: logistic regression) | XGBoost / sklearn |
| Image | Classify | Small CNN (ResNet-style or simple ConvNet) | PyTorch |
| Text | Summarize / classify | Small pretrained LM + LoRA | Transformers only |

### Agent artifacts (fixed contract)

Every run produces the same files under `experiments/<id>/`:

| File | Purpose |
|------|---------|
| `intent.json` | Parsed goal, task type, modality |
| `dataset_selection.json` | Chosen dataset + rationale |
| `data_profile.json` | Schema, label column, row count, missing % |
| `plan.json` | Model, preprocessing, splits, metric (machine + human text) |
| `metrics.json` | Primary metric + sanity checks |
| `model_card.md` | Doctor-facing summary |

---

## Dataset Marketplace

**Hackathon approach:** Hand-curate **~10–15 datasets** (not open HF search).

- Import metadata from Hugging Face once (script or manual YAML).
- Store in SQLite + optional `datasets/index.json`.
- Agent only queries this index.

### Metadata per dataset

- Name, HF id, **pinned revision** (for reproducibility)
- Description, healthcare category
- Data type: `tabular` | `image` | `text`
- Task types supported
- Modality (e.g. vitals, chest x-ray, patient education text)
- License
- Size (rows / images / documents)
- **Label column** or label field name (explicit for tabular/text)
- Known limitations (1–2 sentences)

### Example curated sets (placeholders—replace with real HF ids)

| Modality | Example use | Notes |
|----------|-------------|--------|
| Tabular | Readmission / outcome classification | Binary label, sklearn-friendly |
| Image | Normal vs abnormal (or 2-class medical imaging) | Small enough for laptop train |
| Text | Summarization with reference summaries | Train/eval split with `summary` column |

---

## Training Engine

Single Python worker invoked by Rust: `python -m doclab_worker --job plan.json`.

**Responsibilities:** load dataset → clean/preprocess → train/val/test split → train → save checkpoint → return `metrics.json`.

### Framework scope (hackathon)

- **Tabular:** XGBoost (+ sklearn for baseline majority-class accuracy)
- **Image:** PyTorch CNN, short epoch budget for demo
- **Text:** `transformers` + PEFT LoRA on a **small** model (e.g. 100M–350M class), no Unsloth

### Training defaults (keep simple)

- Fixed seed for reproducibility
- 80/10/10 or 70/15/15 split
- Modest epochs / early stopping for images
- LoRA rank 8–16, 1–3 epochs for text demo

### Device selection (Mac / GPU)

Worker picks device once per job and records it in `plan.json` / `metrics.json`:

| Modality | Device | Notes |
|----------|--------|--------|
| Tabular | **CPU** | XGBoost/sklearn; no MPS benefit |
| Image (PyTorch) | **`mps` on Apple Silicon** if available, else `cpu` | CNN training |
| Text (Transformers + LoRA) | **`mps` on Apple Silicon** if available, else `cpu` | See MPS caveats below |

**Detection (Python):**

```python
def resolve_device(prefer_mps: bool = True) -> str:
    import torch
    if prefer_mps and torch.backends.mps.is_available():
        return "mps"
    return "cpu"
```

- PyTorch: `model.to(device)`, tensors on same device; for `mps`, use `torch.mps.empty_cache()` between heavy jobs if memory is tight.
- Transformers: `TrainingArguments(use_mps_device=True)` on recent versions, or `model.to("mps")` with `fp16` optional (test in rehearsal—`bf16` is not the default path on MPS).
- **Always fall back to CPU** if MPS errors (catch once, retry job on `cpu`, log `device_fallback: true` in metrics).

**MPS caveats (hackathon):**

- Rehearse on the **same MacBook**; MPS support varies by op (rare CNN failures → CPU fallback).
- First MPS run can be slow (compile/warmup); do one dry run before judging.
- Intel Mac: no MPS → CPU only.
- Store `device: "mps" | "cpu"` on every deep-learning experiment for reproducibility notes in the model card.

---

## Evaluation & experiments

### Primary metrics

| Modality | Primary metric |
|----------|----------------|
| Tabular / image classification | **Accuracy** |
| Text summarization | **ROUGE-L** (or single “similarity” score—document which in plan) |

### Sanity checks (no clinical eval)

**Tabular**

- Accuracy on test set
- **Majority-class baseline accuracy** (if model ≈ baseline, flag in model card: *“Model may not be learning signal.”*)

**Image**

- Test accuracy
- If training set **&lt; 500 samples** (configurable threshold): model card note — *“Small dataset; high accuracy may reflect overfitting.”*

**Text**

- ROUGE-L (or chosen similarity)
- **3 fixed example outputs** in model card (input snippet + model summary vs reference)—qualitative only, not clinical assessment

### Experiment record (SQLite)

- `id`, `created_at`, `goal_text`
- `dataset_id`, `model_type`, `framework`
- `primary_metric`, `metric_value`
- `baseline_metric` (tabular) or `dataset_size_warning` (image)
- `checkpoint_path`, `is_best` (per project/goal family optional for hackathon)
- Paths to `plan.json`, `model_card.md`

### Best model (simple)

For hackathon: within one “project” (same goal session), mark the run with highest primary metric as `is_best = true`.

---

## Model card (template)

Generated automatically; doctor-readable.

```markdown
# <Model Name>

**Goal:** <original doctor text>
**Intended use:** Research and prototyping only—not for clinical decisions.

## Summary
- **Dataset:** <name> (public / de-identified)
- **Task:** <e.g. binary classification>
- **Model:** <e.g. XGBoost classifier>
- **Result:** <e.g. 83% accuracy> (baseline: <X>% for tabular)

## Limitations
- Trained on a public prototype dataset; may not generalize to real hospitals.
- <Dataset-specific limitation>

## Risks
- Not validated for patient care. Do not use for diagnosis or treatment decisions.

## Reproducibility
- Dataset: `<hf_id>@<revision>`
- Seed, split ratio, hyperparameters: see `plan.json`

## Examples (text runs only)
<3 input/output pairs>
```

---

## User flow (hackathon demo)

1. Doctor opens DocLab → enters goal in a single text box.
2. Agent shows **Plan**: dataset, task, model, metric, 2–3 bullet “what will happen”.
3. Doctor clicks **Start prototype** (optional checkbox: “I understand this uses public data only”).
4. Progress: Loading data → Training → Evaluating.
5. Results screen: metric, sanity line, link to model card, “View experiment”.
6. Sidebar or tab: **Experiment history** for this session.

**Golden demo path (pick one for judging):** Tabular readmission-style classification end-to-end in &lt; 5 minutes on a laptop.

---

## Phased build (hackathon timeline)

Build in order; each phase is demo-able.

### Phase 1 — Skeleton + tabular (must-have)

- Tauri app shell, goal input, plan view, approve button
- Curated tabular dataset (1–2 entries in index)
- Python worker: XGBoost train + accuracy + majority baseline
- SQLite experiment + `model_card.md`
- **Exit criteria:** Type goal → approve plan → see accuracy + model card

### Phase 2 — Image (should-have)

- Add 1 curated image dataset + CNN worker
- Accuracy + small-dataset warning in card
- **Exit criteria:** Second demo path for “classify medical images…”

### Phase 3 — Text (nice-to-have)

- Add 1 text summarization dataset
- Transformers + LoRA, ROUGE-L + 3 examples in card
- **Exit criteria:** “Summarize medical education text” works on small model

If time runs short: **ship Phase 1 only** with UI that mentions image/text as “coming soon” but keep agent/modality logic in place.

---

## Local folder layout

```
doclab/
├── doclab.db                 # experiments + dataset index
├── datasets/
│   └── <dataset_id>/         # cached HF snapshot
├── experiments/
│   └── <experiment_id>/
│       ├── intent.json
│       ├── plan.json
│       ├── metrics.json
│       ├── model_card.md
│       └── checkpoints/
└── marketplace/
    └── datasets.yaml         # curated source of truth
```

---

## UI screens (minimal)

1. **Home / New prototype** — Goal text area + examples chips (“Predict readmission…”, “Classify images…”)
2. **Plan review** — Dataset card, model, metric, warnings, Start button
3. **Training** — Progress steps + log tail (optional)
4. **Results** — Big metric, sanity message, Open model card
5. **History** — Table of past runs (goal, dataset, metric, date)

---

## Agent implementation (hackathon)

Keep the agent simple—no need for a heavy multi-agent framework.

**Option A (fastest):** Rule-based parser + keyword search over `datasets.yaml`, with optional LLM call only for `intent.json` parsing if you have API budget.

**Option B:** Single LLM prompt that outputs strict JSON schema for intent + dataset id from a provided list (prevents hallucinated datasets).

Always constrain dataset choice to **IDs in the curated list**.

---

## Judging story (30-second pitch)

> “Doctors know the clinical question but not how to train models. DocLab lets them type a goal in plain English, picks an approved public dataset, shows a plan they can trust, trains locally, and outputs metrics plus a model card that says ‘prototype only—not for patient care.’ We built a full loop for tabular risk-style classification and [image/text if done].”

---

## Success criteria (hackathon done)

- [ ] One complete tabular prototype loop with plan approval
- [ ] Curated marketplace (no live HF search in demo)
- [ ] Experiment saved with metrics + model card
- [ ] Sanity checks visible (baseline or small-data warning)
- [ ] Clear non-clinical disclaimers in UI and model card
- [ ] (Stretch) Image and/or text path working

---

## Post-hackathon (out of scope for now)

- Time-series (ECG, vitals streams)
- More datasets via automated HF indexer
- Unsloth for faster LLM fine-tuning
- Compare multiple models per goal automatically
- Export/share prototypes

---

## Open decisions (resolve day 1)

| Decision | Hackathon recommendation |
|----------|---------------------------|
| LLM for agent? | Optional; rules + curated list is enough for demo |
| Text metric | ROUGE-L via `rouge-score` or `evaluate` library |
| Data cache location | `~/.doclab/datasets` |
| Max train time | Cap image epochs / text steps so demo finishes in &lt; 3–5 min |
| Mac GPU | **MPS** for image + text; CPU for tabular; CPU fallback on MPS errors |

---

*This spec prioritizes a **credible, judge-friendly demo** over full platform breadth. When in doubt, deepen Phase 1 (tabular + plan + model card) rather than adding features.*
