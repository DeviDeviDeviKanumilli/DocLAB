# M7 — Experiment History & Best Run (Implementation Plan)

## Context

M6 gave every completed run a model card. M7 turns the pile of runs into an
**iteration story**: a history list that survives restart, reopens a saved run's
Results + card, and flags the best run per goal. This is the narrative judges
care about — "I tried it, it got better."

M7 introduced the project's **first real schema migration**. Before M7, `db.rs`
used `CREATE TABLE IF NOT EXISTS` only; adding `is_best` to an existing DB on a
demo laptop needed a guarded `ALTER TABLE`.

## Goal

History screen lists every run (newest first), each row reopens its persisted
Results + model card, and the highest-scoring run within a goal is badged
"Best". History reads from SQLite, so it survives an app restart.

## What Shipped

### Schema migration — first migration pattern
`src-tauri/src/db.rs`:
- Added `is_best INTEGER DEFAULT 0` to the `experiments` table definition.
- Added `add_column_if_missing(conn, table, col, decl)` — queries
  `PRAGMA table_info(<table>)`, and only runs `ALTER TABLE ... ADD COLUMN` when
  the column is absent. Idempotent and safe to call on every startup.

### Best-run logic (Rust)
`src-tauri/src/experiments.rs`:
- "Project" = same `goal_text` (Phase 1 has no separate project id).
- `recompute_best_for_goal(conn, goal_text)` — after a run completes, sets
  `is_best=1` on the highest `metric_value` row for that goal and `is_best=0` on
  the rest. Runs inside the existing connection, no extra round-trips.
- `is_best` added to `ExperimentSummary` + the `list_experiments` SELECT and to
  `get_experiment_by_id`.

### Frontend
- `src/screens/Experiments.tsx` — "Best" badge (star) when `summary.isBest`;
  rows already navigate by `experimentId` and order newest-first
  (`ORDER BY created_at_ms DESC`).
- `src/screens/Results.tsx` — reads everything from `get_experiment`, so
  reopening a row renders the persisted metrics + saved card.
- `src/types/tauri.ts` — `isBest: boolean` on `ExperimentSummary` /
  `ExperimentDetail`.

## Testing

- Rust: insert two completed rows on the same goal, assert exactly one has
  `is_best=1` after `recompute_best_for_goal`. See `src-tauri/src/experiments.rs`
  `#[cfg(test)] mod tests`.
- Manual: run two experiments on one goal → both in history → higher metric
  badged Best → restart app → history still there → click row → saved
  Results + card render.

## Exit Criteria (all met)

- [x] History lists runs from SQLite, newest first.
- [x] Row click reopens saved Results + model card from stored paths.
- [x] Highest `metric_value` per `goal_text` badged "Best".
- [x] History survives restart (persisted `~/.doclab/doclab.db`).
- [x] `add_column_if_missing` migration runs cleanly on a pre-M7 DB.

## Files Changed

- `src-tauri/src/db.rs` — `is_best` column + `add_column_if_missing`.
- `src-tauri/src/experiments.rs` — `recompute_best_for_goal`, `is_best` in
  summaries/detail, best-run test.
- `src/screens/Experiments.tsx` — Best badge.
- `src/types/tauri.ts` — `isBest` field.
