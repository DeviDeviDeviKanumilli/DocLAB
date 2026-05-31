# LOCKED: Hybrid LLM Planning Agent for DocLab

**Copy everything below the line into Claude Code (or Cursor) as the task prompt.**

---

## Mission

Upgrade DocLab’s **planning agent** to a **hybrid**: **rules-first, LLM-assisted when useful**. The **training engine stays 100% local** (Python worker). GPT/Claude does **not** train models; it only improves goal understanding, dataset choice among curated options, and optional plain-language explanations.

**Do not** change the product premise: clinician goal → curated public dataset → approved plan → local train → metrics + model card. **No** private uploads, EHR, clinical claims, or live Hugging Face search.

---

## Locked architecture (non-negotiable)

### Two AIs (never conflate)

| Layer | Role | Technology |
|-------|------|------------|
| **Planning agent** | Parse goal, pick dataset from index, emit plan for approval | Rules + optional LLM |
| **Prototype model** | What gets trained | XGBoost / PyTorch CNN / T5+LoRA locally in `worker/` |

### Hybrid decision flow (locked)

```
goal_text
  → [1] parseIntent()
        DEFAULT: src/agent/parser.ts (rules)
        IF ambiguous OR DOCLAB_AGENT_MODE=hybrid|llm: optional LLM → strict Intent JSON
  → [2] query_datasets (Rust marketplace only — no HF search)
  → [3] selectDataset()
        DEFAULT: top ranked hit from query_datasets
        IF hybrid|llm AND len(candidates) > 1: LLM picks ONE dataset_id from candidate list ONLY
  → [4] invoke create_plan (Rust experiments.rs) — ONLY source of plan.json fields
  → [5] profileDataset() — enhance with real metadata from Dataset + marketplace; no fake row counts
  → User approves → run_experiment (unchanged) → local worker
```

### What LLM may NEVER do

- Invent a `dataset_id` not in `marketplace/datasets.yaml`
- Emit `plan.json` / `WorkerPlan` fields directly (no free-form JSON from LLM)
- Call training, PyTorch, XGBoost, or the worker
- Upload data or search Hugging Face at runtime
- Remove or weaken disclaimers (“research only — not for clinical care”)
- Suggest diagnosis, treatment, or deployment to clinics

### What LLM MAY do

- Parse vague goals → `{ task_type, modality, metric_hint, goal_text }` matching existing `Intent` type
- Choose `dataset_id` from a **provided list** of 1–N `Dataset` objects (id, name, description, data_type)
- Generate `selection.rationale` and optional `planPreview.summary` **wording** (Rust still builds the plan)
- Optional: friendly explanation on Plan screen (“why this dataset”) — cacheable per goal hash for demos

---

## API key & secrets (locked)

- **No keys in git**, `plan.json`, experiment artifacts, or React bundle.
- Read from environment (document in `worker/README.md` and `README.md`):

  | Variable | Purpose |
  |----------|---------|
  | `DOCLAB_AGENT_MODE` | `rules` (default) \| `hybrid` \| `llm` |
  | `DOCLAB_LLM_PROVIDER` | `openai` \| `anthropic` (implement one first) |
  | `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` | Provider secret |
  | `DOCLAB_LLM_MODEL` | e.g. `gpt-4o-mini` or `claude-3-5-haiku-20241022` |
  | `HF_TOKEN` | Optional; dataset download only (unchanged) |

- **Implement LLM calls in Rust** (`src-tauri/src/agent_llm.rs` or similar) behind a Tauri command, e.g. `agent_parse_intent`, `agent_pick_dataset`. Frontend `src/agent/` calls `invoke` — **do not** put API keys in TypeScript.
- If LLM fails (network, 401, timeout): **fall back to rules** and log `llm_fallback: true` in `intent.json` or `dataset_selection.json`.

---

## Strict JSON contracts (LLM outputs must validate)

### Intent (must match `src/agent/parser.ts` Intent)

```json
{
  "task_type": "predict|classify|detect|summarize|generate",
  "modality": "tabular|image|text",
  "metric_hint": "accuracy|auc|rouge|null",
  "goal_text": "<original user string>"
}
```

