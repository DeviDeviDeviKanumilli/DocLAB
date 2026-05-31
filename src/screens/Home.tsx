import { useState, type CSSProperties } from "react";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { useRouter } from "../router";

interface Example {
  icon: string;
  title: string;
  blurb: string;
  goal: string;
}

const EXAMPLES: Example[] = [
  {
    icon: "analytics",
    title: "Predict readmission risk",
    blurb: "Using EHR-style tabular data and historical patient flows.",
    goal: "Predict hospital readmission risk from patient-style tabular data",
  },
  {
    icon: "medical_information",
    title: "Classify medical images",
    blurb: "Identify anomalies in chest X-rays from a curated public set.",
    goal: "Classify chest X-ray images as normal or abnormal",
  },
  {
    icon: "summarize",
    title: "Summarize medical education text",
    blurb: "Extract key insights from open clinical-education passages.",
    goal: "Summarize medical education text into concise notes",
  },
  {
    icon: "table_chart",
    title: "Classify clinical tabular records",
    blurb: "Predict an outcome label from structured encounter data.",
    goal: "Classify diabetic patient encounters by readmission outcome",
  },
];

export function Home() {
  const { navigate } = useRouter();
  const [goal, setGoal] = useState("");

  function start(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    navigate("plan", { goal: trimmed });
  }

  return (
    <AppShell showSearch>
      <div className="flex min-h-full flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-[720px] animate-fade-in-up">
          <h2 className="mb-8 text-center font-headline-lg text-[28px] leading-9 font-semibold text-primary tracking-tight">
            What healthcare AI model do you want to prototype?
          </h2>

          {/* Goal input */}
          <div className="relative rounded-xl border border-border bg-surface-container-lowest p-1 shadow-sm transition-all focus-within:border-outline focus-within:ring-1 focus-within:ring-outline">
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) start(goal);
              }}
              spellCheck={false}
              placeholder="I want to predict hospital readmission risk from patient-style tabular data..."
              className="h-[160px] w-full resize-none border-none bg-transparent p-4 font-body-md text-body-md text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-0"
            />
            <div className="flex items-center justify-between px-3 pb-2">
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-text-muted">
                <Icon name="attach_file" size={16} />
                Attach dataset
              </div>
              <button
                onClick={() => start(goal)}
                disabled={!goal.trim()}
                className="flex items-center gap-2 rounded bg-primary px-5 py-2 font-headline-md text-headline-md text-on-primary transition-all hover:bg-inverse-surface active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Start Prototype
                <Icon name="arrow_forward" size={18} />
              </button>
            </div>
          </div>

          {/* Examples */}
          <div className="mt-10">
            <p className="mb-4 text-center font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
              Example scenarios
            </p>
            <div className="stagger grid grid-cols-1 gap-3 sm:grid-cols-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={ex.title}
                  style={{ "--i": i + 1 } as CSSProperties}
                  onClick={() => {
                    setGoal(ex.goal);
                    start(ex.goal);
                  }}
                  className="group rounded-lg border border-border bg-surface p-4 text-left transition-all hover:border-border-strong hover:bg-surface-muted hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      name={ex.icon}
                      className="text-text-secondary transition-colors group-hover:text-primary"
                    />
                    <div>
                      <h3 className="mb-1 font-headline-md text-headline-md text-text-primary">
                        {ex.title}
                      </h3>
                      <p className="font-label-sm text-label-sm text-text-muted">
                        {ex.blurb}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
