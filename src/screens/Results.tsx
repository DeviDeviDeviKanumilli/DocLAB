import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { invoke } from "@tauri-apps/api/core";
import ReactMarkdown from "react-markdown";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { Badge } from "../components/Badge";
import { useRouter } from "../router";
import { friendlyError } from "../lib/errors";
import { useCountUp } from "../hooks/useCountUp";
import type { ExperimentDetail } from "../types/tauri";

function modelFamilyLabel(modelType?: string | null): string {
  if (modelType === "cnn") return "Medical image classifier";
  if (modelType === "lora_t5_small") return "Medical text summarizer";
  if (modelType === "xgboost" || modelType === "logistic_regression") {
    return "Structured-data predictor";
  }
  return modelType || "Unknown";
}

/** Donut gauge whose arc sweeps to `fraction` (0–1) on mount. */
function MetricRing({ fraction }: { fraction: number }) {
  const r = 26;
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, fraction));
  const [dash, setDash] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setDash(pct * circumference), 300);
    return () => clearTimeout(id);
  }, [pct, circumference]);

  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg viewBox="0 0 64 64" className="h-14 w-14 -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="var(--color-surface-container-high)"
          strokeWidth="6"
        />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          style={{ transition: "stroke-dashoffset 1.1s var(--ease-out-expo)" }}
        />
      </svg>
      <Icon
        name="check"
        size={18}
        className="pop absolute inset-0 m-auto flex h-fit w-fit items-center justify-center text-accent"
        style={{ animationDelay: "0.6s" } as CSSProperties}
      />
    </div>
  );
}

/** Animated metric value: counts up from 0 on mount. */
function CountValue({
  target,
  decimals = 0,
  suffix = "",
  delay = 0,
}: {
  target: number;
  decimals?: number;
  suffix?: string;
  delay?: number;
}) {
  const v = useCountUp(target, { decimals, delay });
  return (
    <span>
      {v}
      {suffix}
    </span>
  );
}

