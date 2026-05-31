# DocLab

**Doctor Laboratory** — a local-first healthcare ML prototyping lab.

Describe a clinical AI idea in plain language. DocLab finds an approved public dataset, shows you a training plan, runs the prototype locally, and saves metrics plus a **model card**—without writing ML code or picking frameworks yourself.

> **Not for clinical use.** DocLab is for research and prototyping only. It does not diagnose, recommend treatment, or connect to hospital EHRs. No private patient uploads.

---

## How it works

```
You describe a goal  →  Agent + curated datasets  →  You approve the plan
  →  Train locally  →  Metrics + experiment history  →  Model card
```

| You might say | DocLab handles |
|---------------|----------------|
| Predict hospital readmission risk | Tabular data → XGBoost → accuracy + baseline check |
| Classify medical images as normal or abnormal | Image dataset → CNN → accuracy + small-data note |
| Summarize medical education text | Text dataset → small LM + LoRA → ROUGE-L + examples |

Full product and build plan: **[spec.md](./Current/spec.md)**  
Live demo script: **[DEMO.md](./Current/DEMO.md)**

---

## Status

Hackathon MVP in progress. **Phase 1 (tabular)** is the primary target; image and text paths are stretch goals.

See [spec.md](./Current/spec.md) for phased exit criteria and scope.

---

## Stack

| Layer | Tech |
|-------|------|
| Desktop | [Tauri](https://tauri.app/) |
| UI | React + Tailwind |
| Orchestration | Rust, SQLite, Tokio |
| ML worker | Python (XGBoost, PyTorch, Transformers + LoRA) |
| Data | Curated Hugging Face datasets (indexed locally) |

---

## Project layout (target)

```
DocLAB/
├── README.md
├── CLAUDE.md               # Guidance for Claude Code instances
├── Current/
│   ├── spec.md             # Vision, architecture, hackathon scope (source of truth)
│   └── DEMO.md             # Judge demo script
├── Archived_Plans/         # Superseded earlier spec/demo/handoff
├── marketplace/
│   └── datasets.yaml       # Curated dataset index (source of truth)
├── src/                    # Tauri + React app (TBD)
├── worker/                 # Python training worker (TBD)
└── doclab/                 # Runtime data (created on first run)
    ├── doclab.db
    ├── datasets/
    └── experiments/
```

---

## Quick start

> Setup commands will be added when the app scaffold lands. Expected flow:

### Prerequisites

- macOS, Windows, or Linux
- [Rust](https://rustup.rs/) (for Tauri)
- [Node.js](https://nodejs.org/) 18+
- Python 3.11+ with venv
- **Apple Silicon:** PyTorch **MPS** for image/text training (recommended on MacBook demo)
- **Intel Mac / no GPU:** CPU for all modalities
- NVIDIA CUDA not used (Mac has no CUDA)

### Run (placeholder)

```bash
# Clone the repo
git clone <repo-url>
cd DocLAB

# Frontend + Tauri (once scaffold exists)
npm install
npm run tauri dev

# Python worker (once worker/ exists)
cd worker
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Data and experiments are stored under `./doclab/` or `~/.doclab/` (see [spec.md](./Current/spec.md)).

---

## Documentation

| Doc | Description |
|-----|-------------|
| [Current/spec.md](./Current/spec.md) | Full hackathon spec: vision, agent, marketplace, training, eval, phases |
| [Current/DEMO.md](./Current/DEMO.md) | Step-by-step demo for judges with fallbacks |

---

## Safety & scope

DocLab intentionally avoids:

- Private patient data uploads
- Hospital EHR integration
- Clinical decision support claims
- Community / sharing marketplace (for now)

Use only **public, synthetic, or de-identified** datasets from the curated marketplace.

---

## License

TBD — add before public release.
