# DocLab — Demo Script

Use this for hackathon judging, rehearsal, and backup if live training is slow or fails.

**Golden path:** Tabular readmission-style classification (Phase 1).  
**Stretch:** Image classification, then text summarization.

Full product context: [spec.md](./spec.md)

**Mac demo:** Apple Silicon + **PyTorch MPS** for image/text training; tabular stays CPU (XGBoost). Rehearse MPS on the presentation laptop—see [macOS + MPS](#macos--mps-apple-silicon) below.

---

## Before you present (15 min checklist)

- [ ] App builds and opens without errors
- [ ] At least **one tabular** dataset cached locally (no download during demo)
- [ ] Run the golden path **once end-to-end**; note actual accuracy and training time
- [ ] Open a completed **model card** in advance (backup tab or PDF export)
- [ ] **Experiment history** has at least one prior run (shows iteration story)
- [ ] Laptop on power, notifications off, display scaled so UI is readable
- [ ] Close heavy apps; optional: pre-warm Python worker with a dry run
- [ ] **(Apple Silicon)** One MPS dry run for image or text so Metal is warmed up; confirm `device: mps` in `metrics.json`

---

## macOS + MPS (Apple Silicon)

Use **MPS** for Phase 2/3 live demos when you want GPU speed on a MacBook—no CUDA required.

| Modality | Live demo device |
|----------|------------------|
| Tabular (P0) | CPU — fast enough, most reliable |
| Image CNN | **MPS** |
| Text LoRA | **MPS** (rehearse; fall back to CPU if ops fail) |

**Pitch line (optional):**

> “Deep learning runs on the Mac’s GPU via Apple’s Metal backend—still fully local, no cloud.”

**Python requirements**

- Apple Silicon Mac
- PyTorch **2.1+** with MPS built in (`torch.backends.mps.is_available()` → `True`)
- For Transformers: recent `transformers` + `accelerate`; enable MPS in training args or `.to("mps")`

**Rehearsal checklist**

- [ ] `python -c "import torch; print(torch.backends.mps.is_available())"` → `True`
- [ ] Timed one image job and one text job on **MPS**; note minutes on presentation hardware
- [ ] If MPS OOM or op error: worker auto-retries on CPU (keep Fallback A anyway)

**Demo caps (so MPS finishes on stage)**

- Image: small CNN, subset of data, **3 epochs max**, batch size 16–32 (lower if OOM)
- Text: smallest model in curated list, LoRA r=8, **1 epoch**, max sequence length 256–512

**If MPS misbehaves during judging**

Say: “Metal hiccup—we fall back to CPU or this morning’s run,” then use **Fallback A**.

---

## 30-second pitch (memorize)

> Doctors understand clinical problems better than most engineers, but they often cannot train a model themselves. **DocLab** is a local prototyping lab: you type a goal in plain English, we match it to an **approved public dataset**, show a **plan you approve**, train on your machine, and output **metrics plus a model card** that clearly says *research only—not for patient care*. We are not replacing clinicians; we are bridging medical intent and machine learning.

---

## Primary demo (~3–4 minutes)

### 1. Home — state the problem (20 sec)

**Say:**

> “I want to explore whether we can predict hospital readmission from structured patient data—but I do not want to write XGBoost code or hunt datasets on Hugging Face.”

**Do:** Type (or paste) this goal:

```text
I want to predict whether a patient is likely to be readmitted to the hospital.
```

Optional: click example chip **“Predict readmission risk”** if the UI has chips.

---

### 2. Plan review — build trust (45 sec)

**Say:**

> “DocLab does not train blindly. It picks a **curated public dataset**, explains the task and model, and waits for me to approve.”

**Point at on screen:**

- Selected **dataset** name + license (public / de-identified)
- **Task:** classification / prediction
- **Model:** XGBoost (tabular)
- **Metric:** accuracy + majority-class **baseline**
- Disclaimer: *public data only, not for clinical decisions*

**Do:** Check “I understand this uses approved public data only” → click **Start prototype**.

---

### 3. Training — show progress (60–90 sec)

**Say:**

> “Training runs **locally**—no patient data leaves this machine. The Rust shell orchestrates a Python worker; image and text models use the **Mac GPU (MPS)** when available.”

**Do:** Let progress run: Loading data → Training → Evaluating.

**If training is slow:** Narrate the plan screen, then cut to **Fallback A** (pre-recorded run in history).

---

### 4. Results — metrics with sanity check (45 sec)

**Say:**

> “We report accuracy, but also a **sanity check**: how much better is this than predicting the majority class every time? That helps non-ML clinicians interpret the number without over-trusting it.”

**Point at:**

- Test **accuracy** (e.g. ~80–85% — use your rehearsal number)
- **Baseline** accuracy (e.g. ~55–60%)
- One-line interpretation: model beats baseline → “some signal”; if ≈ baseline → “prototype may not be useful”

**Do:** Open **model card** briefly — scroll to **Limitations** and **Risks**.

---

### 5. Experiment history — iteration story (30 sec)

**Say:**

> “ML is iterative. DocLab keeps experiments on this machine so I can compare runs without managing folders and spreadsheets.”

**Do:** Show history table (goal, dataset, metric, date). Optional: mark **best** run.

---

## Stretch demo — image (~2 min)

Only if Phase 2 is working.

**Goal to type:**

```text
I want to classify medical images as normal or abnormal.
```

**Highlight:**

- CNN / PyTorch in plan
- Accuracy on results
- Model card note if dataset is **small** (overfitting warning)

---

## Stretch demo — text (~2 min)

Only if Phase 3 is working.

**Goal to type:**

```text
I want to summarize medical education text for a prototype chatbot.
```

**Highlight:**

- Small LM + LoRA (Transformers) in plan
- **ROUGE-L** (or labeled “similarity” in UI)
- **Three example** input/summary pairs in model card (qualitative, not clinical quality)

---

## Fallbacks

### Fallback A — Training fails or exceeds 2 minutes

**Say:**

> “Training can take a few minutes on CPU; here is a completed run from earlier today on the same goal.”

**Do:**

1. Open **Experiment history**
2. Open latest completed run → Results + model card
3. Continue pitch from “Results” section above

---

### Fallback B — Agent / plan fails

**Say:**

> “The planning step is deterministic over our curated marketplace—here is the artifact bundle for a finished experiment.”

**Do:** Open folder or in-app viewer:

- `plan.json` — what would have been approved
- `metrics.json`
- `model_card.md`

---

### Fallback C — App crash

**Do:** Show slides or README + spec architecture diagram + screenshots/GIF recorded during rehearsal.

**Say:** Same 30-second pitch, then walk through one screenshot per step of the loop.

---

## What judges should remember

| Point | One line |
|-------|----------|
| **Who** | Healthcare professionals exploring AI ideas |
| **What** | Goal in → plan → local train → metrics → model card |
| **How** | Curated public HF data, not private uploads |
| **Why different** | Clinical intent first, not “pick XGBoost” |
| **Safety** | Prototype only; disclaimers in UI + model card |

---

## Demo goals (copy-paste)

| Priority | Goal text |
|----------|-----------|
| **P0 — tabular** | `I want to predict whether a patient is likely to be readmitted to the hospital.` |
| P1 — image | `I want to classify medical images as normal or abnormal.` |
| P2 — text | `I want to summarize medical education text for a prototype.` |

---

## Timing cheat sheet

| Segment | Target |
|---------|--------|
| Pitch | 0:30 |
| Tabular live demo | 3:00 |
| Stretch (optional) | +2:00 each |
| Q&A buffer | 1:00+ |

**Total recommended:** 4–5 minutes live + Q&A

---

## Q&A — short answers

**Is this FDA-cleared / for real patients?**  
No. Research and prototyping only on approved public datasets.

**Can doctors upload their hospital’s data?**  
Not in this MVP. Curated public/synthetic/de-identified sources only.

**Why not search all of Hugging Face live?**  
Reliability for demos and safety—we curate datasets with known labels and licenses.

**What if accuracy is high?**  
We warn on small image sets and compare to baseline on tabular; the model card states limitations and non-clinical use.

**What’s next after the hackathon?**  
More modalities (time-series), richer experiments, optional faster LLM tooling—not clinical deployment.

---

*Rehearse the P0 path twice: once on your machine, once on the presentation machine if different.*
