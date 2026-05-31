import { useRef, useState, type CSSProperties } from "react";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { useRouter } from "../router";
import type { Dataset } from "../types/tauri";

interface Example {
  icon: string;
  title: string;
  blurb: string;
  goal: string;
}

const EXAMPLES: Example[] = [
  {
    icon: "analytics",
    title: "Predict readmission risk",
    blurb: "Using EHR-style tabular data and historical patient flows.",
    goal: "Predict hospital readmission risk from patient-style tabular data",
  },
  {
    icon: "medical_information",
    title: "Classify medical images",
    blurb: "Identify anomalies in chest X-rays from a curated public set.",
    goal: "Classify chest X-ray images as normal or abnormal",
  },
  {
    icon: "summarize",
    title: "Summarize medical education text",
    blurb: "Extract key insights from open clinical-education passages.",
    goal: "Summarize medical education text into concise notes",
  },
  {
    icon: "table_chart",
    title: "Classify clinical tabular records",
    blurb: "Predict an outcome label from structured encounter data.",
    goal: "Classify diabetic patient encounters by readmission outcome",
  },
];

export function Home() {
  const { navigate, params } = useRouter();
  const [goal, setGoal] = useState((params.prefillGoal as string) ?? "");
  const [attached, setAttached] = useState<Dataset | null>(
    (params.attachedDataset as Dataset) ?? null,
  );
  const [upload, setUpload] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function start(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    // Fold the attached dataset into the goal so the agent prefers it.
    const fullGoal = attached
      ? `${trimmed} (using the ${attached.name} dataset)`
      : trimmed;
    navigate("plan", { goal: fullGoal, datasetId: attached?.id });
  }

  return (
    <AppShell showSearch>
      <div className="flex min-h-full flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-[720px] animate-fade-in-up">
          <h2 className="mb-8 text-center font-headline-lg text-[28px] leading-9 font-semibold text-primary tracking-tight">
            What healthcare AI model do you want to prototype?
          </h2>

          {/* Goal input */}
          <div className="relative rounded-xl border border-border bg-surface-container-lowest p-1 shadow-sm transition-all focus-within:border-outline focus-within:ring-1 focus-within:ring-outline">
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) start(goal);
              }}
              spellCheck={false}
              placeholder="I want to predict hospital readmission risk from patient-style tabular data..."
              className="h-[160px] w-full resize-none border-none bg-transparent p-4 font-body-md text-body-md text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-0"
            />
            {/* Attached items (uploaded file + curated dataset) */}
            {(attached || upload) && (
              <div className="flex flex-wrap gap-2 px-3 pb-2">
                {upload && (
                  <span className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border-strong bg-surface-muted py-1.5 pl-2.5 pr-1.5 font-label-sm text-label-sm text-text-primary animate-fade-in">
                    <Icon name="description" size={14} className="shrink-0 text-text-secondary" />
                    <span className="truncate">{upload}</span>
                    <button
                      type="button"
                      aria-label="Remove upload"
                      onClick={() => setUpload(null)}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-container hover:text-text-primary"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </span>
                )}
                {attached && (
                  <span className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border-strong bg-surface-muted py-1.5 pl-2.5 pr-1.5 font-label-sm text-label-sm text-text-primary animate-fade-in">
                    <Icon name="database" size={14} className="shrink-0 text-text-secondary" />
                    <span className="truncate">{attached.name}</span>
                    <button
                      type="button"
                      aria-label="Remove dataset"
                      onClick={() => setAttached(null)}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-container hover:text-text-primary"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between px-3 pb-2">
              <div className="flex items-center gap-2">
                {/* Upload a local file */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.tsv,.json,.parquet,.zip"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      // One data source at a time: an upload replaces any
                      // attached curated dataset.
                      setUpload(f.name);
                      setAttached(null);
                    }
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  aria-label="Upload a file"
                  title="Upload a local data file"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary transition-all hover:border-border-strong hover:bg-surface-muted hover:text-text-primary active:scale-95"
                >
                  <Icon name="add" size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("datasets", { goal })}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-label-sm text-label-sm transition-all active:scale-[0.98] ${
                    attached
                      ? "border-border-strong bg-surface-muted text-text-primary"
                      : "border-border text-text-secondary hover:border-border-strong hover:bg-surface-muted"
                  }`}
                >
                  <Icon name={attached ? "swap_horiz" : "attach_file"} size={16} />
                  {attached ? "Change dataset" : "Attach dataset"}
                </button>
              </div>
              <button
                onClick={() => start(goal)}
                disabled={!goal.trim()}
                className="flex items-center gap-2 rounded bg-primary px-5 py-2 font-headline-md text-headline-md text-on-primary transition-all hover:bg-inverse-surface active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Start Prototype
                <Icon name="arrow_forward" size={18} />
              </button>
            </div>
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-center font-label-sm text-label-sm text-text-muted">
            <Icon name="info" size={14} />
            Research &amp; prototyping only — not for clinical care. Curated public data only; no PHI or patient uploads.
          </p>

          {/* Examples */}
          <div className="mt-10">
            <p className="mb-4 text-center font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
              Example scenarios
            </p>
            <div className="stagger grid grid-cols-1 gap-3 sm:grid-cols-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={ex.title}
                  style={{ "--i": i + 1 } as CSSProperties}
                  onClick={() => {
                    setGoal(ex.goal);
                    start(ex.goal);
                  }}
                  className="group rounded-lg border border-border bg-surface p-4 text-left transition-all hover:border-border-strong hover:bg-surface-muted hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      name={ex.icon}
                      className="text-text-secondary transition-colors group-hover:text-primary"
                    />
                    <div>
                      <h3 className="mb-1 font-headline-md text-headline-md text-text-primary">
                        {ex.title}
                      </h3>
                      <p className="font-label-sm text-label-sm text-text-muted">
                        {ex.blurb}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
