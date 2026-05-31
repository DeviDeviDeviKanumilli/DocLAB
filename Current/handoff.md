# Handoff — DocLab

_Last updated: 2026-05-31_

## Where things stand

DocLab is at the **spec stage**. The repo contains docs only — no code scaffold yet.
Planning docs are split into current vs. archived.

Files present:
- `Current/spec.md` — full hackathon spec, source of truth (vision, agent, marketplace, training, eval, phases)
- `Current/DEMO.md` — judge demo script with fallbacks
- `Current/MILESTONES.md` — ordered build roadmap (M0–M11) with judge-pass gate + timebox kill-switches
- `Current/UI.md` — HTML/Tailwind design mockup of the screens
- `Current/handoff.md` — this file
- `README.md` — product overview, stack, target layout
- `CLAUDE.md` / `AGENTS.md` — guidance for AI coding agents (architecture, contracts, guardrails)
- `Archived_Plans/` — superseded earlier spec/demo/handoff; do not build from these

Not yet created: `src/` (Tauri + React), `worker/` (Python), `marketplace/datasets.yaml`,
and the runtime `doclab/` data dir.

## What to do next

Follow `Current/MILESTONES.md` — it's the ordered roadmap. The first hard gate is the
**judge-pass minimum**: M0 scaffold → M1 marketplace → M2 tabular worker → M3 Rust+SQLite →
M4 UI shell → **M5 end-to-end loop** + a minimal model card, one history row, and Fallback A.

Phase 1 (tabular) in short:
1. Scaffold the Tauri + React app shell (`src/`), goal input, plan view, approve button (M0/M4).
2. Create `marketplace/datasets.yaml` with 1–2 curated tabular datasets (real HF ids + pinned revisions) (M1).
3. Build the Python worker (`worker/`, `python -m doclab_worker --job plan.json`):
   load → preprocess → 80/10/10 split → XGBoost train → accuracy + majority baseline → `metrics.json` (M2).
4. Wire Rust orchestration: write plan.json, shell out, read metrics.json, persist to SQLite (M3).
5. Generate `model_card.md` from the spec template (M6).

**Phase 1 exit:** type goal → approve plan → see accuracy + baseline + model card, < 5 min on a laptop.

## Must-honor contracts (detail in Current/spec.md, CLAUDE.md, AGENTS.md)

- Per-run artifacts in `experiments/<id>/`: `intent.json`, `dataset_selection.json`,
  `data_profile.json`, `plan.json`, `metrics.json`, `model_card.md` — fixed filenames.
- Rust↔Python boundary is JSON files on disk, not a live protocol. Carry `schema_version` in
  `plan.json` / `metrics.json`; Rust rejects unknown versions.
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
- Data cache location: `~/.doclab/datasets` vs. `./doclab/datasets` (MILESTONES recommends `~/.doclab/`).
- Pick the real curated HF dataset ids (spec lists only placeholders).
- Fill in real clock times for the MILESTONES timebox kill-switches once the hackathon end is known.

## Notes

- No build/lint/test tooling exists yet — add commands to CLAUDE.md / AGENTS.md as the scaffold lands.
- If time runs short, ship Phase 1 only; keep image/text as "coming soon" but leave modality logic in place.
