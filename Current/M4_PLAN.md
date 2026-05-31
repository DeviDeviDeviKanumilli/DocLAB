# M4 — UI Shell & Screens (Retroactive Plan)

## Context

M4 was delivered via the `feat/ui-shell` branch and merged into master at commit `8e799ef`. It provides the complete UI shell with 8 React screens, a lightweight in-memory router, Tailwind v4 design system, and clinical-intent copy. This document retroactively captures what was built, since M4 shipped without a plan document.

M4 is **presentation-layer only** — all workflow screens use hardcoded mock data. The only live backend integration is `worker_healthcheck` in Settings. M5 will replace the mocks with live Tauri calls.

## What Was Delivered

### Screens (8 total)

**Primary workflow (Home → Plan → Training → Results):**
- **Home** (`src/screens/Home.tsx`) — goal textarea with placeholder text, 4 example scenario cards (readmission, chest X-ray, medical text, tabular classification), "Start Prototype" button navigates to Plan with `{ goal }`
- **Plan** (`src/screens/Plan.tsx`) — prototype plan panel showing objective, task type (Classification), data modality (Tabular), selected dataset (hardcoded `mimic-iv-readmission@a1b2c3d`), model family (Gradient-boosted decision trees / XGBoost), target metric (Accuracy vs baseline), rationale, confirmation checkbox ("I confirm this uses approved public data only"), "Start Prototype" button, fake agent execution log (4 lines: parsed intent, queried registry, evaluated candidates, plan finalized)
- **Training** (`src/screens/Training.tsx`) — 8-step progress stepper (Dataset selected → inspected → prepared → split → training → evaluation → checkpoint saved → model card generated), simulated progress bar (setInterval, 2% every 90ms), collapsible technical logs (hardcoded 11-line log), navigates to Results when progress reaches 100%
- **Results** (`src/screens/Results.tsx`) — completion summary (model family, accuracy 83.1% +1.9% vs baseline, status Saved, experiment ID EXP-0042), sanity check message (green: "model scores above baseline"), model card with metadata (ReadmitPredict-v1, XGBoost v2.0.3, dataset summary, reproducibility params), metrics table (accuracy/precision/recall/AUC-ROC for validation + test), inline SVG charts (training curve, precision-recall), limitations (2 bullets), risks (2 bullets), "View experiment" and "Open model card" buttons

**Secondary screens:**
- **Experiments** (`src/screens/Experiments.tsx`) — table of past runs from `EXPERIMENTS` mock data (5 rows: EXP-0042 through EXP-0038), columns: Experiment ID, Goal, Dataset, Model, Metric, Status, Date; EXP-0042 marked `isBest` (star icon) and `isCurrent` (dot + ring highlight); clicking rows navigates to Results; pagination UI (disabled prev, active next)
- **Models** (`src/screens/Models.tsx`) — 3 trained model cards from `MODELS` mock data (CardioPredict-v2 Production, PulmoScan Staging, NotesExtractor Archive), each with name, task, version, description, stage badge, metric label/value
- **Datasets** (`src/screens/Datasets.tsx`) — 4 curated dataset cards from `DATASETS` mock data (MIMIC-IV Readmission, Diabetes 130-US, PadChest 2-class, Medical Education Summaries), each with name, HF ID, modality badge, task, rows, license, description
- **Settings** (`src/screens/Settings.tsx`) — workspace config (data root path, Python interpreter), agent config (rule-based vs LLM-assisted toggle), worker healthcheck button (only live Tauri call: `invoke<string>("worker_healthcheck")`), security/access section, save/discard buttons

### Mock Data (`src/mock/data.ts`)

**Exports:**
- `ExperimentRow` interface: `id, goal, dataset, model, metric, status ("Complete" | "Running" | "Failed"), date, isBest?, isCurrent?`
- `EXPERIMENTS`: 5 rows
- `STATUS_TONE`: maps experiment status to badge tones
- `ModelCard` interface: `name, task, version, description, stage ("Production" | "Staging" | "Archive"), metricLabel, metricValue`
- `MODELS`: 3 cards
- `MODEL_STAGE_TONE`: maps model stage to badge tones
- `DatasetEntry` interface: `id, name, hfId, modality ("Tabular" | "Image" | "Text"), task, rows, license, description`
- `DATASETS`: 4 entries
- `DATASET_TONE`: maps dataset modality to badge tones (unused)

### Router (`src/router.tsx`)

Lightweight in-memory React context (not React Router):
- Route union: `home | plan | training | results | experiments | models | datasets | settings`
- `RouterProvider` wraps app, provides `{ route, params, navigate }`
- `navigate(route, params)` stores params in memory, scrolls main container to top
- No URL/deep-link behavior; state resets on page reload

### Design System (`src/index.css`)

