// Agent orchestration: parse → select → profile → create plan
// Entry point for the M5 agent layer

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

  // 2. Select dataset from curated marketplace
  const selection = await selectDataset(intent);
  console.log("[Agent] dataset_selection.json:", selection);

  // 3. Create plan via Tauri create_plan command
  const planPreview = await invoke<PlanPreview>("create_plan", {
    goalText,
    datasetId: selection.dataset_id,
  });
  console.log("[Agent] plan created:", planPreview);

  // 4. Profile selected dataset metadata for the fixed artifact contract
  const profile = await profileDataset(planPreview.dataset);
  console.log("[Agent] data_profile.json:", profile);

  return { intent, selection, profile, planPreview };
}
