import type { CSSProperties } from "react";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { DATASETS } from "../mock/data";

const MODALITY_ICON: Record<string, string> = {
  Tabular: "table_rows",
  Image: "image",
  Text: "article",
};

export function Datasets() {
  return (
    <AppShell title="Datasets">
      <div className="mx-auto max-w-[1080px] p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-text-primary">
              Curated datasets
            </h1>
            <p className="mt-1 font-body-md text-text-muted">
              The approved registry the agent may choose from. No live search —
              public, de-identified, or synthetic only.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded border border-border bg-surface-container-lowest px-3 py-2 font-label-sm text-label-sm text-text-primary transition-colors hover:bg-surface-muted">
            <Icon name="filter_list" size={16} /> All modalities
          </button>
        </div>

        <div className="stagger grid grid-cols-1 gap-4 lg:grid-cols-2">
          {DATASETS.map((d, i) => (
            <div
              key={d.id}
              style={{ "--i": i + 1 } as CSSProperties}
              className="flex flex-col rounded-xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-outline-variant hover:shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-muted">
                    <Icon
                      name={MODALITY_ICON[d.modality]}
                      size={18}
                      className="text-text-secondary"
                    />
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-primary">
                      {d.name}
                    </h4>
                    <p className="mt-0.5 font-label-sm text-label-sm text-text-muted">
                      {d.modality} • {d.task}
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-border bg-surface-container px-2.5 py-0.5 font-label-sm text-[11px] text-text-secondary">
                  {d.rows} rows
                </span>
              </div>

              <p className="mb-4 flex-1 font-body-md text-body-md text-text-secondary">
                {d.description}
              </p>

              <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
                <code className="truncate font-code-sm text-code-sm text-text-muted" title={d.hfId}>
                  {d.hfId}
                </code>
                <span className="shrink-0 rounded border border-border-strong bg-surface-muted px-2 py-0.5 font-label-sm text-[11px] text-text-secondary">
                  {d.license}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