Tailwind v4 with `@theme` tokens:
- **Color palette:** monochrome clinical aesthetic (black primary, near-white surfaces, grays for text hierarchy)
- **Typography:** Inter for UI, JetBrains Mono for code/IDs, Material Symbols Outlined for icons
- **Type scale:** `body-md` (14px/22px/400), `label-sm` (12px/18px/400), `code-sm` (12px/18px/400), `headline-md` (16px/24px/600), `headline-lg` (24px/32px/600)
- **Motion:** `fade-in-up` (0.55s cubic-bezier), `fade-in` (0.4s ease-out), `.stagger` helper for cascading reveals
- **Forced light mode:** `@custom-variant dark (&:where(.dark, .dark *))` ensures dark utilities never apply
- **Scrollbars:** thin, unobtrusive (8px, border-strong color)

### Components (`src/components/`)

- **AppShell** — main layout: sidebar (logo, 8 nav items, disclaimer footer), top app bar (search icon, notifications, settings), main content area (`#doclab-main`)
- **Sidebar** — vertical nav with icons + labels, active state highlighting
- **TopAppBar** — horizontal bar with optional search input, icon buttons
- **Disclaimer** — footer text: "Research & prototyping only — not for clinical care"
- **Badge** — colored pill with tone variants (success, error, warning, running, neutral)
- **Icon** — Material Symbols wrapper with size/fill/className props

### Existing Tauri Integration

Only one `invoke` call exists:
```ts
// src/screens/Settings.tsx:45-46
const out = await invoke<string>("worker_healthcheck");
setHealthcheck(out);
```

Import pattern: `import { invoke } from "@tauri-apps/api/core";`

No other screens call Tauri commands. All data is hardcoded or from `src/mock/data.ts`.

## Key Design Decisions

**Clinical-intent copy:**
- Primary UI uses lay language: "Gradient-boosted decision trees", "Decision-tree model", "Image recognizer"
- Framework names (XGBoost, CNN, LoRA) appear only as secondary tags or in technical logs
- Spec invariant: "never 'XGBoost'/'LoRA' in primary flow"

**Disclaimers everywhere:**
- Global footer in AppShell: "Research & prototyping only — not for clinical care"
- Plan screen confirmation checkbox: "I confirm this uses approved public data only — no PHI, EHR exports, or private patient uploads"
- Results screen model card: "Intended use: A research prototype to explore feasibility. Not a diagnostic tool and not for automated clinical decisions."

**Simulated training:**
- Training screen uses `setInterval` to increment progress 2% every 90ms
- Hardcoded 8-step stepper with fake details
- Hardcoded 11-line technical log
- No real worker integration; M5 will replace with live polling

**Mock data shape matches M3 contracts:**
- `ExperimentRow.status` matches SQLite `experiments.status` ("complete" | "running" | "failed")
- `ExperimentRow.id` format matches M3 experiment IDs (`EXP-0042` is display format; real IDs are `exp_<unix_ms>_<8-char-random>`)
- Field names use camelCase (frontend convention) vs snake_case (Rust/SQLite)

## Verification (M4 Exit Criteria — All Met)

- ✅ All 8 screens render with mock data
- ✅ Clinical-intent copy (no "XGBoost"/"LoRA" in primary flow; framework names are secondary tags)
- ✅ Global disclaimer visible in AppShell footer
- ✅ Routing between screens works (Home → Plan → Training → Results, plus sidebar nav)
- ✅ `npm run build` → 47 modules, green
- ✅ Tailwind v4 design system applied consistently
- ✅ Material Symbols icons render correctly
- ✅ Responsive layout (tested at 1080px+ viewport)

## Out of Scope (Deferred to M5)

- Live Tauri command calls (except `worker_healthcheck`)
- Agent layer (goal parsing, dataset selection, plan creation)
- Real training progress (currently simulated with setInterval)
- SQLite experiment persistence (currently mock data only)
- Error handling for worker failures
- Model card generation (Results screen shows hardcoded card)
- Best-run badging logic (EXP-0042 is hardcoded as `isBest`)
- Cross-session history persistence (mock data resets on reload)

## Files Added/Changed

**New files:**
- `src/screens/Home.tsx`
- `src/screens/Plan.tsx`
- `src/screens/Training.tsx`
- `src/screens/Results.tsx`
- `src/screens/Experiments.tsx`
- `src/screens/Models.tsx`
- `src/screens/Datasets.tsx`
- `src/screens/Settings.tsx`
- `src/components/AppShell.tsx`
- `src/components/Sidebar.tsx`
- `src/components/TopAppBar.tsx`
- `src/components/Disclaimer.tsx`
- `src/components/Badge.tsx`
- `src/components/Icon.tsx`
- `src/mock/data.ts`
- `src/router.tsx`
- `src/index.css` (Tailwind v4 design system)

**Modified files:**
- `src/App.tsx` — replaced with RouterProvider + screen mapping
- `index.html` — added Material Symbols font link

## Commit

M4 was delivered via two commits:
- `bb8b89f` — feat(ui): M4 UI shell — 8 screens, design system, demo flow
- `768117c` — fix(ui): close M4 gaps — current-session highlight, public-data mocks
- `8e799ef` — Merge feat/ui-shell: M4 UI shell into master

Evidence: `npm run build` → 47 modules, all screens render, disclaimer visible, routing works.
