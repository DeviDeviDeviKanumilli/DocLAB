# M9 — Image Classification Path (Implementation Plan)

## Context

With Phase 1 (tabular) solid, M9 opened **Phase 2**: a second demo path that
reuses the M5 loop but adds a PyTorch CNN worker and Apple Silicon (MPS) device
handling. The agent routes image goals to this path; everything downstream
(SQLite row, model card, Results screen) is shared with tabular.

This is the first milestone to exercise `device` selection and the
**MPS → CPU fallback** — the two things a clean live run won't show, so they're
covered by mocked tests rather than a real Metal run.

## Goal

Type an image-classification goal → approve → a small CNN trains on a 2-class
medical image set → accuracy + small-data warning in the model card. One MPS run
verified on the demo Mac, with CPU fallback proven.

## What Shipped

### New worker modules
- `worker/doclab_worker/image.py` — `TinyConvNet`, 3 epochs, 64×64 grayscale,
  subsampled to 800 train / 200 test for a fast demo. Fixed seed 42.
- `worker/doclab_worker/device.py` — `resolve_device()`: `mps` on Apple Silicon
  else `cpu`. Shared with M10.

### MPS → CPU fallback
- The train loop catches an MPS op error once, retries the job on `cpu`, and
  records `device_fallback: true` in metrics. Proven by
  `test_mps_failure_falls_back_to_cpu`.

### Dispatch
- `worker/doclab_worker/__main__.py` branches on `plan.modality` — `image`
  routes to `image.py`, tabular stays the default.

### Sanity check (small data)
- If the training set has < 500 samples, the worker emits a `warning` that the
  model card folds in: *"Small dataset; high accuracy may reflect overfitting."*

### Agent / marketplace
- `chest_xray_pneumonia` (NORMAL vs PNEUMONIA) was already curated; M9 wired it
  end-to-end.
- `src/agent/parser.ts` maps x-ray / image / scan keywords → `image` modality;
  `create_plan` builds a CNN plan (image plans no longer rejected).

### Metrics
- `metrics.json` reports test accuracy + `device`. Real MPS run: 76% accuracy
  vs 62.5% baseline, `device: mps`, `device_fallback: false`.

## Testing

`worker/tests/test_image.py` — all mock the dataset + tensors so they run
offline and fast (no network, no Metal):
- `test_metrics_contract_and_cpu` — well-formed metrics on CPU, no warning at
  600 samples.
- `test_small_data_warning` — < 500 samples attaches the overfitting warning.
- `test_mps_failure_falls_back_to_cpu` — MPS op error → CPU retry,
  `device_fallback: true`, exactly 2 train calls.

Plus one real MPS run on the demo Mac as a live smoke (the warmup M11 relies on).

## Exit Criteria (all met)

- [x] 1 curated 2-class image dataset wired end-to-end.
- [x] PyTorch CNN worker with a short, capped epoch budget.
- [x] `resolve_device()` records `mps`/`cpu` in plan + metrics.
- [x] MPS → CPU fallback proven by test.
- [x] Demo run < 3–5 min (real run ~1 min), fixed seed.
- [x] Small-data warning < 500 samples, folded into the card.
- [x] Agent routes image goals; `metrics.json` has accuracy + device.

## Files Changed

- `worker/doclab_worker/image.py` — NEW, CNN worker.
- `worker/doclab_worker/device.py` — NEW, `resolve_device()`.
- `worker/doclab_worker/__main__.py` — modality dispatch.
- `worker/tests/test_image.py` — NEW, 3 tests.
- `src/agent/parser.ts`, `src-tauri/.../create_plan` — image routing.
- `requirements.txt` — `torch`, `torchvision`.

## Note

Do not start later DL work before this is solid. M9 is the template M10 reuses
for `resolve_device()` and the fallback pattern.
