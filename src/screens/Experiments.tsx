import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { Badge } from "../components/Badge";
import { useRouter } from "../router";
import { EXPERIMENTS, STATUS_TONE } from "../mock/data";

export function Experiments() {
  const { navigate } = useRouter();

  return (
    <AppShell title="Experiments">
      <div className="mx-auto max-w-[1080px] p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-text-primary">
              Experiments
            </h1>
            <p className="mt-1 font-body-md text-text-muted">
              Every prototype run, newest first. Your current session is
              highlighted.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded border border-border bg-surface-container-lowest px-3 py-2 font-label-sm text-label-sm text-text-primary transition-colors hover:bg-surface-muted">
            <Icon name="filter_list" size={16} /> Filter
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface-container-lowest">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-background font-label-sm text-label-sm text-text-muted">
                  <th className="px-4 py-3 font-normal">Experiment</th>
                  <th className="px-4 py-3 font-normal">Goal</th>
                  <th className="px-4 py-3 font-normal">Dataset</th>
                  <th className="px-4 py-3 font-normal">Model</th>
                  <th className="px-4 py-3 font-normal">Metric</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 text-right font-normal">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-body-md text-body-md text-text-primary">
                {EXPERIMENTS.map((exp) => (
                  <tr
                    key={exp.id}
                    onClick={() => navigate("results", { goal: exp.goal })}
                    className={`group cursor-pointer transition-colors hover:bg-surface-muted ${
                      exp.isCurrent
                        ? "bg-primary/5 ring-1 ring-inset ring-primary/30"
                        : ""
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex items-center gap-2">
                        {exp.isCurrent && (
                          <span
                            title="This session"
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                          />
                        )}
                        <span className="rounded bg-surface-container px-2 py-1 font-code-sm text-code-sm text-text-secondary">
                          {exp.id}
                        </span>
                      </span>
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3" title={exp.goal}>
                      <span className="inline-flex items-center gap-1.5">
                        {exp.isBest && (
                          <Icon
                            name="star"
                            size={14}
                            fill
                            className="text-warning-text"
                          />
                        )}
                        {exp.goal}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{exp.dataset}</td>
                    <td className="px-4 py-3 text-text-secondary">{exp.model}</td>
                    <td className="px-4 py-3">
                      {exp.metric === "—" ? (
                        <span className="text-text-muted">—</span>
                      ) : (
                        exp.metric
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TONE[exp.status]}>{exp.status}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-text-muted">
                      {exp.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border bg-background px-4 py-3">
            <span className="font-label-sm text-label-sm text-text-muted">
              Showing 1–{EXPERIMENTS.length} of 42 experiments
            </span>
            <div className="flex gap-1">
              <button
                disabled
                className="flex h-8 w-8 items-center justify-center rounded border border-border text-text-disabled"
              >
                <Icon name="chevron_left" size={18} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded border border-border text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary">
                <Icon name="chevron_right" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
