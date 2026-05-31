import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";

function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface-container-lowest p-6">
      <h3 className="mb-4 flex items-center gap-2 font-headline-md text-headline-md text-primary">
        <Icon name={icon} className="text-text-muted" />
        <span>{title}</span>
      </h3>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-label-sm text-label-sm text-text-secondary">
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-border-strong focus:outline-none transition-colors";

export function Settings() {
  const [worker, setWorker] = useState<{
    state: "idle" | "checking" | "ok" | "error";
    text: string;
  }>({ state: "idle", text: "" });

  async function checkWorker() {
    setWorker({ state: "checking", text: "" });
    try {
      const out = await invoke<string>("worker_healthcheck");
      setWorker({ state: "ok", text: out });
    } catch (e) {
      setWorker({ state: "error", text: String(e) });
    }
  }

  return (
    <AppShell title="Settings">
      <div className="mx-auto w-full max-w-[1080px] space-y-6 p-8">
        {/* Workspace */}
        <Section icon="domain" title="Workspace">
          <div className="space-y-4">
            <div className="mb-2 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-muted">
                <Icon name="biotech" size={30} className="text-text-disabled" />
              </div>
              <button className="rounded-lg border border-border-strong px-4 py-2 font-label-sm text-label-sm text-text-primary transition-colors hover:bg-surface-muted">
                Change avatar
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Workspace name</Label>
                <input className={inputCls} defaultValue="DocLab ML Env" />
              </div>
              <div className="space-y-2">
                <Label>Research institution</Label>
                <input className={inputCls} defaultValue="Community Research Lab" />
              </div>
            </div>
          </div>
        </Section>

        {/* Agent config */}
        <Section icon="smart_toy" title="Agent configuration">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Plan parsing</Label>
              <select className={`${inputCls} appearance-none`}>
                <option>Rule-based (curated registry)</option>
                <option>LLM-assisted parsing</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Preferred datasets</Label>
              <div className="flex flex-wrap gap-2">
                {["MIMIC-IV", "Diabetes 130-US"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-border bg-surface-muted px-3 py-1 font-label-sm text-label-sm text-text-secondary"
                  >
                    {t}
                    <button className="ml-2 transition-colors hover:text-error-text">
                      <Icon name="close" size={14} />
                    </button>
                  </span>
                ))}
                <button className="inline-flex items-center rounded-full border border-dashed border-border-strong px-3 py-1 font-label-sm text-label-sm text-text-muted transition-colors hover:bg-surface-muted">
                  <Icon name="add" size={14} className="mr-1" /> Add dataset
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Log verbosity</Label>
              <div className="flex items-center gap-4">
                {["Minimal", "Standard", "Debug"].map((v) => (
                  <label key={v} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="verbosity"
                      defaultChecked={v === "Standard"}
                      className="border-border text-primary focus:ring-primary"
                    />
                    <span className="text-text-primary">{v}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* System / worker */}
        <Section icon="dns" title="System &amp; worker">
          <div className="space-y-3">
            <p className="font-body-md text-body-md text-text-secondary">
              Verify the local Python training worker is reachable from the Rust
              backend. (Live Tauri command.)
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={checkWorker}
                disabled={worker.state === "checking"}
                className="rounded-lg bg-primary px-4 py-2 font-label-sm text-label-sm text-on-primary transition-colors hover:bg-inverse-surface disabled:opacity-50"
              >
                {worker.state === "checking" ? "Checking…" : "Check worker"}
              </button>
              {worker.state === "ok" && (
                <span className="flex items-center gap-1 font-label-sm text-label-sm text-success-text">
                  <Icon name="check_circle" size={16} /> Worker reachable
                </span>
              )}
              {worker.state === "error" && (
                <span className="flex items-center gap-1 font-label-sm text-label-sm text-error-text">
                  <Icon name="error" size={16} /> Not reachable
                </span>
              )}
            </div>
            {worker.text && (
              <pre className="max-w-2xl overflow-x-auto whitespace-pre-wrap rounded-lg border border-outline-variant bg-log-bg p-3 font-code-sm text-code-sm text-log-text">
                {worker.text}
              </pre>
            )}
          </div>
        </Section>

        {/* Security */}
        <Section icon="security" title="Security &amp; access">
          <div className="space-y-2">
            <Label>Your role</Label>
            <div className="flex items-center justify-between rounded-lg border border-border bg-surface-muted p-3">
              <div className="flex items-center gap-2">
                <Icon name="admin_panel_settings" className="text-primary" />
                <span className="font-semibold text-text-primary">
                  Administrator
                </span>
              </div>
              <span className="rounded-full border border-success-text/20 bg-success-bg px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-success-text">
                Active
              </span>
            </div>
            <p className="mt-1 font-label-sm text-label-sm text-text-muted">
              Full access to workspace settings, dataset registry, and model
              promotion. No PHI or private uploads are ever permitted.
            </p>
          </div>
        </Section>

        {/* Actions */}
        <div className="flex justify-end gap-4 border-t border-border pt-6">
          <button className="rounded-lg border border-border-strong px-6 py-2 font-label-sm text-label-sm text-text-primary transition-colors hover:bg-surface-muted">
            Discard changes
          </button>
          <button className="rounded-lg bg-primary px-6 py-2 font-label-sm text-label-sm text-on-primary transition-colors hover:bg-inverse-surface">
            Save settings
          </button>
        </div>
      </div>
    </AppShell>
  );
}
