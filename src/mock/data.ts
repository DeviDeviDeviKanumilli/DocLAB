import type { BadgeTone } from "../components/Badge";

/* Display-only mock data for the M4 shell. Field names mirror the spec
   contracts (experiments / datasets / model card) so swapping to live Tauri
   commands later is a drop-in. No real PHI — curated/synthetic references only. */

export interface ExperimentRow {
  id: string;
  goal: string;
  dataset: string;
  model: string;
  metric: string;
  status: "Complete" | "Running" | "Failed";
  date: string;
  isBest?: boolean;
  /** Marks the run started in this app session — highlighted in the table. */
  isCurrent?: boolean;
}

export const EXPERIMENTS: ExperimentRow[] = [
  {
    id: "EXP-0042",
    goal: "Predict readmission risk",
    dataset: "Diabetes 130-US (public)",
    model: "Decision-tree model",
    metric: "83% Accuracy",
    status: "Complete",
    date: "Today",
    isBest: true,
    isCurrent: true,
  },
  {
    id: "EXP-0041",
    goal: "Classify chest X-rays",
    dataset: "PadChest (public)",
    model: "Image recognizer",
    metric: "0.88 AUC",
    status: "Running",
    date: "Today",
  },
  {
    id: "EXP-0040",
    goal: "Patient length of stay",
    dataset: "Diabetes 130-US (public)",
    model: "Random forest",
    metric: "—",
    status: "Failed",
    date: "May 28, 2026",
  },
  {
    id: "EXP-0039",
    goal: "Chest X-ray anomaly",
    dataset: "PadChest (public)",
    model: "Image recognizer",
    metric: "91% Specificity",
    status: "Complete",
    date: "May 26, 2026",
  },
  {
    id: "EXP-0038",
    goal: "Summarize medical education text",
    dataset: "Medical Education Summaries",
    model: "Text summarizer",
    metric: "0.42 ROUGE-L",
    status: "Complete",
    date: "May 24, 2026",
  },
];

export const STATUS_TONE: Record<ExperimentRow["status"], BadgeTone> = {
  Complete: "success",
  Running: "running",
  Failed: "error",
};

export interface ModelCard {
  name: string;
  task: string;
  version: string;
  description: string;
  stage: "Production" | "Staging" | "Archive";
  metricLabel: string;
  metricValue: string;
}

export const MODELS: ModelCard[] = [
  {
    name: "CardioPredict-v2",
    task: "Classification",
    version: "v2.1.0",
    description:
      "Decision-tree classifier for early detection of cardiovascular risk from multi-lead ECG-derived features.",
    stage: "Production",
    metricLabel: "F1 Score",
    metricValue: "0.942",
  },
  {
    name: "PulmoScan",
    task: "Image recognition",
    version: "v1.4.2",
    description:
      "Chest-X-ray image recognizer optimized for identifying nodular opacities with low false-positive rates.",
    stage: "Staging",
    metricLabel: "Dice Coeff",
    metricValue: "0.887",
  },
  {
    name: "NotesExtractor",
    task: "Text extraction",
    version: "v1.0.0",
    description:
      "Legacy entity extraction model for unstructured clinical notes. Deprecated in favor of v2.",
    stage: "Archive",
    metricLabel: "Accuracy",
    metricValue: "0.811",
  },
];

export const MODEL_STAGE_TONE: Record<ModelCard["stage"], BadgeTone> = {
  Production: "success",
  Staging: "warning",
  Archive: "neutral",
};

export interface DatasetEntry {
  id: string;
  name: string;
  hfId: string;
  modality: "Tabular" | "Image" | "Text";
  task: string;
  rows: string;
  license: string;
  description: string;
}

export const DATASETS: DatasetEntry[] = [
  {
    id: "mimic-iv-readmission",
    name: "MIMIC-IV Readmission (subset)",
    hfId: "hf://datasets/mimic-iv-readmission@a1b2c3d",
    modality: "Tabular",
    task: "Binary classification",
    rows: "45,210",
    license: "PhysioNet Credentialed",
    description:
      "De-identified ICU records with a 30-day readmission label. Demographics, vitals, and labs.",
  },
  {
    id: "diabetes-130",
    name: "Diabetes 130-US Hospitals",
    hfId: "hf://datasets/diabetes-130@9f8e7d6",
    modality: "Tabular",
    task: "Binary classification",
    rows: "101,766",
    license: "CC BY 4.0",
    description:
      "Ten years of diabetic patient encounters with a readmission outcome column. Public benchmark.",
  },
  {
    id: "padchest-2cls",
    name: "PadChest — Normal vs. Abnormal",
    hfId: "hf://datasets/padchest-2cls@4d5e6f7",
    modality: "Image",
    task: "Image classification",
    rows: "8,000",
    license: "Public research use",
    description:
      "Curated 2-class chest-X-ray split sized for laptop training. Small-data warnings apply.",
  },
  {
    id: "medqa-summaries",
    name: "Medical Education Summaries",
    hfId: "hf://datasets/medqa-summaries@2c3d4e5",
    modality: "Text",
    task: "Summarization",
    rows: "12,400",
    license: "CC BY-SA 4.0",
    description:
      "Open medical-education passages paired with reference summaries for similarity scoring.",
  },
];

export const DATASET_TONE: Record<DatasetEntry["modality"], BadgeTone> = {
  Tabular: "neutral",
  Image: "neutral",
  Text: "neutral",
};
