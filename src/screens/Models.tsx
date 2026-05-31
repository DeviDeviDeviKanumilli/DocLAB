import type { CSSProperties } from "react";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { Badge } from "../components/Badge";
import { MODELS, MODEL_STAGE_TONE } from "../mock/data";

export function Models() {
  return (
    <AppShell title="Models">
      <div className="mx-auto max-w-[1080px] space-y-8 p-8">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-headline-lg text-headline-lg text-text-primary">
                Trained models
              </h3>
              <p className="mt-1 font-body-md text-text-muted">
                Saved from completed prototypes. Promote, compare, or open a
                model card.
              </p>
            </div>
            <div className="relative">
              <Icon
                name="search"
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                placeholder="Search models..."
                className="w-64 rounded-lg border border-border bg-surface py-1.5 pl-9 pr-4 font-body-md text-body-md transition-colors focus:border-outline-variant focus:outline-none"
              />
            </div>
          </div>

          <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MODELS.map((m, i) => (
              <div
                key={m.name}
                style={{ "--i": i + 1 } as CSSProperties}
                className={`flex flex-col rounded-xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-outline-variant hover:shadow-sm ${
                  m.stage === "Archive" ? "opacity-75" : ""
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h4 className="font-headline-md text-headline-md text-primary">
                      {m.name}
                    </h4>
                    <p className="mt-0.5 font-label-sm text-label-sm text-text-muted">
                      {m.task} • {m.version}
                    </p>
                  </div>
                  <Badge tone={MODEL_STAGE_TONE[m.stage]}>{m.stage}</Badge>
                </div>
                <p className="mb-4 flex-1 font-body-md text-body-md text-text-secondary">
                  {m.description}
                </p>
                <div className="mt-auto flex items-center gap-4 border-t border-border pt-4">
                  <div className="flex-1">
                    <div className="mb-1 font-label-sm text-label-sm text-text-muted">
                      {m.metricLabel}
                    </div>
                    <div className="font-code-sm text-code-sm text-primary">
                      {m.metricValue}
                    </div>
                  </div>
                  <a className="flex cursor-pointer items-center gap-1 font-body-md text-body-md text-primary hover:underline">
                    View card <Icon name="arrow_forward" size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
