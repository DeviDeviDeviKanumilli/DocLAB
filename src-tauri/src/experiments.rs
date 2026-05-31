use crate::db;
use crate::marketplace::{Dataset, Marketplace};
use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};
use uuid::Uuid;

const SCHEMA_VERSION: u8 = 1;
const DEFAULT_DATASET_ID: &str = "diabetes_readmission";

#[derive(Debug, Clone, Deserialize)]
pub struct AgentArtifacts {
    pub intent: String,
    pub selection: String,
    pub profile: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkerPlan {
    pub schema_version: u8,
    pub dataset_id: String,
    pub hf_id: String,
    pub revision: String,
    pub label_column: String,
    pub model_type: String,
    pub framework: String,
    pub device: String,
    pub seed: u64,
    pub split: Vec<f64>,
    pub primary_metric: String,
    pub goal_text: Option<String>,
    pub summary: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub local_csv: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PlanPreview {
    pub goal_text: String,
    pub dataset: Dataset,
    pub plan: WorkerPlan,
    pub summary: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ExperimentSummary {
    pub id: String,
    pub created_at_ms: i64,
    pub updated_at_ms: i64,
    pub status: String,
    pub goal_text: String,
    pub dataset_id: String,
    pub primary_metric: Option<String>,
    pub metric_value: Option<f64>,
    pub baseline_metric: Option<f64>,
    pub is_best: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ExperimentDetail {
    pub id: String,
    pub created_at_ms: i64,
    pub updated_at_ms: i64,
    pub status: String,
    pub goal_text: String,
    pub dataset_id: String,
    pub primary_metric: Option<String>,
    pub metric_value: Option<f64>,
    pub baseline_metric: Option<f64>,
    pub model_type: Option<String>,
    pub framework: Option<String>,
    pub device: Option<String>,
    pub plan_path: String,
    pub metrics_path: Option<String>,
    pub error_path: Option<String>,
    pub model_card_path: Option<String>,
    pub model_card_content: Option<String>,
    pub worker_stdout: Option<String>,
    pub worker_stderr: Option<String>,
    pub error_code: Option<String>,
    pub error_message: Option<String>,
    pub metrics: Option<Value>,
    pub error: Option<Value>,
    pub is_best: bool,
}

#[derive(Debug, Clone, Deserialize)]
struct MetricsBlob {
    schema_version: u8,
    primary_metric: String,
    metric_value: f64,
    baseline_metric: f64,
    model_type: String,
    framework: String,
    device: String,
    #[serde(default)]
    device_fallback: bool,
    #[serde(default)]
    warning: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
struct ErrorBlob {
    schema_version: u8,
    code: String,
    message: String,
}

pub fn create_plan(
    market: &Marketplace,
    goal_text: String,
    dataset_id: Option<String>,
) -> Result<PlanPreview, String> {
    let wanted_id = dataset_id.unwrap_or_else(|| DEFAULT_DATASET_ID.to_string());
    let dataset = market
        .datasets
        .iter()
        .find(|d| d.id == wanted_id)
        .ok_or_else(|| format!("dataset id '{wanted_id}' is not in the curated marketplace"))?;

    let data_type = dataset.data_type.to_lowercase();
    let (model_type, framework, summary): (&str, &str, String) = match data_type.as_str() {
        "tabular" => (
            "xgboost",
            "xgboost",
            format!(
                "Train a decision-tree tabular prototype on {} and report accuracy against a majority-class baseline.",
                dataset.name
            ),
        ),
        "image" => (
            "cnn",
            "pytorch",
            format!(
                "Train a small convolutional network on {} (subsampled for time) and report accuracy against a majority-class baseline.",
                dataset.name
            ),
        ),
        other => {
            return Err(format!(
                "dataset '{}' is {}, which is not yet supported (tabular and image only)",
                dataset.id, other
            ));
        }
    };

    // Image runs use the Mac GPU when available; the worker resolves the real
    // device at runtime and may fall back to CPU. Tabular stays CPU.
    let device = if data_type == "image" { "mps" } else { "cpu" };

    let plan = WorkerPlan {
        schema_version: SCHEMA_VERSION,
        dataset_id: dataset.id.clone(),
        hf_id: dataset.hf_id.clone(),
        revision: dataset.revision.clone(),
        label_column: dataset.label_column.clone(),
        model_type: model_type.to_string(),
        framework: framework.to_string(),
        device: device.to_string(),
        seed: 42,
        split: vec![0.8, 0.1, 0.1],
        primary_metric: "accuracy".to_string(),
        goal_text: Some(goal_text.clone()),
        summary: Some(summary.clone()),
        local_csv: None,
    };

    Ok(PlanPreview {
        goal_text,
        dataset: dataset.clone(),
        plan,
        summary,
    })
}

fn sanitize_model_name(goal: &str) -> String {
    let clean: String = goal
        .chars()
        .take(50)
        .filter(|c| c.is_alphanumeric() || c.is_whitespace())
        .collect();
    let trimmed = clean.trim();
    if trimmed.is_empty() {
        "Prototype Model".to_string()
    } else {
        trimmed.to_string()
    }
}

fn infer_task_type(plan: &WorkerPlan) -> &'static str {
    match plan.model_type.as_str() {
        "cnn" => "Image classification",
        _ => "Binary classification",
    }
}

fn model_display_name(model_type: &str) -> String {
    match model_type {
        "xgboost" => "Gradient-boosted decision trees (XGBoost)".to_string(),
        "logistic_regression" => "Logistic regression".to_string(),
        "cnn" => "Small convolutional neural network (PyTorch)".to_string(),
        other => other.to_string(),
    }
}

fn generate_model_card(
    experiment_dir: &Path,
    goal_text: &str,
    dataset: &Dataset,
    plan: &WorkerPlan,
    metrics: &MetricsBlob,
) -> Result<String, String> {
    let model_card_path = experiment_dir.join("model_card.md");
    let model_name = sanitize_model_name(goal_text);
    let task = infer_task_type(plan);
    let model_display = model_display_name(&metrics.model_type);
    let result_pct = (metrics.metric_value * 100.0).round() as i64;
    let baseline_pct = (metrics.baseline_metric * 100.0).round() as i64;

    let sanity_note = if metrics.metric_value <= metrics.baseline_metric + 0.02 {
        "\n\n> **Sanity check:** the result is at or near the majority-class baseline. The model may not be learning meaningful signal from this data."
    } else {
        ""
    };

    let dataset_limitation = if dataset.limitations.trim().is_empty() {
        String::new()
    } else {
        format!("\n- {}", dataset.limitations.trim())
    };

    // Worker-emitted notes: small-data warning (image) + MPS->CPU fallback.
    let mut extra_notes = String::new();
    if let Some(w) = &metrics.warning {
        if !w.trim().is_empty() {
            extra_notes.push_str(&format!("\n\n> **Note:** {}", w.trim()));
        }
    }
    if metrics.device_fallback {
        extra_notes.push_str(
            "\n\n> **Note:** GPU (MPS) training failed and the run fell back to CPU.",
        );
    }

    let revision_short = &plan.revision[..7.min(plan.revision.len())];
    let split_display = format!(
        "{:.0}/{:.0}/{:.0}",
        plan.split[0] * 100.0,
        plan.split[1] * 100.0,
        plan.split[2] * 100.0
    );

    let card = format!(
        "# {model_name}\n\n\
**Goal:** {goal_text}\n\
**Intended use:** Research and prototyping only — not for clinical decisions.\n\n\
## Summary\n\
- **Dataset:** {dataset_name} (public / de-identified)\n\
- **Task:** {task}\n\
- **Model:** {model_display}\n\
- **Result:** {result_pct}% accuracy (baseline: {baseline_pct}%){sanity_note}{extra_notes}\n\n\
## Limitations\n\
- Trained on a public prototype dataset; may not generalize to real hospitals.{dataset_limitation}\n\n\
## Risks\n\
- Not validated for patient care. Do not use for diagnosis or treatment decisions.\n\
- False positives or false negatives could lead to inappropriate clinical actions.\n\
- Performance may degrade on populations not represented in the training data.\n\n\
## Reproducibility\n\
- **Dataset:** `{hf_id}@{revision_short}`\n\
- **Seed:** {seed}\n\
- **Split ratio:** {split_display}\n\
- **Device:** {device}\n\
- **Framework:** {framework}\n\
- **Hyperparameters:** see `plan.json` in this experiment directory.\n\n\
---\n\n\
*Auto-generated by DocLab. For research and prototyping use only.*\n",
        model_name = model_name,
        goal_text = goal_text,
        dataset_name = dataset.name,
        task = task,
        model_display = model_display,
        result_pct = result_pct,
        baseline_pct = baseline_pct,
        sanity_note = sanity_note,
        dataset_limitation = dataset_limitation,
        hf_id = plan.hf_id,
        revision_short = revision_short,
        seed = plan.seed,
        split_display = split_display,
        device = metrics.device,
        framework = metrics.framework,
    );

    fs::write(&model_card_path, card)
        .map_err(|e| format!("cannot write model_card.md: {e}"))?;
    Ok(path_string(&model_card_path))
}

pub fn run_experiment(
    market: &Marketplace,
    plan: WorkerPlan,
    goal_text: String,
    agent_artifacts: AgentArtifacts,
) -> Result<ExperimentDetail, String> {
    validate_plan(&plan)?;

    let dataset = market
        .datasets
        .iter()
        .find(|d| d.id == plan.dataset_id)
        .ok_or_else(|| {
            format!(
                "dataset id '{}' is not in the curated marketplace",
                plan.dataset_id
            )
        })?
        .clone();

    let conn = db::open_db()?;
    let id = generate_experiment_id();
    let experiment_dir = db::experiments_dir()?.join(&id);
    fs::create_dir_all(&experiment_dir).map_err(|e| {
        format!(
            "cannot create experiment dir {}: {e}",
            experiment_dir.display()
        )
    })?;

    // Write agent artifacts BEFORE plan.json
    write_agent_artifacts(&experiment_dir, &agent_artifacts)?;

    let plan_path = experiment_dir.join("plan.json");
    let metrics_path = experiment_dir.join("metrics.json");
    let error_path = experiment_dir.join("error.json");
    let plan_text =
        serde_json::to_string_pretty(&plan).map_err(|e| format!("cannot serialize plan: {e}"))?;
    fs::write(&plan_path, plan_text)
        .map_err(|e| format!("cannot write {}: {e}", plan_path.display()))?;

    let now = now_ms();
    insert_running(
        &conn,
        &id,
        now,
        &goal_text,
        &plan.dataset_id,
        &path_string(&plan_path),
    )?;

    let output = Command::new(worker_python())
        .args(["-m", "doclab_worker", "--job"])
        .arg(&plan_path)
        .current_dir(worker_dir())
        .output();

    match output {
        Ok(output) if output.status.success() => match parse_metrics_file(&metrics_path) {
            Ok((metrics, _)) => {
                let model_card_path =
                    generate_model_card(&experiment_dir, &goal_text, &dataset, &plan, &metrics)?;
                update_complete(
                    &conn,
                    &id,
                    &metrics,
                    &path_string(&metrics_path),
                    &model_card_path,
                    &String::from_utf8_lossy(&output.stdout),
                    &String::from_utf8_lossy(&output.stderr),
                )?;
                recompute_best_for_goal(&conn, &goal_text)?;
            }
            Err(e) => {
                update_failed(
                    &conn,
                    &id,
                    Some(&path_string(&error_path)),
                    &String::from_utf8_lossy(&output.stdout),
                    &String::from_utf8_lossy(&output.stderr),
                    "bad_metrics",
                    &e,
                )?;
            }
        },
        Ok(output) => {
            let parsed_error = parse_error_file(&error_path).ok();
            let (code, message) = if let Some(error) = parsed_error {
                (error.code, error.message)
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr);
                let message = if stderr.trim().is_empty() {
                    "worker failed without error.json".to_string()
                } else {
                    stderr.trim().to_string()
                };
                ("unknown".to_string(), message)
            };
            update_failed(
                &conn,
                &id,
                Some(&path_string(&error_path)),
                &String::from_utf8_lossy(&output.stdout),
                &String::from_utf8_lossy(&output.stderr),
                &code,
                &message,
            )?;
        }
        Err(e) => {
            update_failed(
                &conn,
                &id,
                None,
                "",
                "",
                "unknown",
                &format!("failed to launch worker: {e}"),
            )?;
        }
    }

    get_experiment_by_id(&conn, &id)
}

pub fn list_experiments() -> Result<Vec<ExperimentSummary>, String> {
    let conn = db::open_db()?;
    let mut stmt = conn
        .prepare(
            "SELECT id, created_at_ms, updated_at_ms, status, goal_text, dataset_id,
                    primary_metric, metric_value, baseline_metric, is_best
             FROM experiments
             ORDER BY created_at_ms DESC",
        )
        .map_err(|e| format!("cannot list experiments: {e}"))?;
    let rows = stmt
        .query_map([], |row| {
            Ok(ExperimentSummary {
                id: row.get(0)?,
                created_at_ms: row.get(1)?,
                updated_at_ms: row.get(2)?,
                status: row.get(3)?,
                goal_text: row.get(4)?,
                dataset_id: row.get(5)?,
                primary_metric: row.get(6)?,
                metric_value: row.get(7)?,
                baseline_metric: row.get(8)?,
                is_best: row.get::<_, i64>(9)? != 0,
            })
        })
        .map_err(|e| format!("cannot query experiments: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("cannot read experiment row: {e}"))
}

pub fn get_experiment(id: String) -> Result<ExperimentDetail, String> {
    let conn = db::open_db()?;
    get_experiment_by_id(&conn, &id)
}

pub(crate) fn generate_experiment_id() -> String {
    let random = Uuid::new_v4().simple().to_string();
    format!("exp_{}_{}", now_ms(), &random[..8])
}

fn validate_plan(plan: &WorkerPlan) -> Result<(), String> {
    if plan.schema_version != SCHEMA_VERSION {
        return Err(format!(
            "unsupported plan schema_version: {}",
            plan.schema_version
        ));
    }
    if plan.dataset_id.trim().is_empty() {
        return Err("plan missing dataset_id".to_string());
    }
    if plan.hf_id.trim().is_empty() || plan.revision.trim().is_empty() {
        return Err("plan missing hf_id/revision".to_string());
    }
    if plan.label_column.trim().is_empty() {
        return Err("plan missing label_column".to_string());
    }
    if plan.split.len() != 3 {
        return Err("plan split must have exactly three ratios".to_string());
    }
    Ok(())
}

fn insert_running(
    conn: &Connection,
    id: &str,
    created_at_ms: i64,
    goal_text: &str,
    dataset_id: &str,
    plan_path: &str,
) -> Result<(), String> {
    conn.execute(
        "INSERT INTO experiments
            (id, created_at_ms, updated_at_ms, status, goal_text, dataset_id, plan_path)
         VALUES (?1, ?2, ?2, 'running', ?3, ?4, ?5)",
        params![id, created_at_ms, goal_text, dataset_id, plan_path],
    )
    .map(|_| ())
    .map_err(|e| format!("cannot insert experiment '{id}': {e}"))
}

fn update_complete(
    conn: &Connection,
    id: &str,
    metrics: &MetricsBlob,
    metrics_path: &str,
    model_card_path: &str,
    stdout: &str,
    stderr: &str,
) -> Result<(), String> {
    conn.execute(
        "UPDATE experiments SET
            updated_at_ms=?2, status='complete', primary_metric=?3,
            metric_value=?4, baseline_metric=?5, model_type=?6, framework=?7,
            device=?8, metrics_path=?9, model_card_path=?10, worker_stdout=?11, worker_stderr=?12,
            error_code=NULL, error_message=NULL
         WHERE id=?1",
        params![
            id,
            now_ms(),
            metrics.primary_metric,
            metrics.metric_value,
            metrics.baseline_metric,
            metrics.model_type,
            metrics.framework,
            metrics.device,
            metrics_path,
            model_card_path,
            stdout,
            stderr,
        ],
    )
    .map(|_| ())
    .map_err(|e| format!("cannot update completed experiment '{id}': {e}"))
}

/// Recompute the `is_best` flag across all completed runs sharing a goal.
/// Phase 1 has no separate project id, so a "project" is everything with the
/// same `goal_text`. The highest `metric_value` wins; ties break toward the
/// most recent run. Clears the flag for the whole group first so exactly one
/// row (or zero, if the group has no completed runs) ends up flagged.
fn recompute_best_for_goal(conn: &Connection, goal_text: &str) -> Result<(), String> {
    conn.execute(
        "UPDATE experiments SET is_best=0 WHERE goal_text=?1",
        params![goal_text],
    )
    .map_err(|e| format!("cannot clear is_best for goal: {e}"))?;

    conn.execute(
        "UPDATE experiments SET is_best=1
         WHERE id = (
            SELECT id FROM experiments
            WHERE goal_text=?1 AND status='complete' AND metric_value IS NOT NULL
            ORDER BY metric_value DESC, created_at_ms DESC
            LIMIT 1
         )",
        params![goal_text],
    )
    .map(|_| ())
    .map_err(|e| format!("cannot set is_best for goal: {e}"))
}

fn update_failed(
    conn: &Connection,
    id: &str,
    error_path: Option<&str>,
    stdout: &str,
    stderr: &str,
    error_code: &str,
    error_message: &str,
) -> Result<(), String> {
    conn.execute(
        "UPDATE experiments SET
            updated_at_ms=?2, status='failed', error_path=?3,
            worker_stdout=?4, worker_stderr=?5, error_code=?6, error_message=?7
         WHERE id=?1",
        params![
            id,
            now_ms(),
            error_path,
            stdout,
            stderr,
            error_code,
            error_message
        ],
    )
    .map(|_| ())
    .map_err(|e| format!("cannot update failed experiment '{id}': {e}"))
}

fn get_experiment_by_id(conn: &Connection, id: &str) -> Result<ExperimentDetail, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, created_at_ms, updated_at_ms, status, goal_text, dataset_id,
                    primary_metric, metric_value, baseline_metric, model_type, framework,
                    device, plan_path, metrics_path, error_path, model_card_path,
                    worker_stdout, worker_stderr, error_code, error_message, is_best
             FROM experiments
             WHERE id=?1",
        )
        .map_err(|e| format!("cannot prepare experiment lookup: {e}"))?;

    let detail = stmt
        .query_row([id], |row| {
            let metrics_path: Option<String> = row.get(13)?;
            let error_path: Option<String> = row.get(14)?;
            let model_card_path: Option<String> = row.get(15)?;
            Ok(ExperimentDetail {
                id: row.get(0)?,
                created_at_ms: row.get(1)?,
                updated_at_ms: row.get(2)?,
                status: row.get(3)?,
                goal_text: row.get(4)?,
                dataset_id: row.get(5)?,
                primary_metric: row.get(6)?,
                metric_value: row.get(7)?,
                baseline_metric: row.get(8)?,
                model_type: row.get(9)?,
                framework: row.get(10)?,
                device: row.get(11)?,
                plan_path: row.get(12)?,
                metrics: read_json_if_present(&metrics_path),
                error: read_json_if_present(&error_path),
                metrics_path,
                error_path,
                model_card_content: read_text_if_present(&model_card_path),
                model_card_path,
                worker_stdout: row.get(16)?,
                worker_stderr: row.get(17)?,
                error_code: row.get(18)?,
                error_message: row.get(19)?,
                is_best: row.get::<_, i64>(20)? != 0,
            })
        })
        .optional()
        .map_err(|e| format!("cannot read experiment '{id}': {e}"))?;

    detail.ok_or_else(|| format!("experiment '{id}' not found"))
}

fn parse_metrics_file(path: &Path) -> Result<(MetricsBlob, Value), String> {
    let text = fs::read_to_string(path)
        .map_err(|e| format!("cannot read metrics {}: {e}", path.display()))?;
    let value: Value =
        serde_json::from_str(&text).map_err(|e| format!("metrics is invalid JSON: {e}"))?;
    let metrics: MetricsBlob =
        serde_json::from_value(value.clone()).map_err(|e| format!("bad metrics shape: {e}"))?;
    if metrics.schema_version != SCHEMA_VERSION {
        return Err(format!(
            "unsupported metrics schema_version: {}",
            metrics.schema_version
        ));
    }
    Ok((metrics, value))
}

fn parse_error_file(path: &Path) -> Result<ErrorBlob, String> {
    let text = fs::read_to_string(path)
        .map_err(|e| format!("cannot read error {}: {e}", path.display()))?;
    let error: ErrorBlob =
        serde_json::from_str(&text).map_err(|e| format!("error is invalid JSON: {e}"))?;
    if error.schema_version != SCHEMA_VERSION {
        return Err(format!(
            "unsupported error schema_version: {}",
            error.schema_version
        ));
    }
    Ok(error)
}

fn read_json_if_present(path: &Option<String>) -> Option<Value> {
    path.as_ref()
        .and_then(|p| fs::read_to_string(p).ok())
        .and_then(|text| serde_json::from_str(&text).ok())
}

fn read_text_if_present(path: &Option<String>) -> Option<String> {
    path.as_ref().and_then(|p| fs::read_to_string(p).ok())
}

fn worker_python() -> String {
    if let Ok(py) = std::env::var("DOCLAB_PYTHON") {
        return py;
    }
    let venv = worker_dir().join(".venv/bin/python");
    if venv.exists() {
        return venv.to_string_lossy().into_owned();
    }
    "python3".to_string()
}

fn worker_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../worker")
}

fn now_ms() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("system clock is before unix epoch")
        .as_millis() as i64
}

fn path_string(path: &Path) -> String {
    path.to_string_lossy().into_owned()
}

fn write_agent_artifacts(
    experiment_dir: &Path,
    artifacts: &AgentArtifacts,
) -> Result<(), String> {
    fs::write(experiment_dir.join("intent.json"), &artifacts.intent)
        .map_err(|e| format!("cannot write intent.json: {e}"))?;
    fs::write(
        experiment_dir.join("dataset_selection.json"),
        &artifacts.selection,
    )
    .map_err(|e| format!("cannot write dataset_selection.json: {e}"))?;
    fs::write(experiment_dir.join("data_profile.json"), &artifacts.profile)
        .map_err(|e| format!("cannot write data_profile.json: {e}"))?;
    Ok(())
}

const DEMO_SEED_ID: &str = "exp_demo_seed";

fn seed_bundle_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../demo/seed_experiment")
}

