# M5 — End-to-End Tabular Loop (Implementation Plan)

## Context

M0/M1/M2/M3/M4 are complete. M5 is the **Phase 1 integration gate** — it wires the agent layer (goal parsing → dataset selection → plan creation) and replaces all M4 mock data with live Tauri calls. M5 delivers the first complete prototype flow: type goal → approve plan → train → see real metrics + experiment saved to SQLite.

M5 is **contract-critical**: it writes the three agent artifacts (`intent.json`, `dataset_selection.json`, `data_profile.json`) that M6 model card generation depends on, and it establishes the end-to-end flow that M6/M7/M8 will polish.

## Goal

Wire the agent layer and replace all M4 mock data with live Tauri calls. Deliver the first complete prototype flow: type goal → approve plan → train → see real metrics + experiment saved to SQLite, end-to-end in < 5 min on a laptop.

## Agent Layer (New: `src/agent/`)

**Approach:** Rule-based (Option A from spec). No LLM for Phase 1; keyword matching over curated marketplace is sufficient for the demo.

### New Files

**`src/agent/parser.ts`** — parse goal text → `intent.json`:
```ts
export interface Intent {
  task_type: "predict" | "classify" | "detect" | "summarize" | "generate";
  modality: "tabular" | "image" | "text";
  metric_hint: "accuracy" | "auc" | "rouge" | null;
  goal_text: string;
}

export function parseGoal(goal: string): Intent {
  const lower = goal.toLowerCase();
  
  // Task type
  let task_type: Intent["task_type"] = "classify";
  if (lower.includes("predict")) task_type = "predict";
  else if (lower.includes("summarize")) task_type = "summarize";
  else if (lower.includes("detect")) task_type = "detect";
  else if (lower.includes("generate")) task_type = "generate";
  
  // Modality
  let modality: Intent["modality"] = "tabular";
  if (lower.includes("image") || lower.includes("x-ray") || lower.includes("scan")) {
    modality = "image";
  } else if (lower.includes("text") || lower.includes("summarize") || lower.includes("note")) {
    modality = "text";
  }
  
  // Metric hint
  let metric_hint: Intent["metric_hint"] = null;
  if (modality === "tabular" || modality === "image") metric_hint = "accuracy";
  if (modality === "text") metric_hint = "rouge";
  
  return { task_type, modality, metric_hint, goal_text: goal };
}
```

**`src/agent/selector.ts`** — query marketplace → select best match:
```ts
import { invoke } from "@tauri-apps/api/core";
import type { Dataset } from "../types/tauri";
import type { Intent } from "./parser";

export interface DatasetSelection {
  dataset_id: string;
  dataset_name: string;
  rationale: string;
}

export async function selectDataset(intent: Intent): Promise<DatasetSelection> {
  const keywords = extractKeywords(intent.goal_text);
  const datasets = await invoke<Dataset[]>("query_datasets", {
    keyword: keywords[0] || null,
    dataType: intent.modality,
    taskType: intent.task_type,
  });
  
  if (datasets.length === 0) {
    throw new Error(`No ${intent.modality} datasets found for task ${intent.task_type}`);
  }
  
  const best = datasets[0];
  return {
    dataset_id: best.id,
    dataset_name: best.name,
    rationale: `Matched "${best.name}" from curated registry: ${best.description}`,
  };
}

function extractKeywords(goal: string): string[] {
  const lower = goal.toLowerCase();
  const keywords = ["readmission", "heart", "diabetes", "chest", "pneumonia", "medical", "text"];
  return keywords.filter(k => lower.includes(k));
}
```

**`src/agent/profiler.ts`** — profile dataset (Phase 1 stub):
```ts
export interface DataProfile {
  schema: string[];
  label_column: string;
  row_count: number;
  missing_percent: number;
}

export async function profileDataset(datasetId: string): Promise<DataProfile> {
  // Phase 1: return stub profile (real profiling requires loading the dataset)
  return {
    schema: ["feature_1", "feature_2", "...", "label"],
    label_column: "readmitted",
    row_count: 101766,
    missing_percent: 2.5,
  };
}
```