export function Results() {
  const { params, navigate } = useRouter();
  const experimentId = params.experimentId as string;
  const [detail, setDetail] = useState<ExperimentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!experimentId) {
      navigate("home");
      return;
    }

    invoke<ExperimentDetail>("get_experiment", { id: experimentId })
      .then(setDetail)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [experimentId, navigate]);

  if (loading) {
    return (
      <AppShell title="Results">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Icon name="hourglass_empty" size={48} className="mx-auto mb-4 animate-pulse text-accent" />
            <p className="font-headline-md text-headline-md text-text-primary">
              Loading results...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!detail) {
    return (
      <AppShell title="Results">
        <div className="mx-auto max-w-[720px] p-8">
          <div className="rounded-lg border border-error bg-error-bg p-6">
            <p className="font-body-md text-text-primary">Experiment not found.</p>
            <button
              onClick={() => navigate("experiments")}
              className="mt-4 rounded border border-border bg-surface px-4 py-2 font-body-md text-text-primary transition-colors hover:bg-surface-muted"
            >
              View All Experiments
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const metricValue = detail.metricValue || 0;
  const baselineValue = detail.baselineMetric || 0;
  const isSimilarityMetric = detail.primaryMetric === "rouge_l";
  const sanityPassed = metricValue > baselineValue;
  const metricPercent = (metricValue * 100).toFixed(1);
  const baselinePercent = (baselineValue * 100).toFixed(1);
  const delta = (metricValue - baselineValue) * 100;
  const deltaStr = delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`;
  const metricLabel = isSimilarityMetric ? "ROUGE-L" : "Accuracy";
  const metricTarget = isSimilarityMetric ? metricValue : Number(metricPercent);

  return (
    <AppShell title="Results">
      <div className="mx-auto max-w-[1080px] px-8 py-6 pb-16">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="animate-fade-in-up">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone={detail.status === "complete" ? "success" : "error"}>
                {detail.status === "complete" ? "Complete" : "Failed"}
              </Badge>
              <span className="flex items-center gap-1 font-label-sm text-label-sm text-text-muted">
                <Icon name="schedule" size={14} /> {new Date(detail.updatedAtMs).toLocaleString()}
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-text-primary">
              Prototype {detail.status === "complete" ? "complete" : "failed"}
            </h2>
            <p className="mt-1 text-text-secondary">
              {detail.goalText}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("experiments")}
              className="rounded border border-border-strong bg-surface px-4 py-2 font-headline-md text-headline-md text-text-primary transition-colors hover:bg-surface-muted"
            >
              View experiment
            </button>
            {detail.modelCardPath && (
              <button className="rounded bg-accent px-4 py-2 font-headline-md text-headline-md text-accent-on shadow-sm shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-md hover:shadow-accent/30 active:scale-[0.98]">
                Open model card
              </button>
            )}
          </div>
        </div>

        {detail.status === "complete" && (
          <>
            {/* Summary strip */}
            <div className="stagger mb-6 flex flex-wrap items-center gap-x-12 gap-y-4 border-b border-border pb-6">
              <div className="flex flex-col gap-0.5" style={{ "--i": 1 } as CSSProperties}>
                <div className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
                  Model family
                </div>
                <div className="text-headline-md text-text-primary font-headline-md">
                  {modelFamilyLabel(detail.modelType)}
                </div>
              </div>
              <div className="flex items-center gap-3" style={{ "--i": 2 } as CSSProperties}>
                <MetricRing fraction={metricValue} />
                <div className="flex flex-col gap-0.5">
                  <div className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
                    {metricLabel}
                  </div>
                  <div className="flex items-baseline gap-2 font-headline-md">
                    <span className="text-[26px] leading-none font-semibold tracking-tight text-accent">
                      <CountValue
                        target={metricTarget}
                        decimals={isSimilarityMetric ? 2 : 1}
                        suffix={isSimilarityMetric ? "" : "%"}
                        delay={250}
                      />
                    </span>
                    {!isSimilarityMetric && (
                      <span className="font-label-sm text-success-text">{deltaStr} vs baseline</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-0.5" style={{ "--i": 3 } as CSSProperties}>
                <div className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
                  Status
                </div>
                <div className="flex items-baseline gap-2 text-headline-md text-text-primary font-headline-md">
                  Saved
                  <Icon
                    name="check_circle"
                    size={18}
                    className="pop text-success-text"
                    style={{ animationDelay: "0.5s" } as CSSProperties}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-0.5" style={{ "--i": 4 } as CSSProperties}>
                <div className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
                  Experiment ID
                </div>
                <div className="font-code-sm text-headline-md text-text-primary">
                  {detail.id}
                </div>
              </div>
            </div>

            {/* Sanity message */}
            <div data-reveal className={`mb-6 flex items-center gap-2 rounded-lg border px-4 py-3 ${
              isSimilarityMetric
                ? "border-border bg-surface text-text-secondary"
                : sanityPassed
                  ? "border-success-text/20 bg-success-bg text-success-text"
                  : "border-warning-text/20 bg-warning-bg text-warning-text"
            }`}>
              <Icon name={isSimilarityMetric ? "summarize" : sanityPassed ? "verified" : "warning"} size={18} />
              <p className="font-body-md text-sm">
                {isSimilarityMetric
                  ? `ROUGE-L is a reference-summary similarity score (${metricValue.toFixed(2)} on a 0–1 scale). Review the fixed examples in the model card qualitatively.`
                  : sanityPassed
                  ? `Sanity check passed — the model scores above the majority-class baseline (${metricPercent}% vs. ${baselinePercent}%), so it is learning real signal.`
                  : `Warning: model performance (${metricPercent}%) is close to or below the baseline (${baselinePercent}%). The model may not be learning signal.`
                }
              </p>
            </div>

            {/* Model card */}
            <div data-reveal style={{ "--reveal-delay": "80ms" } as CSSProperties} className="overflow-hidden rounded-xl border border-border">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <Icon name="article" className="text-text-secondary" />
                  <h3 className="font-headline-lg text-headline-lg text-text-primary">
                    Model card
                  </h3>
                </div>
                <button className="flex items-center gap-1 font-label-sm text-label-sm text-text-muted underline underline-offset-4 transition-colors hover:text-accent">
                  <Icon name="download" size={16} /> Export PDF
                </button>
              </div>

              {detail.modelCardContent ? (
                <div className="prose prose-sm max-w-none p-6">
                  <ReactMarkdown>{detail.modelCardContent}</ReactMarkdown>
                </div>
              ) : (
                <div className="p-6">
                  <p className="font-body-md text-text-muted">
                    Model card not available for this experiment.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {detail.status === "failed" && (
          <div className="rounded-lg border border-error bg-error-bg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="error" className="text-error" />
              <h3 className="font-headline-md text-headline-md text-error">
                Experiment Failed
              </h3>
            </div>
            <p className="font-body-md text-text-primary mb-4">
              {friendlyError(detail.errorCode)}
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer font-label-sm text-label-sm text-text-muted">
                Technical details
              </summary>
              <p className="mt-2 font-body-md text-text-secondary">
                <strong>Error code:</strong> {detail.errorCode || "unknown"}
              </p>
              <p className="mt-1 font-body-md text-text-secondary">
                {detail.errorMessage || "Worker failed without error details"}
              </p>
              {detail.workerStderr && (
                <pre className="mt-2 rounded bg-log-bg p-3 font-code-sm text-code-sm text-log-text overflow-x-auto">
                  {detail.workerStderr}
                </pre>
              )}
            </details>
          </div>
        )}
      </div>
    </AppShell>
  );
}
