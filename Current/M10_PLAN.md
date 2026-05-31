# M10 — Text Summarization Path (Implementation Plan)

## Context

M10 opened **Phase 3**: the third and highest-risk demo path. It reuses the M5
loop and the M9 `resolve_device()` / fallback pattern, but adds a
`transformers` + PEFT **LoRA** fine-tune on a small model. MPS is most fragile
here, so the design caps steps hard and leans on mocked tests for the contract.

No Unsloth — plain `transformers` + `peft` only, per the scope guardrails.

## Goal

"Summarize medical education text" → LoRA fine-tune on a small model →
ROUGE-L similarity + 3 fixed example input→summary pairs in the model card.
One MPS run verified, or clean CPU fallback.

## What Shipped

### New worker module
- `worker/doclab_worker/text.py` — LoRA adapter on `t5-small` (q/v modules),
  rank 8 / alpha 16, 1 epoch, subsampled to 200 train / 40 eval, fixed seed 42.
  Real run ~2 min on MPS. Plain transformers + peft, no Unsloth.

### Device handling (reused from M9)
- Shared `resolve_device()`; one-shot MPS → CPU fallback on **both** train and
  generate, recording `device_fallback`.

### Metric — ROUGE-L
- `_rouge_l()` fmeasure via `rouge-score`. Contract extended:
  `primary_metric: "rouge_l"`, `metric_value` in [0,1]. Card labels it
  "ROUGE-L similarity 0.xx (0–1; higher = closer)".

### Examples in the card
- Worker emits `examples[]` (`N_EXAMPLES` fixed pairs). The card renders an
  Examples section: input / model summary / reference — qualitative only.

### Dispatch & agent
- `__main__.py` branches `text` → `text.py`.
- `src/agent/parser.ts` maps summarize / text / note / document → `text`
  modality; `create_plan` builds a LoRA plan.

### Marketplace
- `medical_text_summarization_synthetic` (Text → Summary, 1481 examples) wired
  end-to-end.

## Testing

`worker/tests/test_text.py` — all mock the model + dataset so they run offline
and fast (no model download, no real fine-tune, no Metal):
- `test_metrics_contract_and_examples` — `primary_metric == "rouge_l"`,
  `model_type == "lora_t5_small"`, device/fallback fields, metric in [0,1], and
  exactly `N_EXAMPLES` examples each with `{input, prediction, reference}`.
- `test_rouge_l_perfect_and_zero` — identical strings → 1.0, disjoint → 0.0.
- `test_mps_failure_falls_back_to_cpu` — flaky MPS train → CPU retry,
  `device_fallback: true`, exactly 2 train calls.

The mocking strategy is deliberate: `monkeypatch` `_build_model`, `_train_once`,
`_generate`, and `load_text_data` so the metrics/examples contract and the
fallback are proven without touching the network or Metal.

## Exit Criteria (all met)

- [x] 1 curated text dataset with reference summaries wired end-to-end.
- [x] LoRA fine-tune on a small model, no Unsloth.
- [x] Rank 8–16, ≤3 epochs, capped steps, fixed seed, < 3–5 min.
- [x] `mps` else `cpu` with op-error CPU fallback.
- [x] ROUGE-L reported, labeled "similarity" in the card.
- [x] 3 fixed example pairs in the card.
- [x] Agent routes summarization goals to this path.

## Files Changed

- `worker/doclab_worker/text.py` — NEW, LoRA worker + `_rouge_l`.
- `worker/doclab_worker/__main__.py` — text dispatch.
- `worker/tests/test_text.py` — NEW, 3 tests.
- `src/agent/parser.ts`, `src-tauri/.../create_plan` — text routing + LoRA plan.
- `requirements.txt` — `transformers`, `peft`, `rouge-score`.

## Note

Highest MPS risk of any path. If a live MPS run is flaky on the presentation
laptop, the CPU fallback path is proven and acceptable for the demo.
