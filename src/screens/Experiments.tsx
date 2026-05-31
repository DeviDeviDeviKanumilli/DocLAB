import { useCallback, useEffect, useState } from "react";
import { invoke } from "../lib/tauri";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { Badge } from "../components/Badge";
import { useRouter } from "../router";
import type { ExperimentSummary } from "../types/tauri";

const STATUS_TONE: Record<string, "success" | "running" | "error" | "neutral"> = {
  complete: "success",
  running: "running",
  failed: "error",
};

function formatMetric(exp: ExperimentSummary): string {
  if (exp.metricValue === null) return "—";
  if (exp.primaryMetric === "rouge_l") return exp.metricValue.toFixed(2);
  return `${(exp.metricValue * 100).toFixed(1)}%`;
}

export function Experiments() {
  const { navigate } = useRouter();
  const [experiments, setExperiments] = useState<ExperimentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExperiments = useCallback((showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    setError(null);
    invoke<ExperimentSummary[]>("list_experiments")
      .then(setExperiments)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    loadExperiments();
  }, [loadExperiments]);

  if (loading) {
    return (
      <AppShell title="Experiments">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Icon name="hourglass_empty" size={48} className="mx-auto mb-4 animate-pulse text-primary" />
            <p className="font-headline-md text-headline-md text-text-primary">
              Loading experiments...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Experiments">
        <div className="mx-auto max-w-[720px] p-8">
          <div className="rounded-lg border border-warning-text/20 bg-warning-bg p-6">
            <div className="mb-3 flex items-center gap-2 text-warning-text">
              <Icon name="warning" />
              <h3 className="font-headline-md text-headline-md">Experiment history unavailable</h3>
            </div>
            <p className="font-body-md text-text-primary">{error}</p>
            <button
              onClick={() => loadExperiments(true)}
              className="mt-4 rounded border border-border bg-surface px-4 py-2 font-body-md text-text-primary transition-colors hover:bg-surface-muted"
            >
              Retry
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Experiments">
      <div className="mx-auto max-w-[1080px] p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-text-primary">
              Experiments
            </h1>
            <p className="mt-1 font-body-md text-text-muted">
              Every prototype run, newest first.
            </p>
          </div>
          <button
            onClick={() => loadExperiments(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded border border-border bg-surface-container-lowest px-3 py-2 font-label-sm text-label-sm text-text-primary transition-colors hover:bg-surface-muted disabled:opacity-50"
          >
            <Icon name="refresh" size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {experiments.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-12 text-center">
            <Icon name="science" size={48} className="mx-auto mb-4 text-text-muted" />
            <h3 className="mb-2 font-headline-md text-headline-md text-text-primary">
              No experiments yet
            </h3>
            <p className="mb-4 font-body-md text-text-muted">
              Start your first prototype from the Home screen.
            </p>
            <button
              onClick={() => navigate("home")}
              className="rounded bg-primary px-4 py-2 font-headline-md text-headline-md text-on-primary shadow-sm transition-colors hover:bg-inverse-surface"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-surface-container-lowest">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-background font-label-sm text-label-sm text-text-muted">
                    <th className="px-4 py-3 font-normal">Experiment</th>
                    <th className="px-4 py-3 font-normal">Goal</th>
                    <th className="px-4 py-3 font-normal">Dataset</th>
                    <th className="px-4 py-3 font-normal">Metric</th>
                    <th className="px-4 py-3 font-normal">Status</th>
                    <th className="px-4 py-3 text-right font-normal">Date</th>
                  </tr>
                </thead>
                <tbody className="stagger divide-y divide-border font-body-md text-body-md text-text-primary">
                  {experiments.map((exp) => (
                    <tr
                      key={exp.id}
                      onClick={() => navigate("results", { experimentId: exp.id })}
                      className="group cursor-pointer transition-colors hover:bg-surface-muted hover:shadow-[inset_3px_0_0_0_var(--color-primary)]"
                    >
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="rounded bg-surface-container px-2 py-1 font-code-sm text-code-sm text-text-secondary">
                          {exp.id}
                        </span>
                        {exp.isBest && (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-success-bg px-2 py-0.5 font-label-sm text-label-sm text-success-text">
                            <Icon name="star" size={12} /> Best
                          </span>
                        )}
                      </td>
                      <td className="max-w-[300px] truncate px-4 py-3" title={exp.goalText}>
                        {exp.goalText}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{exp.datasetId}</td>
                      <td className="px-4 py-3">
                        {exp.metricValue !== null ? (
                          formatMetric(exp)
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={STATUS_TONE[exp.status] || "neutral"}>
                          {exp.status}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-text-muted">
                        {new Date(exp.createdAtMs).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-border bg-background px-4 py-3">
              <span className="font-label-sm text-label-sm text-text-muted">
                Showing {experiments.length} experiment{experiments.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