### Dataset selection (LLM returns only)

```json
{
  "dataset_id": "<must be one of allowed ids>",
  "rationale": "<1-3 sentences, non-clinical>"
}
```

Validate in Rust: reject unknown `dataset_id` before returning to UI.

---

## When to use rules vs LLM (locked)

| Condition | Behavior |
|-----------|----------|
| `DOCLAB_AGENT_MODE=rules` | Current behavior only |
| `DOCLAB_AGENT_MODE=hybrid` | Rules parse + rules select; LLM only if keyword match score ties OR goal length > 120 chars OR modality keywords conflict |
| `DOCLAB_AGENT_MODE=llm` | LLM parse + LLM pick among `query_datasets` results (still constrained) |
| No API key set | Force `rules`, no error blocking the app |
| Demo / offline | Default `rules`; document in `Current/DEMO.md` |

---

## Files to touch (expected)

| Area | Files |
|------|--------|
| Rust LLM + commands | `src-tauri/src/agent_llm.rs`, `src-tauri/src/lib.rs`, `Cargo.toml` (reqwest + serde_json; minimal deps) |
| Agent orchestration | `src/agent/index.ts`, `parser.ts`, `selector.ts`, `profiler.ts` |
| Types | `src/types/tauri.ts` |
| Settings UI (optional) | `src/screens/Settings.tsx` — show mode, “API key configured: yes/no” (never show key) |
| Docs | `Current/spec.md` (short “Hybrid agent” section), `README.md`, `CLAUDE.md`, `Current/DEMO.md` |
| Tests | Rust: validate LLM JSON parsing + reject bad dataset_id; TS: mock invoke in rules mode |

**Do not** refactor unrelated UI polish or change worker training logic except if needed for real `data_profile.json`.

---

## Profiler fix (required with this work)

Replace hardcoded stub in `src/agent/profiler.ts` with metadata from the selected `Dataset` (label_column, size string, limitations). Optionally add Rust command `profile_dataset_stub` that returns row_count from cache if cheap — otherwise honest “profile pending until train” fields, not fake `101766` rows.

---

## UX copy (locked)

- Primary flow: clinical intent language (“decision-tree model”, “image recognizer”) — not “GPT” or “LoRA” in headlines.
- Plan screen: badge `Planning: rules` | `Planning: AI-assisted` (no provider name in demo).
- Settings: “AI planning uses your API key locally via Rust; training never leaves this device.”

---

## Acceptance criteria (definition of done)

1. Default install with **no API key** runs identical golden path (tabular readmission) via rules.
2. With `DOCLAB_AGENT_MODE=hybrid` + valid `OPENAI_API_KEY` (or Anthropic), a vague goal still picks a valid curated `dataset_id` and completes `run_experiment`.
3. LLM cannot select a dataset id not returned by `query_datasets` for that goal (unit test with fake id).
4. `intent.json`, `dataset_selection.json`, `data_profile.json` still written under `experiments/<id>/`.
5. `create_plan` / `plan.json` / worker / `metrics.json` / `model_card.md` unchanged in contract.
6. `cargo test -q`, `npm run build`, `cd worker && python -m pytest -q` all pass.
7. `Current/DEMO.md` updated: live demo uses `rules`; hybrid optional for Q&A.

---

## Out of scope (do not implement)

- Bundling API keys in Tauri app
- LLM-generated hyperparameters or plan.json
- Cloud training
- Replacing rule-based parser entirely without fallback
- New datasets without adding to `marketplace/datasets.yaml` first

---

## Implementation order

1. `DOCLAB_AGENT_MODE` env + rules fallback wiring in `src/agent/index.ts`
2. Rust LLM module + `agent_pick_dataset` with candidate-list constraint
3. Rust `agent_parse_intent` (optional, after pick_dataset works)
4. Settings + docs
5. Tests + DEMO.md note

Read first: `Current/spec.md`, `CLAUDE.md`, `src/agent/*`, `src-tauri/src/experiments.rs`, `marketplace/datasets.yaml`.

**Ship the smallest hybrid that satisfies acceptance criteria. Do not expand scope.**
