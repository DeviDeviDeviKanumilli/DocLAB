import { useEffect, useRef, useState } from "react";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { useRouter } from "../router";

interface Step {
  title: string;
  detail: string;
}

const STEPS: Step[] = [
  { title: "Dataset selected", detail: "Curated readmission dataset mapped from the registry." },
  { title: "Dataset inspected", detail: "45,210 viable records. Missing values flagged in 3 columns." },
  { title: "Data prepared", detail: "Numeric features scaled; categorical variables encoded." },
  { title: "Train / eval / test split", detail: "80% / 10% / 10% stratified split, fixed seed 42." },
  { title: "Model training", detail: "Fitting gradient-boosted decision trees." },
  { title: "Evaluation", detail: "Scoring on held-out test set vs. majority baseline." },
  { title: "Best checkpoint saved", detail: "Highest-scoring model persisted to the experiment." },
  { title: "Model card generated", detail: "Doctor-facing summary written with limitations & risks." },
];

const LOG = `[10:42:01] INFO  Initializing local training environment (CPU)...
[10:42:02] INFO  Loading curated dataset mimic-iv-readmission (45,210 rows)
[10:42:05] WARN  124 missing values in 'bp_systolic' — imputing with median
[10:42:06] INFO  Preprocessing complete. Encoding 11 categorical columns
[10:42:06] INFO  Stratified split 0.8 / 0.1 / 0.1 (seed=42)
[10:42:07] INFO  Training gradient-boosted trees: n_estimators=200, max_depth=6
[10:42:11] INFO  Fold metrics stabilizing — val accuracy 0.842
[10:42:14] INFO  Evaluating on test set...
[10:42:15] INFO  Test accuracy 0.831 | majority-class baseline 0.812
[10:42:15] INFO  Saving best checkpoint + writing model_card.md`;

export function Training() {
  const { params, navigate } = useRouter();
  const goal = (params.goal as string) ?? "Predict hospital readmission risk";
  const [progress, setProgress] = useState(0);
  const [logOpen, setLogOpen] = useState(true);
  const logRef = useRef<HTMLPreElement>(null);

  // Simulate a short, deterministic training run so the demo flows end-to-end.
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, p + 2));
    }, 90);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [progress]);

  // 4 prep steps are pre-done; training is step index 4; the rest unlock as progress completes.
  const trainingDone = progress >= 100;
  const activeIndex = trainingDone ? STEPS.length : 4;

  function stateOf(i: number): "done" | "active" | "todo" {
    if (i < activeIndex) return "done";
    if (i === activeIndex) return "active";
    return "todo";
  }

  return (
    <AppShell title="Training">
      <div className="mx-auto max-w-[1080px] p-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="mb-1 font-headline-lg text-headline-lg text-primary">
              Training in progress
            </h2>
            <p className="font-body-md text-text-muted">
              Autonomous prototype run for: {goal}.
            </p>
          </div>
          {trainingDone && (
            <button
              onClick={() => navigate("results", { goal })}
              className="flex items-center gap-2 rounded bg-primary px-5 py-2 font-headline-md text-headline-md text-on-primary shadow-sm transition-all hover:bg-inverse-surface active:scale-[0.98] animate-fade-in"
            >
              View Results
              <Icon name="arrow_forward" size={18} />
            </button>
          )}
        </div>

        {/* Stepper */}
        <div className="mb-6 rounded-lg border border-border bg-surface p-8">
          <div className="relative flex flex-col gap-6">
            <div className="absolute left-4 top-4 bottom-8 z-0 w-px bg-border-strong" />
            {STEPS.map((step, i) => {
              const state = stateOf(i);
              return (
                <div key={step.title} className="relative z-10 flex gap-6">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      state === "done"
                        ? "border border-success-text bg-success-bg"
                        : state === "active"
                          ? "border-2 border-primary bg-surface"
                          : "border border-outline-variant bg-surface"
                    }`}
                  >
                    {state === "done" && (
                      <Icon name="check" size={16} className="pop text-success-text" />
                    )}
                    {state === "active" && (
                      <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
                    )}
                  </div>
                  <div className={`pt-1 ${state === "todo" ? "opacity-50" : ""}`}>
                    <h3 className="font-headline-md text-headline-md text-primary">
                      {step.title}
                    </h3>
                    {state !== "todo" && (
                      <p className="mt-1 font-label-sm text-text-muted">
                        {step.detail}
                      </p>
                    )}
                    {state === "active" && i === 4 && !trainingDone && (
                      <div className="mt-3 w-full max-w-2xl rounded border border-border bg-surface-muted p-4">
                        <div className="mb-2 flex items-center justify-between font-label-sm text-text-secondary">
                          <span>Fitting trees</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                          <div
                            className="h-1.5 rounded-full bg-primary transition-[width] duration-150 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Logs */}
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <button
            onClick={() => setLogOpen((o) => !o)}
            className="flex w-full items-center justify-between bg-surface-muted p-4 transition-colors hover:bg-surface-container"
          >
            <div className="flex items-center gap-2">
              <Icon name="terminal" size={20} className="text-text-secondary" />
              <span className="font-headline-md text-headline-md text-primary">
                Technical logs
              </span>
            </div>
            <Icon
              name="expand_less"
              className={`text-text-secondary transition-transform duration-200 ${
                logOpen ? "" : "rotate-180"
              }`}
            />
          </button>
          {logOpen && (
            <pre
              ref={logRef}
              className="h-64 overflow-y-auto whitespace-pre-wrap bg-log-bg p-4 font-code-sm text-code-sm text-log-text"
            >
              {LOG}
              {!trainingDone && <span className="animate-pulse">{"\n_"}</span>}
            </pre>
          )}
        </div>
      </div>
    </AppShell>
  );
}