**`src/agent/index.ts`** — orchestrate agent steps:
```ts
import { invoke } from "@tauri-apps/api/core";
import { parseGoal, type Intent } from "./parser";
import { selectDataset, type DatasetSelection } from "./selector";
import { profileDataset, type DataProfile } from "./profiler";
import type { PlanPreview } from "../types/tauri";

export interface AgentResult {
  intent: Intent;
  selection: DatasetSelection;
  profile: DataProfile;
  planPreview: PlanPreview;
}

export async function runAgent(goalText: string): Promise<AgentResult> {
  // 1. Parse intent
  const intent = parseGoal(goalText);
  console.log("[Agent] intent.json:", intent);
  
  // 2. Select dataset
  const selection = await selectDataset(intent);
  console.log("[Agent] dataset_selection.json:", selection);
  
  // 3. Profile dataset (stub for Phase 1)
  const profile = await profileDataset(selection.dataset_id);
  console.log("[Agent] data_profile.json:", profile);
  
  // 4. Create plan (call Tauri create_plan)
  const planPreview = await invoke<PlanPreview>("create_plan", {
    goalText,
    datasetId: selection.dataset_id,
  });
  console.log("[Agent] plan created:", planPreview);
  
  return { intent, selection, profile, planPreview };
}
```

### Agent Artifacts (Server-Side)

The frontend agent runs in-memory and logs to console. The **actual artifact files** (`intent.json`, `dataset_selection.json`, `data_profile.json`) are written by Rust during `run_experiment`, not by the frontend.

**New Rust struct** (`src-tauri/src/experiments.rs`):
```rust
#[derive(Debug, Clone, Deserialize)]
pub struct AgentArtifacts {
    pub intent: String,
    pub selection: String,
    pub profile: String,
}
```

**New Rust helper** (`src-tauri/src/experiments.rs`):
```rust
fn write_agent_artifacts(
    experiment_dir: &Path,
    artifacts: &AgentArtifacts,
) -> Result<(), String> {
    fs::write(experiment_dir.join("intent.json"), &artifacts.intent)
        .map_err(|e| format!("cannot write intent.json: {e}"))?;
    fs::write(experiment_dir.join("dataset_selection.json"), &artifacts.selection)
        .map_err(|e| format!("cannot write dataset_selection.json: {e}"))?;
    fs::write(experiment_dir.join("data_profile.json"), &artifacts.profile)
        .map_err(|e| format!("cannot write data_profile.json: {e}"))?;
    Ok(())
}
```

**Modified `run_experiment`** (`src-tauri/src/experiments.rs`):
```rust
pub fn run_experiment(
    plan: WorkerPlan,
    goal_text: String,
    agent_artifacts: AgentArtifacts,
) -> Result<ExperimentDetail, String> {
    validate_plan(&plan)?;
    let conn = db::open_db()?;
    let id = generate_experiment_id();
    let experiment_dir = db::experiments_dir()?.join(&id);
    fs::create_dir_all(&experiment_dir).map_err(|e| {
        format!("cannot create experiment dir {}: {e}", experiment_dir.display())
    })?;

    // Write agent artifacts BEFORE plan.json
    write_agent_artifacts(&experiment_dir, &agent_artifacts)?;

    let plan_path = experiment_dir.join("plan.json");
    // ... rest of existing run_experiment logic ...
}
```

**Updated Tauri command** (`src-tauri/src/lib.rs`):
```rust
#[tauri::command]
fn run_experiment(
    plan: WorkerPlan,
    goal_text: String,
    agent_artifacts: AgentArtifacts,
) -> Result<ExperimentDetail, String> {
    experiments::run_experiment(plan, goal_text, agent_artifacts)
}
```

## UI Integration (Replace Mocks)

### Home Screen (`src/screens/Home.tsx`)
**No changes needed** — already passes goal text to Plan via `navigate("plan", { goal })`.

### Plan Screen (`src/screens/Plan.tsx`)
**Replace hardcoded plan with live agent:**
```tsx
import { useEffect, useState } from "react";
import { runAgent, type AgentResult } from "../agent";

export function Plan() {
  const { params, navigate } = useRouter();
  const goal = (params.goal as string) ?? "Predict hospital readmission risk";
  const [agentResult, setAgentResult] = useState<AgentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    runAgent(goal)
      .then(setAgentResult)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [goal]);

  if (loading) return <AppShell title="Planning..."><Spinner /></AppShell>;
  if (error) return <AppShell title="Plan"><ErrorMessage error={error} onRetry={() => window.location.reload()} /></AppShell>;
  if (!agentResult) return null;

  const { intent, selection, profile, planPreview } = agentResult;

  async function startTraining() {
    const experimentDetail = await invoke<ExperimentDetail>("run_experiment", {
      plan: planPreview.plan,
      goalText: goal,
      agentArtifacts: {
        intent: JSON.stringify(intent),
        selection: JSON.stringify(selection),
        profile: JSON.stringify(profile),
      },
    });
    navigate("training", { experimentId: experimentDetail.id });
  }

  return (
    <AppShell title="Prototype Plan">
      {/* Render planPreview.dataset, planPreview.plan, planPreview.summary */}
      {/* Real agent log: intent → selection → profile → plan */}
      {/* Confirmation checkbox + Start Prototype button calls startTraining() */}
    </AppShell>
  );
}
```

