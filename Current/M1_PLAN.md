# M1 — Dataset Marketplace (Detailed Plan)

## Context

M0 stood up the three runtimes. M1 builds the **curated dataset index** — the only datasets the
planning agent (M5) is ever allowed to choose from. This is a hard safety boundary from the spec:
**no live Hugging Face search at runtime, ever**; the agent may only return ids that exist in
`marketplace/datasets.yaml`. M1 makes that file real (it's an empty `datasets: []` after M0),
adds a Rust loader + query API, and mirrors the index into SQLite for M3+ to join against.

M1 ships **no training and no UI** — just the index, its loader, and a query surface. Exit
criterion (from MILESTONES): a query call returns a ranked list of curated datasets, and the
agent can only see these ids.

## Key decisions (resolved before coding)

- **Marketplace lives in Rust** (`src-tauri/`), not Python. The architecture gives Rust ownership
  of SQLite, file paths, and orchestration; the agent (M5, spec Option A: rules-based) queries it.
  The Python worker never touches the marketplace — it receives a fully-resolved dataset in `plan.json`.
- **YAML is the single source of truth.** Parse `datasets.yaml` into an in-memory `Marketplace`
  struct at startup; that struct is the runtime query source (fast, DB-independent). The SQLite
  `datasets` table is a *mirror* for M3+ joins/persistence, not the hot path — so the exit
  criterion holds even if the DB mirror fails.
- **Crates:** `serde_yaml` 0.9 for parsing (works fine; note it's in maintenance — `serde_yml` is
  the fork alternative), `rusqlite` with `features = ["bundled"]` (no system SQLite dep), `dirs`
  for `~/.doclab/` resolution. Pin exact versions when adding.
- **Data-root pull-forward.** M1 creates `~/.doclab/` + opens `doclab.db` and creates the
  `datasets` table (it needs somewhere to mirror). _Adjustment from M0 plan, which deferred all
  data-root creation to M3._ M3 still owns the `experiments` table + the real migration framework.
- **Validation fails loud.** A malformed/incomplete entry aborts load with a clear error rather
  than silently skipping — a missing dataset at demo time is worse than a startup error in dev.
- **Pinned revision is mandatory** (commit SHA or tag, never `main`) for reproducibility. The
  exact SHA is fetched from the HF API during implementation (see steps), not guessed here.

## Curated datasets for M1

Target: 1–2 real tabular datasets with a binary label. Primary candidate verified to exist:

- **`imodels/diabetes-readmission`** — tabular, CSV, ~100K–1M rows, binary readmission outcome,
  tags: medicine/fairness/interpretability. This is the readmission golden-path dataset.
  ✅ Verified: label column **`readmitted`** (binary, last of 151 one-hot columns); files
  `train.csv` + `test.csv`; no explicit HF license (UCI Diabetes 130-US Hospitals port);
  pinned revision **`191ab1f0aa68d52f6cd55d68df57849fad1751ca`**.
- Optional second (only if time): a small UCI-derived binary clinical set for variety. Not
  required to hit the M1 exit criterion; one solid entry is enough.

Source: [imodels/diabetes-readmission](https://huggingface.co/datasets/imodels/diabetes-readmission)

## datasets.yaml entry shape (the contract)

```yaml
datasets:
  - id: diabetes_readmission           # stable internal id (agent selects THIS)
    name: Diabetes 130-US Hospitals Readmission
    hf_id: imodels/diabetes-readmission
    revision: 191ab1f0aa68d52f6cd55d68df57849fad1751ca   # pinned SHA — never "main"
    description: Predict 30-day hospital readmission from diabetic encounter records.
    category: readmission              # healthcare category
    data_type: tabular                 # tabular | image | text
    task_types: [predict, classify]
    modality: encounter records
    license: UCI port; no explicit HF license — research use
    size: "~100k rows (train.csv + test.csv)"
    label_column: readmitted
    limitations: Public UCI-derived research dataset; not representative of any single hospital.
```

Required fields (loader rejects an entry missing any): `id, name, hf_id, revision, data_type,
task_types, label_column`. The rest are descriptive but recommended.

## Target additions after M1

```
src-tauri/src/
├── lib.rs                  # register query_datasets command; init marketplace + db at startup
├── marketplace.rs          # NEW: Dataset struct, load_marketplace(), query(), validation
└── db.rs                   # NEW: open ~/.doclab/doclab.db, create+mirror `datasets` table
marketplace/datasets.yaml   # 1–2 real entries (replaces `datasets: []`)
src-tauri/Cargo.toml        # + serde_yaml, rusqlite (bundled), dirs
```

## Implementation steps

1. **Add crates.** `serde_yaml`, `rusqlite` (`features=["bundled"]`), `dirs` to `Cargo.toml`
   (serde/serde_json already present from Tauri). Pin exact versions.
2. **Verify + pin the dataset.** Resolve the real label column, license, and a commit SHA. Use the
   HF API (no auth needed for public): `GET https://huggingface.co/api/datasets/imodels/diabetes-readmission`
   for the license/sha, and a one-off `python3` snippet (`load_dataset(...).column_names`) to
   confirm the label column. Record the SHA as `revision`.
3. **Write `datasets.yaml`.** One verified entry (shape above), real pinned `revision`.
4. **`marketplace.rs`.** `#[derive(Serialize, Deserialize)] struct Dataset {…}` and
   `struct Marketplace { datasets: Vec<Dataset> }`. `load_marketplace(path) -> Result<Marketplace>`
   parses YAML and validates required fields (fail loud with the offending id/field).
   `query(&self, keyword: Option<&str>, data_type: Option<&str>, task_type: Option<&str>) ->
   Vec<&Dataset>` — case-insensitive keyword match over name/description/category/modality, plus
   optional type filters; rank by match count.
5. **`db.rs`.** `open_db()` → `dirs::home_dir()/.doclab/doclab.db` (create dir if missing).
   `create_datasets_table()` (idempotent `CREATE TABLE IF NOT EXISTS`). `mirror_datasets(&Marketplace)`
   → idempotent upsert (`INSERT … ON CONFLICT(id) DO UPDATE`). DB failure logs a warning but does
   NOT block the in-memory query path.
6. **Wire startup + command.** In `lib.rs` `setup`: load the YAML (resolve path via
   `CARGO_MANIFEST_DIR/../marketplace/datasets.yaml`), store the `Marketplace` in Tauri
   `State`, open the DB, mirror. Add `#[tauri::command] fn query_datasets(state, keyword,
   data_type, task_type) -> Vec<Dataset>`; register in `invoke_handler`.
7. **Tests.** Rust unit tests in `marketplace.rs`: (a) a fixture YAML loads and validates;
   (b) `query("readmission")` returns the diabetes entry; (c) an unknown keyword returns empty;
   (d) a fixture missing `label_column` fails validation. Run with `cargo test`.

## Critical files

- `src-tauri/src/marketplace.rs` — the contract: `Dataset` shape, validation, query/ranking. The
  agent (M5) depends on this query surface and on ids never being hallucinated.
- `marketplace/datasets.yaml` — source of truth; the only datasets that can ever appear.
- `src-tauri/src/db.rs` — `~/.doclab/doclab.db` + `datasets` mirror that M3 builds on.

## Verification (M1 exit criteria)

1. `cargo test` (in `src-tauri/`) → marketplace tests green (load, query hit, query miss, bad entry).
2. `cargo build` → green.
3. Manual: from the M0 "Check worker"-style harness or a temporary button, `invoke('query_datasets',
   { keyword: 'readmission' })` returns the diabetes entry; an unknown keyword returns `[]`.
4. `~/.doclab/doclab.db` exists with a `datasets` row matching the YAML (`sqlite3 … "select id from
   datasets"`), and re-running startup doesn't duplicate rows (idempotent mirror).
5. `revision` in the YAML is a real pinned SHA/tag, not `main`.

## Out of scope (deferred)

- Agent intent-parsing / dataset *selection* logic → M5 (M1 only exposes the query surface).
- Downloading dataset files / HF cache under `datasets/<id>/` → M2 (worker does this at train time).
- `experiments` table + real migration framework → M3 (M1 adds only the `datasets` table).
- Image/text dataset entries → M9/M10. Dataset profiling (`data_profile.json`) → M5.
