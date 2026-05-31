# Handoff — DocLab

_Last updated: 2026-05-31_

## Where things stand

DocLab is at the **spec stage**. The repo contains docs only — no code scaffold yet.

Files present:
- `README.md` — product overview, stack, target layout, placeholder quick-start
- `spec.md` — full hackathon spec (source of truth: vision, agent, marketplace, training, eval, phases)
- `DEMO.md` — judge demo script with fallbacks
- `CLAUDE.md` — guidance for future Claude Code instances (architecture, contracts, guardrails)

Not yet created: `src/` (Tauri + React), `worker/` (Python), `marketplace/datasets.yaml`,
and the runtime `doclab/` data dir.

## What to do next (Phase 1 — must-have)

Build the tabular path end-to-end. Order:
1. Scaffold the Tauri + React app shell (`src/`), goal input, plan view, approve button.
2. Create `marketplace/datasets.yaml` with 1–2 curated tabular datasets (real HF ids + pinned revisions).
3. Build the Python worker (`worker/`, entrypoint `python -m doclab_worker --job plan.json`):
   load data → preprocess → 80/10/10 split → XGBoost train → accuracy + majority-class baseline → `metrics.json`.
4. Wire Rust orchestration: write plan.json, shell out to worker, read metrics.json, persist to SQLite.
5. Generate `model_card.md` from the spec template.

**Exit criteria:** type goal → approve plan → see accuracy + baseline + model card.

## Must-honor contracts (see CLAUDE.md / spec.md for detail)

- Per-run artifacts in `experiments/<id>/`: `intent.json`, `dataset_selection.json`,
  `data_profile.json`, `plan.json`, `metrics.json`, `model_card.md` — fixed filenames.
- Rust↔Python boundary is JSON files on disk, not a live protocol.
- Agent may only select dataset IDs that exist in the curated marketplace — never hallucinate one.
- No live Hugging Face search at runtime.
- Frameworks: tabular = XGBoost/sklearn, image = PyTorch, text = Transformers + PEFT LoRA (no Unsloth).

## Safety guardrails (non-negotiable)

- No private patient uploads, no EHR integration, no PHI.
- No clinical/diagnosis/treatment claims; every model card + UI carries a "research only — not for
  clinical care" disclaimer.
- Curated public / synthetic / de-identified datasets only.
- Sanity checks are required: tabular baseline comparison, image small-data (<500) warning,
  text 3 example outputs.

## Open decisions (resolve before building)

- LLM for the agent vs. rule-based parser over `datasets.yaml` (spec recommends rules + curated list is enough).
- Text metric: ROUGE-L via `rouge-score` or `evaluate`.
- Data cache location: `~/.doclab/datasets` vs. `./doclab/datasets`.
- Pick the real curated HF dataset ids (spec lists only placeholders).

## Notes

- No build/lint/test tooling exists yet — add commands to CLAUDE.md as the scaffold lands.
- If time runs short, ship Phase 1 only; keep image/text as "coming soon" but leave modality logic in place.
