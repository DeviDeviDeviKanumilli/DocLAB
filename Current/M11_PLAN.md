# M11 — Final Demo Rehearsal & Fallbacks (Implementation Plan)

## Status: ◐ partial (machine-verifiable items done; presenter items open)

## Context

M11 is the cross-cutting closer: deliver the loop live and recover from any
single failure. It owns the dress rehearsal that M8 deliberately left out. Most
of it is **presenter-side** (rehearse on the actual laptop, memorize the pitch),
so this milestone is intentionally split into machine-verifiable items (done in
code/setup) and human items (open until demo day). The single source of the
checklist is `Current/DEMO.md`.

## Goal

Run the demo end-to-end on the presentation laptop and gracefully recover from
any one failure via Fallbacks A / B / C.

## What Shipped (machine-verifiable)

- **Pre-demo checklist (partial):** verified on the dev machine — frontend build
  green, all three datasets cached in `~/.doclab/datasets/`. Power / notifications
  / laptop items are presenter-side.
- **MPS warmup:** real MPS runs completed for both image (M9) and text (M10), so
  Metal kernels are already compiled on this machine.
- **Fallback A** (training slow/fails): `seed_demo_experiment()` seeds a
  `complete` run at startup (from M8) — always openable in history.
- **Fallback B** (agent/plan fails): `demo/seed_experiment/` holds a real,
  consistent artifact bundle (`plan.json` / `metrics.json` / `model_card.md`,
  64% vs 54% baseline) to point at if the live agent fails.

## Open (presenter-side, not code)

- [ ] Golden tabular path rehearsed on the **presentation laptop** (not just dev).
- [ ] Fallback C (app crash): slides / screenshots / GIF of the loop.
- [ ] 30-second pitch memorized; live timing within 4–5 min.

These are tracked here for completeness but cannot be closed from the codebase —
they're done during the dress rehearsal.

## Fallback Ladder (from DEMO.md)

| Trigger | Fallback | Source |
|---------|----------|--------|
| Training slow or fails on stage | A — open the pre-completed seed run in history | `seed_demo_experiment()` |
| Agent / plan step fails | B — show the exported artifact bundle | `demo/seed_experiment/` |
| App crashes entirely | C — slides / screenshots / GIF | presenter assets |

## Exit Criteria

- [x] MPS warmup done for shipped DL paths.
- [x] Fallback A live in history at startup.
- [x] Fallback B bundle committed and consistent.
- [ ] Dress rehearsal on presentation laptop (presenter).
- [ ] Fallback C assets prepared (presenter).
- [ ] Pitch + timing locked (presenter).

## Note

Refer to `Current/DEMO.md` for the authoritative 15-minute pre-demo checklist
and the full demo script. This file is a milestone record, not a second copy of
the checklist.
