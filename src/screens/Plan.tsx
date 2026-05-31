import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { useRouter } from "../router";

const STEPS = [
  { label: "Goal", icon: "check_circle", state: "done" },
  { label: "Agent plan", icon: "model_training", state: "active" },
  { label: "Training", icon: "data_exploration", state: "todo" },
  { label: "Evaluation", icon: "analytics", state: "todo" },
] as const;

const LOG_LINES = [
  { tag: "OK", text: 'Parsed intent: "predict readmission risk"' },
  { tag: "OK", text: "Queried curated dataset registry: 1 match found" },
  {
    tag: "OK",
    text: "Evaluated candidates: logistic regression, random forest, gradient-boosted trees",
  },
  { tag: ">", text: "Plan finalized — awaiting your confirmation..." },
];

export function Plan() {
  const { params, navigate } = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const goal = (params.goal as string) ?? "Predict hospital readmission risk";

  return (
    <AppShell title="Prototype Plan">
      <div className="mx-auto max-w-[1080px] space-y-6 p-8">
        {/* Stepper */}
        <div className="flex flex-wrap items-center gap-2 font-label-sm text-label-sm text-text-muted">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1 ${
                  s.state === "done"
                    ? "text-success-text"
                    : s.state === "active"
                      ? "font-semibold text-primary"
                      : ""
                }`}
              >
                <Icon
                  name={s.icon}
                  size={16}
                  className={s.state === "active" ? "animate-pulse" : ""}
                />
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="h-px w-8 bg-border-strong" />
              )}
            </div>
          ))}
        </div>

        {/* Plan panel */}
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border bg-surface-muted px-6 py-4">
            <div className="flex items-center gap-3">
              <Icon name="memory" className="text-primary" />
              <h3 className="font-headline-md text-headline-md text-primary">
                Planning agent — compiled prototype
              </h3>
            </div>
            <span className="rounded bg-surface-container-high px-2 py-1 font-code-sm text-code-sm text-text-secondary">
              Status: Ready
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            {/* Objective */}
            <div className="col-span-1 rounded border border-border bg-background p-4 md:col-span-2">
              <h4 className="mb-2 font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
                Primary objective
              </h4>
              <p className="font-headline-md text-headline-md text-primary">
                {goal}
              </p>
            </div>

            {/* Task + modality */}
            <div className="space-y-4 rounded border border-border bg-background p-4">
              <div>
                <h4 className="mb-1 font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
                  Task type
                </h4>
                <div className="flex items-center gap-2">
                  <Icon name="category" size={18} className="text-secondary" />
                  <span className="font-body-md text-text-primary">
                    Classification
                  </span>
                </div>
              </div>
              <div className="border-t border-border pt-3">
                <h4 className="mb-1 font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
                  Data modality
                </h4>
                <div className="flex items-center gap-2">
                  <Icon name="table_rows" size={18} className="text-secondary" />
                  <span className="font-body-md text-text-primary">
                    Tabular healthcare data
                  </span>
                </div>
              </div>
            </div>

            {/* Dataset */}
            <div className="flex flex-col justify-between rounded border border-border bg-background p-4">
              <div>
                <h4 className="mb-2 font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
                  Selected dataset
                </h4>
                <p className="mb-3 font-body-md text-text-primary">
                  Curated, de-identified dataset from the approved registry.
                </p>
              </div>
              <div className="flex items-center justify-between rounded border border-surface-tint bg-log-bg p-3">
                <code className="font-code-sm text-code-sm text-log-text">
                  mimic-iv-readmission@a1b2c3d
                </code>
                <Icon
                  name="content_copy"
                  size={16}
                  className="cursor-pointer text-text-muted hover:text-log-text"
                />
              </div>
            </div>

            {/* Model + metric + rationale — framework kept as a secondary tag, not headline */}
            <div className="col-span-1 grid grid-cols-1 gap-6 rounded border border-border bg-background p-4 md:col-span-2 md:grid-cols-3">
              <div className="border-border pr-4 md:border-r">
                <h4 className="mb-2 font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
                  Model family
                </h4>
                <p className="mb-2 font-headline-md text-headline-md text-primary">
                  Gradient-boosted decision trees
                </p>
                <span className="inline-block rounded border border-border-strong bg-surface-muted px-2 py-0.5 font-code-sm text-code-sm text-text-secondary">
                  XGBoost · v2.0.3
                </span>
              </div>
              <div className="border-border pr-4 md:border-r">
                <h4 className="mb-2 font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
                  Target metric
                </h4>
                <p className="font-headline-md text-headline-md text-primary">
                  Accuracy
                </p>
                <p className="mt-1 font-label-sm text-text-muted">
                  Compared against a majority-class baseline.
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
                  Why this approach
                </h4>
                <p className="font-body-md text-sm leading-relaxed text-text-primary">
                  Decision-tree ensembles handle missing values common in
                  clinical records, capture non-linear interactions in
                  structured data, and expose feature importance for review.
                </p>
              </div>
            </div>
          </div>

          {/* Approved-data confirmation (spec guardrail) */}
          <div className="border-t border-border bg-warning-bg/40 px-6 py-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border-strong text-primary focus:ring-primary"
              />
              <span className="font-body-md text-sm text-text-secondary">
                I confirm this prototype uses{" "}
                <span className="font-semibold text-text-primary">
                  approved public / de-identified data only
                </span>{" "}
                — no PHI, EHR exports, or private patient uploads — and is for
                research &amp; prototyping, not clinical care.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-border bg-background px-6 py-4">
            <button className="rounded border border-transparent px-4 py-2 font-body-md text-text-primary transition-colors hover:border-border hover:bg-surface-muted">
              Edit parameters
            </button>
            <button
              disabled={!confirmed}
              onClick={() => navigate("training", { goal })}
              className="flex items-center gap-2 rounded bg-primary px-6 py-2 font-headline-md text-headline-md text-on-primary shadow-sm transition-all hover:bg-inverse-surface active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="play_arrow" size={18} />
              Start Prototype
            </button>
          </div>
        </div>

        {/* Agent execution log */}
        <div className="rounded-lg border border-[#2a2a2a] bg-log-bg p-4 font-code-sm text-code-sm text-log-text opacity-90 transition-opacity hover:opacity-100">
          <div className="mb-2 flex items-center gap-2 text-[#888]">
            <Icon name="terminal" size={14} />
            <span>Agent execution log</span>
          </div>
          <div className="space-y-1">
            {LOG_LINES.map((line, i) => (
              <p key={i}>
                <span
                  className={
                    line.tag === "OK" ? "text-success-text" : "text-[#888]"
                  }
                >
                  {line.tag === "OK" ? "[OK]" : ">"}
                </span>{" "}
                {line.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
