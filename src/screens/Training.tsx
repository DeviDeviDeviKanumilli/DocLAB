import { useEffect, useState } from "react";
import { invoke } from "../lib/tauri";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { useRouter } from "../router";
import { friendlyError } from "../lib/errors";
import type { ExperimentDetail, WorkerPlan } from "../types/tauri";

interface Step {
  title: string;
  detail: string;
}

interface PendingRun {
  plan: WorkerPlan;
  goalText: string;
  agentArtifacts: {
    intent: string;
    selection: string;
    profile: string;
  };
}

function stepsFor(modelType?: string | null, primaryMetric?: string | null): Step[] {
  const isImage = modelType === "cnn";
  const isText = modelType === "lora_t5_small" || primaryMetric === "rouge_l";

  return [
    { title: "Dataset selected", detail: "Curated dataset loaded from registry." },
    { title: "Dataset inspected", detail: "Schema and label fields checked." },
    {
      title: "Data prepared",
      detail: isText
        ? "Text is tokenized and summaries are prepared as references."
        : isImage
          ? "Images are resized, normalized, and paired with labels."
          : "Numeric features are imputed; categorical variables are encoded.",
    },
    {
      title: isText ? "Train / eval split" : "Train / eval / test split",
      detail: isText
        ? "Capped local train/eval rows with fixed seed."
        : "80% / 10% / 10% split with fixed seed.",
    },
    {
      title: "Model training",
      detail: isText
        ? "Fine-tuning a small local summarization prototype."
        : isImage
          ? "Training a local medical image classifier."
          : "Training a structured-data predictor.",
    },
    {
      title: "Evaluation",
      detail: isText
        ? "Computing ROUGE-L and fixed qualitative examples."
        : "Scoring held-out data against a majority-class baseline.",
    },
    { title: "Experiment saved", detail: "Metrics and artifacts persisted locally." },
    { title: "Model card generated", detail: "Doctor-facing summary written with limitations and risks." },
  ];
}

export function Training() {
  const { params, navigate } = useRouter();
  const experimentId = params.experimentId as string | undefined;
  const pendingRun = params.pendingRun as PendingRun | undefined;
  const goal =
    pendingRun?.goalText ??
    (params.goal as string | undefined) ??
    "Predict hospital readmission risk";
  const [detail, setDetail] = useState<ExperimentDetail | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [logOpen, setLogOpen] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let poll: ReturnType<typeof setInterval> | undefined;
    let resultTimer: ReturnType<typeof setTimeout> | undefined;

    if (pendingRun) {
      setDetail(null);
      setRunError(null);
      invoke<ExperimentDetail>("run_experiment", {
        plan: pendingRun.plan,
        goalText: pendingRun.goalText,
        agentArtifacts: pendingRun.agentArtifacts,
      })
        .then((exp) => {
          if (cancelled) return;
          setDetail(exp);
          if (exp.status === "complete") {
            resultTimer = setTimeout(
              () => navigate("results", { experimentId: exp.id }),
              1000,
            );
          }
        })
        .catch((e: any) => {
          if (!cancelled) setRunError(e.message || "Failed to run experiment");
        });

      return () => {
        cancelled = true;
        if (resultTimer) clearTimeout(resultTimer);
      };
    }

    if (!experimentId) {
      navigate("home");
      return undefined;
    }

    // Poll every 2 seconds until complete or failed
    poll = setInterval(async () => {
      try {
        const exp = await invoke<ExperimentDetail>("get_experiment", { id: experimentId });
        if (cancelled) return;
        setDetail(exp);
        if (exp.status === "complete" || exp.status === "failed") {
          if (poll) clearInterval(poll);
          if (exp.status === "complete") {
            // Auto-navigate to Results after 1 second
            resultTimer = setTimeout(() => navigate("results", { experimentId }), 1000);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setRunError(e instanceof Error ? e.message : String(e));
        }
      }
    }, 2000);

    // Initial fetch
    invoke<ExperimentDetail>("get_experiment", { id: experimentId })
      .then((exp) => {
        if (!cancelled) setDetail(exp);
      })
      .catch((e) => {
        if (!cancelled) setRunError(e instanceof Error ? e.message : String(e));
      });

    return () => {
      cancelled = true;
      if (poll) clearInterval(poll);
      if (resultTimer) clearTimeout(resultTimer);
    };
  }, [experimentId, navigate, pendingRun]);

  const modelType = detail?.modelType ?? pendingRun?.plan.model_type;
  const primaryMetric = detail?.primaryMetric ?? pendingRun?.plan.primary_metric;
  const steps = stepsFor(modelType, primaryMetric);
  const trainingDone = detail?.status === "complete";
  const trainingFailed = detail?.status === "failed" || runError !== null;
  const activeIndex = trainingDone ? steps.length : 4;

  function stateOf(i: number): "done" | "active" | "todo" {
    if (trainingFailed && i === 4) return "active";
    if (i < activeIndex) return "done";
    if (i === activeIndex) return "active";
    return "todo";
  }

  const logs =
    detail?.workerStdout ||
    (runError
      ? "Run failed before worker logs were available."
      : "Worker started locally. Waiting for output...");

  return (
    <AppShell title="Training">
      <div className="mx-auto max-w-[1080px] p-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="mb-1 font-headline-lg text-headline-lg text-primary">
              {trainingDone ? "Training complete" : trainingFailed ? "Training failed" : "Training in progress"}
            </h2>
            <p className="font-body-md text-text-muted">
              {trainingFailed
                ? `Error: ${detail?.errorMessage || runError || "Run failed"}`
                : `Local prototype run for: ${goal}.`}
            </p>
          </div>
          {trainingDone && detail && (
            <button
              onClick={() => navigate("results", { experimentId: detail.id })}
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
            {steps.map((step, i) => {
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
            <pre className="h-64 overflow-y-auto whitespace-pre-wrap bg-log-bg p-4 font-code-sm text-code-sm text-log-text">
              {logs || "Waiting for worker output..."}
              {!trainingDone && !trainingFailed && <span className="animate-pulse">{"\n_"}</span>}
            </pre>
          )}
        </div>

        {trainingFailed && (
          <div className="mt-6 rounded-lg border border-error bg-error-bg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="error" className="text-error" />
              <h3 className="font-headline-md text-headline-md text-error">
                Training Failed
              </h3>
            </div>
            <p className="font-body-md text-text-primary mb-4">
              {friendlyError(detail?.errorCode)}
            </p>
            <details className="mb-2">
              <summary className="cursor-pointer font-label-sm text-label-sm text-text-muted">
                Technical details
              </summary>
              <p className="mt-2 font-body-md text-text-secondary">
                Error code: {detail?.errorCode || "unknown"}
              </p>
              <p className="mt-1 font-body-md text-text-secondary">
                {detail?.errorMessage || runError || "Worker failed without error details"}
              </p>
            </details>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => navigate("home")}
                className="rounded border border-border bg-surface px-4 py-2 font-body-md text-text-primary transition-colors hover:bg-surface-muted"
              >
                Start Over
              </button>
              <button
                onClick={() => navigate("experiments")}
                className="rounded border border-border bg-surface px-4 py-2 font-body-md text-text-primary transition-colors hover:bg-surface-muted"
              >
                View History
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