### Training Screen (`src/screens/Training.tsx`)
**Replace setInterval simulation with real polling:**
```tsx
export function Training() {
  const { params } = useRouter();
  const experimentId = params.experimentId as string;
  const [detail, setDetail] = useState<ExperimentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const poll = setInterval(async () => {
      const exp = await invoke<ExperimentDetail>("get_experiment", { id: experimentId });
      setDetail(exp);
      if (exp.status === "complete" || exp.status === "failed") {
        clearInterval(poll);
        setLoading(false);
      }
    }, 2000);
    return () => clearInterval(poll);
  }, [experimentId]);

  if (!detail) return <AppShell title="Training"><Spinner /></AppShell>;

  const progress = detail.status === "complete" ? 100 : detail.status === "failed" ? 0 : 50;
  const logs = detail.workerStdout || "";

  return (
    <AppShell title="Training">
      {/* Render progress stepper based on detail.status */}
      {/* Show real logs from detail.workerStdout */}
      {/* Navigate to Results when status === "complete" */}
    </AppShell>
  );
}
```

### Results Screen (`src/screens/Results.tsx`)
**Replace hardcoded metrics with SQLite data:**
```tsx
export function Results() {
  const { params } = useRouter();
  const experimentId = params.experimentId as string;
  const [detail, setDetail] = useState<ExperimentDetail | null>(null);

  useEffect(() => {
    invoke<ExperimentDetail>("get_experiment", { id: experimentId }).then(setDetail);
  }, [experimentId]);

  if (!detail) return <AppShell title="Results"><Spinner /></AppShell>;

  const sanityPassed = (detail.metricValue || 0) > (detail.baselineMetric || 0);

  return (
    <AppShell title="Results">
      {/* Render detail.metricValue, detail.baselineMetric, detail.modelType, detail.framework */}
      {/* Sanity check: green if sanityPassed, warning otherwise */}
      {/* Model card: read detail.modelCardPath (M6 will generate it; M5 can stub) */}
    </AppShell>
  );
}
```

### Experiments Screen (`src/screens/Experiments.tsx`)
**Replace EXPERIMENTS mock with live SQLite query:**
```tsx
export function Experiments() {
  const [experiments, setExperiments] = useState<ExperimentSummary[]>([]);

  useEffect(() => {
    invoke<ExperimentSummary[]>("list_experiments").then(setExperiments);
  }, []);

  return (
    <AppShell title="Experiments">
      {/* Map experiments to table rows */}
      {/* Highlight isCurrent (track current session ID in localStorage) */}
    </AppShell>
  );
}
```

### Datasets Screen (`src/screens/Datasets.tsx`)
**Replace DATASETS mock with live marketplace query:**
```tsx
export function Datasets() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  useEffect(() => {
    invoke<Dataset[]>("query_datasets", {
      keyword: null,
      dataType: null,
      taskType: null,
    }).then(setDatasets);
  }, []);

  return (
    <AppShell title="Datasets">
      {/* Map datasets to cards */}
    </AppShell>
  );
}
```

### Models Screen (`src/screens/Models.tsx`)
**Keep mock data for M5** (no "trained models" concept yet; this is M7+ polish).

### Settings Screen (`src/screens/Settings.tsx`)
**Keep existing `worker_healthcheck` call**. Agent config toggle (rule-based vs LLM) is UI-only for M5; no backend change.

## Tauri Types (`src/types/tauri.ts`)

```ts
export interface Dataset {
  id: string;
  name: string;
  hfId: string;
  revision: string;
  dataType: string;
  taskTypes: string[];
  labelColumn: string;
  category: string;
  description: string;
}

export interface WorkerPlan {
  schema_version: number;
  dataset_id: string;
  hf_id: string;
  revision: string;
  label_column: string;
  model_type: string;
  framework: string;
  device: string;
  seed: number;
  split: number[];
  primary_metric: string;
  goal_text?: string;
  summary?: string;
}

export interface PlanPreview {
  goalText: string;
  dataset: Dataset;
  plan: WorkerPlan;
  summary: string;
}

export interface ExperimentSummary {
  id: string;
  createdAtMs: number;
  updatedAtMs: number;
  status: string;
  goalText: string;
  datasetId: string;
  primaryMetric: string | null;
  metricValue: number | null;
  baselineMetric: number | null;
}

export interface ExperimentDetail extends ExperimentSummary {
  modelType: string | null;
  framework: string | null;
  device: string | null;
  planPath: string;
  metricsPath: string | null;
  errorPath: string | null;
  modelCardPath: string | null;
  workerStdout: string | null;
  workerStderr: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  metrics: unknown | null;
  error: unknown | null;
}
```

