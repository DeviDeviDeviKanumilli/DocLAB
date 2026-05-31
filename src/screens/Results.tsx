import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { Badge } from "../components/Badge";
import { useRouter } from "../router";

const SUMMARY = [
  { label: "Model family", value: "Gradient-boosted trees" },
  { label: "Accuracy", value: "83.1%", delta: "+1.9% vs baseline" },
  { label: "Status", value: "Saved", check: true },
  { label: "Experiment ID", value: "EXP-0042", mono: true },
];

const METRICS = [
  { metric: "Accuracy", val: "84.2%", test: "83.1%", bold: true },
  { metric: "Precision", val: "78.5%", test: "77.8%" },
  { metric: "Recall (sensitivity)", val: "81.0%", test: "80.2%" },
  { metric: "AUC-ROC", val: "0.89", test: "0.88", bold: true },
];

const LIMITATIONS = [
  "Performance drops for patients under 30 — underrepresented in the training split.",
  "Requires reasonably complete lab panels; missing values are mean-imputed, which can skew edge cases.",
];

const RISKS = [
  "False positives may cause unnecessary patient anxiety and resource strain.",
  "Potential demographic bias observed in recall across subgroups — review before any use.",
];

/** Lightweight inline chart so Results is fully self-contained (no external images). */
function MiniChart({ kind }: { kind: "loss" | "pr" }) {
  const path =
    kind === "loss"
      ? "M4,52 C30,50 40,30 70,24 C110,16 140,14 196,12"
      : "M4,12 C60,12 120,16 150,30 C170,40 184,50 196,54";
  return (
    <svg viewBox="0 0 200 64" className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#171717" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#171717" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[16, 32, 48].map((y) => (
        <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#e5e5e5" strokeWidth="1" />
      ))}
      <path d={`${path} L196,64 L4,64 Z`} fill={`url(#g-${kind})`} />
      <path d={path} fill="none" stroke="#171717" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Results() {
  const { params, navigate } = useRouter();
  const goal = (params.goal as string) ?? "Predict hospital readmission risk";

  return (
    <AppShell title="Results">
      <div className="mx-auto max-w-[1080px] px-8 py-6 pb-16">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="animate-fade-in-up">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="success">Complete</Badge>
              <span className="flex items-center gap-1 font-label-sm text-label-sm text-text-muted">
                <Icon name="schedule" size={14} /> just now
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-text-primary">
              Prototype complete
            </h2>
            <p className="mt-1 text-text-secondary">
              Training and evaluation finished for: {goal}.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("experiments")}
              className="rounded border border-border-strong bg-surface px-4 py-2 font-headline-md text-headline-md text-text-primary transition-colors hover:bg-surface-muted"
            >
              View experiment
            </button>
            <button className="rounded bg-primary px-4 py-2 font-headline-md text-headline-md text-on-primary shadow-sm transition-colors hover:bg-inverse-surface">
              Open model card
            </button>
          </div>
        </div>

        {/* Summary strip */}
        <div className="mb-6 flex flex-wrap gap-x-12 gap-y-4 border-b border-border pb-6">
          {SUMMARY.map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <div className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
                {s.label}
              </div>
              <div
                className={`flex items-baseline gap-2 text-headline-md text-text-primary ${
                  s.mono ? "font-code-sm" : "font-headline-md"
                }`}
              >
                {s.value}
                {s.delta && (
                  <span className="font-label-sm text-success-text">{s.delta}</span>
                )}
                {s.check && (
                  <Icon name="check_circle" size={18} className="text-success-text" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sanity message */}
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-success-text/20 bg-success-bg px-4 py-3 text-success-text">
          <Icon name="verified" size={18} />
          <p className="font-body-md text-sm">
            Sanity check passed — the model scores above the majority-class
            baseline (83.1% vs. 81.2%), so it is learning real signal.
          </p>
        </div>

        {/* Model card */}
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Icon name="article" className="text-text-secondary" />
              <h3 className="font-headline-lg text-headline-lg text-text-primary">
                Model card
              </h3>
            </div>
            <button className="flex items-center gap-1 font-label-sm text-text-muted underline underline-offset-4 transition-colors hover:text-primary">
              <Icon name="download" size={16} /> Export PDF
            </button>
          </div>

          <div className="grid grid-cols-1 gap-x-12 gap-y-8 p-6 md:grid-cols-3">
            {/* Left: metadata */}
            <div className="col-span-1 space-y-6 border-border pr-8 md:border-r">
              <Field label="Model name" value="ReadmitPredict-v1" />
              <Field
                label="Model family"
                value="Gradient-boosted decision trees"
                sub="XGBoost · v2.0.3"
              />
              <div>
                <h4 className="mb-2 font-headline-md text-headline-md text-text-secondary">
                  Dataset summary
                </h4>
                <p className="mb-2 text-text-primary">
                  MIMIC-IV readmission subset (curated, de-identified).
                </p>
                <ul className="space-y-1 border-l-2 border-border-strong pl-3 font-label-sm text-label-sm text-text-muted">
                  <li>Records: 45,210</li>
                  <li>Features: 128 (demographics, vitals, labs)</li>
                  <li>Split: 80% train / 10% val / 10% test</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-headline-md text-headline-md text-text-secondary">
                  Reproducibility
                </h4>
                <div className="overflow-x-auto rounded-lg border border-outline-variant bg-log-bg p-3 font-code-sm text-code-sm text-log-text">
                  <div>seed = 42</div>
                  <div>learning_rate = 0.05</div>
                  <div>max_depth = 6</div>
                  <div>n_estimators = 200</div>
                </div>
              </div>
            </div>

            {/* Right: narrative + metrics */}
            <div className="col-span-1 space-y-6 md:col-span-2">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <Field
                  label="Goal"
                  value="Estimate the likelihood of hospital readmission within 30 days of discharge from structured clinical indicators."
                  paragraph
                />
                <Field
                  label="Intended use"
                  value="A research prototype to explore feasibility. Not a diagnostic tool and not for automated clinical decisions."
                  paragraph
                />
              </div>

              <div className="border-t border-border pt-6">
                <h4 className="mb-4 font-headline-md text-headline-md text-text-secondary">
                  Metrics &amp; results
                </h4>
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-left">
                    <thead className="border-b border-border">
                      <tr className="font-label-sm uppercase tracking-wider text-text-muted">
                        <th className="px-4 py-3 font-semibold">Metric</th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Validation
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Test set
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {METRICS.map((m) => (
                        <tr key={m.metric} className="text-body-md">
                          <td className="px-4 py-3 text-text-secondary">
                            {m.metric}
                          </td>
                          <td className="px-4 py-3 text-right">{m.val}</td>
                          <td
                            className={`px-4 py-3 text-right ${
                              m.bold ? "font-semibold" : ""
                            }`}
                          >
                            {m.test}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h4 className="mb-4 font-headline-md text-headline-md text-text-secondary">
                  Performance analysis
                </h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {[
                    { title: "Training curve", tag: "loss_curve", kind: "loss" as const },
                    { title: "Precision–recall", tag: "pr_curve", kind: "pr" as const },
                  ].map((c) => (
                    <div
                      key={c.tag}
                      className="flex flex-col rounded-lg border border-border bg-surface-container-lowest p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-headline-md text-headline-md text-text-primary">
                          {c.title}
                        </span>
                        <span className="rounded border border-border bg-surface-muted px-2 py-0.5 font-code-sm text-code-sm text-text-muted">
                          {c.tag}
                        </span>
                      </div>
                      <div className="h-28 overflow-hidden rounded border border-border bg-white p-2">
                        <MiniChart kind={c.kind} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 border-t border-border pt-6 sm:grid-cols-2">
                <BulletBlock
                  icon="warning"
                  iconClass="text-warning-text"
                  title="Limitations"
                  items={LIMITATIONS}
                />
                <BulletBlock
                  icon="gpp_bad"
                  iconClass="text-error"
                  title="Risks"
                  items={RISKS}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  value,
  sub,
  paragraph,
}: {
  label: string;
  value: string;
  sub?: string;
  paragraph?: boolean;
}) {
  return (
    <div>
      <h4 className="mb-2 font-headline-md text-headline-md text-text-secondary">
        {label}
      </h4>
      <p className={`text-text-primary ${paragraph ? "leading-relaxed" : ""}`}>
        {value}
      </p>
      {sub && (
        <span className="mt-2 inline-block rounded border border-border-strong bg-surface-muted px-2 py-0.5 font-code-sm text-code-sm text-text-secondary">
          {sub}
        </span>
      )}
    </div>
  );
}

function BulletBlock({
  icon,
  iconClass,
  title,
  items,
}: {
  icon: string;
  iconClass: string;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h4 className="mb-3 flex items-center gap-2 font-headline-md text-headline-md text-text-primary">
        <Icon name={icon} size={20} className={iconClass} /> {title}
      </h4>
      <ul className="space-y-3 text-text-secondary">
        {items.map((t) => (
          <li key={t} className="flex gap-2">
            <span className="text-border-strong">•</span> {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