/// Seed the Fallback A demo run (DEMO.md): a pre-completed experiment that
/// appears in history with a working model card, ready to open if a live run
/// fails or runs long during the demo. Idempotent — skips if already seeded.
pub fn seed_demo_experiment() -> Result<(), String> {
    let conn = db::open_db()?;
    let already_seeded = conn
        .query_row(
            "SELECT 1 FROM experiments WHERE id=?1",
            params![DEMO_SEED_ID],
            |_| Ok(()),
        )
        .optional()
        .map_err(|e| format!("cannot check demo seed: {e}"))?
        .is_some();
    if already_seeded {
        return Ok(());
    }

    let bundle = seed_bundle_dir();
    let plan_src = bundle.join("plan.json");
    let metrics_src = bundle.join("metrics.json");
    let card_src = bundle.join("model_card.md");
    if !plan_src.exists() || !metrics_src.exists() || !card_src.exists() {
        return Err(format!("demo seed bundle incomplete at {}", bundle.display()));
    }

    let dir = db::experiments_dir()?.join(DEMO_SEED_ID);
    fs::create_dir_all(&dir).map_err(|e| format!("cannot create demo seed dir: {e}"))?;
    let plan_dst = dir.join("plan.json");
    let metrics_dst = dir.join("metrics.json");
    let card_dst = dir.join("model_card.md");
    fs::copy(&plan_src, &plan_dst).map_err(|e| format!("cannot copy seed plan: {e}"))?;
    fs::copy(&metrics_src, &metrics_dst).map_err(|e| format!("cannot copy seed metrics: {e}"))?;
    fs::copy(&card_src, &card_dst).map_err(|e| format!("cannot copy seed card: {e}"))?;

    let (metrics, _) = parse_metrics_file(&metrics_dst)?;
    let plan: WorkerPlan = serde_json::from_str(
        &fs::read_to_string(&plan_dst).map_err(|e| format!("cannot read seed plan: {e}"))?,
    )
    .map_err(|e| format!("seed plan is invalid: {e}"))?;
    let goal_text = plan
        .goal_text
        .clone()
        .unwrap_or_else(|| "Demo readmission prototype".to_string());

    insert_running(
        &conn,
        DEMO_SEED_ID,
        now_ms(),
        &goal_text,
        &plan.dataset_id,
        &path_string(&plan_dst),
    )?;
    update_complete(
        &conn,
        DEMO_SEED_ID,
        &metrics,
        &path_string(&metrics_dst),
        &path_string(&card_dst),
        "",
        "",
    )?;
    recompute_best_for_goal(&conn, &goal_text)?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use rusqlite::Connection;

    fn conn() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        db::create_experiments_table(&conn).unwrap();
        db::create_experiments_table(&conn).unwrap();
        conn
    }

    fn temp_file(name: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!("doclab_m3_{}", generate_experiment_id()));
        fs::create_dir_all(&dir).unwrap();
        dir.join(name)
    }

    #[test]
    fn experiment_ids_do_not_collide() {
        let mut ids = std::collections::HashSet::new();
        for _ in 0..100 {
            assert!(ids.insert(generate_experiment_id()));
        }
    }

    #[test]
    fn insert_update_list_get_roundtrip() {
        let conn = conn();
        let plan_path = temp_file("plan.json");
        let metrics_path = plan_path.with_file_name("metrics.json");
        fs::write(&plan_path, "{}").unwrap();
        fs::write(
            &metrics_path,
            r#"{
                "schema_version": 1,
                "primary_metric": "accuracy",
                "metric_value": 0.75,
                "baseline_metric": 0.5,
                "device": "cpu",
                "seed": 42,
                "split": [0.8, 0.1, 0.1],
                "n_train": 8,
                "n_val": 1,
                "n_test": 1,
                "model_type": "xgboost",
                "framework": "xgboost"
            }"#,
        )
        .unwrap();

        insert_running(
            &conn,
            "exp_test",
            1,
            "Predict readmission",
            "diabetes_readmission",
            &path_string(&plan_path),
        )
        .unwrap();
        let (metrics, _) = parse_metrics_file(&metrics_path).unwrap();
        update_complete(
            &conn,
            "exp_test",
            &metrics,
            &path_string(&metrics_path),
            &path_string(&plan_path.with_file_name("model_card.md")),
            "stdout",
            "stderr",
        )
        .unwrap();

        let detail = get_experiment_by_id(&conn, "exp_test").unwrap();
        assert_eq!(detail.status, "complete");
        assert_eq!(detail.metric_value, Some(0.75));
        assert!(detail.metrics.is_some());

        let listed = list_experiments_from_conn(&conn).unwrap();
        assert_eq!(listed.len(), 1);
        assert_eq!(listed[0].id, "exp_test");
    }

    #[test]
    fn missing_experiment_is_clean_error() {
        let conn = conn();
        let err = get_experiment_by_id(&conn, "missing").unwrap_err();
        assert!(err.contains("not found"));
    }

    #[test]
    fn exactly_one_best_per_goal() {
        let conn = conn();
        let metrics = |value: f64| MetricsBlob {
            schema_version: 1,
            primary_metric: "accuracy".to_string(),
            metric_value: value,
            baseline_metric: 0.5,
            model_type: "xgboost".to_string(),
            framework: "xgboost".to_string(),
            device: "cpu".to_string(),
            device_fallback: false,
            warning: None,
        };

        // Two runs for the same goal, one for a different goal.
        for (id, goal, value) in [
            ("exp_a", "Predict readmission", 0.70),
            ("exp_b", "Predict readmission", 0.82),
            ("exp_c", "Classify x-rays", 0.91),
        ] {
            insert_running(&conn, id, 1, goal, "ds", "/tmp/plan.json").unwrap();
            update_complete(&conn, id, &metrics(value), "/tmp/metrics.json", "/tmp/card.md", "", "")
                .unwrap();
            recompute_best_for_goal(&conn, goal).unwrap();
        }

        assert!(!get_experiment_by_id(&conn, "exp_a").unwrap().is_best);
        assert!(get_experiment_by_id(&conn, "exp_b").unwrap().is_best);
        // The other goal's run is best within its own group.
        assert!(get_experiment_by_id(&conn, "exp_c").unwrap().is_best);

        // A later, better run for the first goal flips the flag.
        insert_running(&conn, "exp_d", 2, "Predict readmission", "ds", "/tmp/plan.json").unwrap();
        update_complete(&conn, "exp_d", &metrics(0.88), "/tmp/metrics.json", "/tmp/card.md", "", "")
            .unwrap();
        recompute_best_for_goal(&conn, "Predict readmission").unwrap();
        assert!(!get_experiment_by_id(&conn, "exp_b").unwrap().is_best);
        assert!(get_experiment_by_id(&conn, "exp_d").unwrap().is_best);
    }

    #[test]
    fn metrics_parser_rejects_unknown_schema() {
        let metrics_path = temp_file("metrics.json");
        fs::write(
            &metrics_path,
            r#"{
                "schema_version": 99,
                "primary_metric": "accuracy",
                "metric_value": 0.75,
                "baseline_metric": 0.5,
                "model_type": "xgboost",
                "framework": "xgboost",
                "device": "cpu"
            }"#,
        )
        .unwrap();
        let err = parse_metrics_file(&metrics_path).unwrap_err();
        assert!(err.contains("schema_version"));
    }

    #[test]
    fn error_parser_accepts_worker_error_contract() {
        let error_path = temp_file("error.json");
        fs::write(
            &error_path,
            r#"{
                "schema_version": 1,
                "code": "bad_plan",
                "message": "unsupported plan",
                "stage": "load",
                "device_fallback": false
            }"#,
        )
        .unwrap();
        let error = parse_error_file(&error_path).unwrap();
        assert_eq!(error.code, "bad_plan");
        assert_eq!(error.message, "unsupported plan");
    }

    #[test]
    #[ignore = "spawns the Python worker and writes to ~/.doclab/experiments"]
    fn worker_smoke_plan_to_metrics_to_sqlite() {
        let fixture = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("../worker/tests/fixtures/tiny.csv")
            .canonicalize()
            .unwrap();
        let plan = WorkerPlan {
            schema_version: 1,
            dataset_id: "tiny_fixture".to_string(),
            hf_id: "local-fixture".to_string(),
            revision: "local".to_string(),
            label_column: "readmitted".to_string(),
            model_type: "xgboost".to_string(),
            framework: "xgboost".to_string(),
            device: "cpu".to_string(),
            seed: 42,
            split: vec![0.8, 0.1, 0.1],
            primary_metric: "accuracy".to_string(),
            goal_text: Some("Smoke-test readmission fixture".to_string()),
            summary: Some("Local fixture smoke test".to_string()),
            local_csv: Some(path_string(&fixture)),
        };

        let artifacts = AgentArtifacts {
            intent: r#"{"task_type":"predict","modality":"tabular","metric_hint":"accuracy","goal_text":"Smoke-test readmission fixture"}"#.to_string(),
            selection: r#"{"dataset_id":"tiny_fixture","dataset_name":"Tiny Fixture","rationale":"Test dataset"}"#.to_string(),
            profile: r#"{"schema":["feature_1","feature_2","label"],"label_column":"readmitted","row_count":120,"missing_percent":0.0}"#.to_string(),
        };

        let market = Marketplace {
            datasets: vec![Dataset {
                id: "tiny_fixture".to_string(),
                name: "Tiny Fixture".to_string(),
                hf_id: "local-fixture".to_string(),
                revision: "local".to_string(),
                description: "Local smoke-test fixture".to_string(),
                category: "test".to_string(),
                data_type: "tabular".to_string(),
                task_types: vec!["classification".to_string()],
                modality: "tabular".to_string(),
                license: "test".to_string(),
                size: "tiny".to_string(),
                label_column: "readmitted".to_string(),
                limitations: "Synthetic fixture; not real data.".to_string(),
            }],
        };

        let detail = run_experiment(
            &market,
            plan,
            "Smoke-test readmission fixture".to_string(),
            artifacts,
        )
        .unwrap();
        assert_eq!(detail.status, "complete");
        assert!(detail.metric_value.is_some());
        assert!(detail.metrics_path.is_some());
        assert!(detail.metrics.is_some());
        assert!(detail.model_card_path.is_some());
        assert!(detail
            .model_card_content
            .as_deref()
            .unwrap_or("")
            .contains("Intended use"));
    }

    fn list_experiments_from_conn(conn: &Connection) -> Result<Vec<ExperimentSummary>, String> {
        let mut stmt = conn
            .prepare(
                "SELECT id, created_at_ms, updated_at_ms, status, goal_text, dataset_id,
                        primary_metric, metric_value, baseline_metric, is_best
                 FROM experiments
                 ORDER BY created_at_ms DESC",
            )
            .unwrap();
        let rows = stmt
            .query_map([], |row| {
                Ok(ExperimentSummary {
                    id: row.get(0)?,
                    created_at_ms: row.get(1)?,
                    updated_at_ms: row.get(2)?,
                    status: row.get(3)?,
                    goal_text: row.get(4)?,
                    dataset_id: row.get(5)?,
                    primary_metric: row.get(6)?,
                    metric_value: row.get(7)?,
                    baseline_metric: row.get(8)?,
                    is_best: row.get::<_, i64>(9)? != 0,
                })
            })
            .unwrap();
        rows.collect::<Result<Vec<_>, _>>()
            .map_err(|e| format!("cannot read row: {e}"))
    }
}