## Error Handling

**Worker failure:**
- `run_experiment` returns `ExperimentDetail` with `status: "failed"`, `errorCode`, `errorMessage`
- Training screen detects failure, shows friendly error message
- Results screen shows error details if user navigates to failed experiment

**Agent failure:**
- `runAgent()` throws if no datasets match
- Plan screen catches error, shows "No suitable dataset found" message with retry button

**Network/Tauri failure:**
- Wrap all `invoke` calls in try/catch
- Show toast notification or inline error message

## Testing Strategy

**Unit tests** (`src/agent/__tests__/`):
- `parser.test.ts` — test `parseGoal()` with various goal strings
- `selector.test.ts` — mock `invoke("query_datasets")`, test ranking logic

**Integration tests** (`src/__tests__/integration/`):
- `e2e-flow.test.ts` — mock all Tauri commands, test Home → Plan → Training → Results flow

**Rust tests** (`src-tauri/src/experiments.rs`):
- Test `write_agent_artifacts` writes 3 JSON files
- Test `run_experiment` with agent artifacts writes all 6 files

**Manual smoke test:**
- Run `npm run tauri dev`
- Type "Predict hospital readmission risk" on Home
- Verify Plan screen shows diabetes_readmission dataset
- Click "Start Prototype"
- Verify Training screen shows real progress
- Verify Results screen shows real metrics from SQLite
- Verify Experiments screen lists the new run

## File Changes Summary

**New files:**
- `src/agent/parser.ts`
- `src/agent/selector.ts`
- `src/agent/profiler.ts`
- `src/agent/index.ts`
- `src/types/tauri.ts`
- `src/agent/__tests__/parser.test.ts`
- `src/agent/__tests__/selector.test.ts`
- `src/__tests__/integration/e2e-flow.test.ts`
- `Current/M5_PLAN.md` (this file)

**Modified files:**
- `src/screens/Plan.tsx`
- `src/screens/Training.tsx`
- `src/screens/Results.tsx`
- `src/screens/Experiments.tsx`
- `src/screens/Datasets.tsx`
- `src-tauri/src/experiments.rs`
- `src-tauri/src/lib.rs`

**Deleted files:**
- `src/mock/data.ts` (or keep for Models screen until M7)

## M5 Exit Criteria

- [ ] Type goal on Home → agent parses intent → selects dataset → creates plan
- [ ] Plan screen shows real dataset from curated marketplace (no mocks)
- [ ] Click "Start Prototype" → real worker run → SQLite row inserted
- [ ] Training screen shows real progress (poll `get_experiment` until complete)
- [ ] Results screen shows real `metric_value` and `baseline_metric` from SQLite
- [ ] Experiments screen lists all runs from SQLite (newest first)
- [ ] Datasets screen shows all curated datasets from marketplace
- [ ] Error path: worker failure shows friendly message, experiment marked "failed"
- [ ] End-to-end smoke test: type "Predict hospital readmission risk" → see accuracy 0.643 > baseline 0.539 in < 5 min
- [ ] Unit tests green: `npm test`
- [ ] Rust tests green: `cargo test`
- [ ] No mock data imports in workflow screens (Home/Plan/Training/Results/Experiments/Datasets)

## Out of Scope (Deferred)

- Model card generation (`model_card.md`) → M6
- Best-run badging (`is_best`) → M7
- Async `run_experiment` with progress events → M6 (M5 uses polling)
- Image/text modality support → M9/M10
- LLM-based agent parsing → post-Phase 1

## Verification Commands

```bash
# Frontend tests
npm test

# Rust tests
cd src-tauri && cargo test

# Build check
npm run build

# Manual smoke test
npm run tauri dev
```

## Timeline Estimate

- Agent layer: **2-3 hours**
- UI integration: **3-4 hours**
- Rust artifact writing: **1 hour**
- Testing: **2 hours**
- **Total: 8-10 hours** (one full day)

## Commit (After Verification)

Tick M5 in `Current/MILESTONES.md`, save this plan to `Current/M5_PLAN.md`, commit, push to origin master.
