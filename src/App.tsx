import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [workerOutput, setWorkerOutput] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  async function checkWorker() {
    setChecking(true);
    setError("");
    setWorkerOutput("");
    try {
      setWorkerOutput(await invoke<string>("worker_healthcheck"));
    } catch (e) {
      setError(String(e));
    } finally {
      setChecking(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      <header className="px-8 pt-10 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight">DocLab</h1>
        <p className="text-neutral-500 mt-1">
          Local-first healthcare ML prototyping lab
        </p>
      </header>

      <div className="mx-8 mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
        Research and prototyping only — not for clinical care. No private
        patient data.
      </div>

      <section className="px-8 flex-1">
        <button
          onClick={checkWorker}
          disabled={checking}
          className="rounded-md bg-neutral-900 px-4 py-2 text-white text-sm font-medium hover:bg-neutral-700 disabled:opacity-50"
        >
          {checking ? "Checking…" : "Check worker"}
        </button>

        {workerOutput && (
          <pre className="mt-4 max-w-2xl whitespace-pre-wrap rounded-md bg-neutral-900 p-4 text-xs text-neutral-100">
            {workerOutput}
          </pre>
        )}
        {error && (
          <pre className="mt-4 max-w-2xl whitespace-pre-wrap rounded-md bg-red-50 p-4 text-xs text-red-700 border border-red-200">
            {error}
          </pre>
        )}
      </section>
    </main>
  );
}

export default App;
