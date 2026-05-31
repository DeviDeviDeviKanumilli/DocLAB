import { useEffect, useState } from "react";
import { invoke } from "../lib/tauri";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { Badge } from "../components/Badge";
import type { Dataset } from "../types/tauri";

const MODALITY_TONE: Record<string, "neutral"> = {
  tabular: "neutral",
  image: "neutral",
  text: "neutral",
};

export function Datasets() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    invoke<Dataset[]>("query_datasets", {
      keyword: null,
      dataType: null,
      taskType: null,
    })
      .then(setDatasets)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  async function copyDatasetRef(dataset: Dataset) {
    await navigator.clipboard.writeText(`${dataset.hfId}@${dataset.revision}`);
    setCopiedId(dataset.id);
    window.setTimeout(() => setCopiedId(null), 1500);
  }

  if (loading) {
    return (
      <AppShell title="Datasets">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Icon name="hourglass_empty" size={48} className="mx-auto mb-4 animate-pulse text-primary" />
            <p className="font-headline-md text-headline-md text-text-primary">
              Loading datasets...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Datasets">
        <div className="mx-auto max-w-[720px] p-8">
          <div className="rounded-lg border border-warning-text/20 bg-warning-bg p-6">
            <div className="mb-3 flex items-center gap-2 text-warning-text">
              <Icon name="warning" />
              <h3 className="font-headline-md text-headline-md">Dataset registry unavailable</h3>
            </div>
            <p className="font-body-md text-text-primary">{error}</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Datasets">
      <div className="mx-auto max-w-[1080px] p-8">
        <div className="mb-6">
          <h1 className="font-headline-lg text-headline-lg text-text-primary">
            Curated Datasets
          </h1>
          <p className="mt-1 font-body-md text-text-muted">
            Approved public and de-identified datasets for prototyping. The agent
            selects from this registry only.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              className="rounded-lg border border-border bg-surface p-5 transition-all hover:border-border-strong hover:shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-headline-md text-headline-md text-text-primary">
                  {dataset.name}
                </h3>
                <Badge tone={MODALITY_TONE[dataset.dataType.toLowerCase()] || "neutral"}>
                  {dataset.dataType}
                </Badge>
              </div>

              <div className="mb-3 flex items-center justify-between gap-3 rounded border border-surface-tint bg-log-bg px-3 py-2">
                <code className="font-code-sm text-code-sm text-log-text">
                  {dataset.hfId}@{dataset.revision.substring(0, 7)}
                </code>
                <button
                  type="button"
                  onClick={() => copyDatasetRef(dataset)}
                  title="Copy dataset reference"
                  className="rounded p-1 text-text-muted transition-colors hover:bg-surface-muted hover:text-log-text"
                >
                  <Icon name={copiedId === dataset.id ? "check" : "content_copy"} size={16} />
                </button>
              </div>

              <div className="mb-3 space-y-2 font-label-sm text-label-sm text-text-muted">
                <div className="flex items-center gap-2">
                  <Icon name="category" size={14} />
                  <span>Task: {dataset.taskTypes.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="storage" size={14} />
                  <span>Size: {dataset.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="gavel" size={14} />
                  <span>License: {dataset.license}</span>
                </div>
              </div>

              <p className="mb-3 font-body-md text-sm text-text-secondary">
                {dataset.description}
              </p>

              {dataset.limitations && (
                <details className="font-label-sm text-label-sm text-text-muted">
                  <summary className="cursor-pointer">Limitations</summary>
                  <p className="mt-2 text-text-secondary">{dataset.limitations}</p>
                </details>
              )}
            </div>
          ))}
        </div>

        {datasets.length === 0 && (
          <div className="rounded-lg border border-border bg-surface p-12 text-center">
            <Icon name="dataset" size={48} className="mx-auto mb-4 text-text-muted" />
            <h3 className="mb-2 font-headline-md text-headline-md text-text-primary">
              No datasets found
            </h3>
            <p className="font-body-md text-text-muted">
              The curated marketplace is empty.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
