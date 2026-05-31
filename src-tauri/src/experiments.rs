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
    pub worker_stdout: Option<String>,
    pub worker_stderr: Option<String>,
    pub error_code: Option<String>,
    pub error_message: Option<String>,
    pub metrics: Option<Value>,
    pub error: Option<Value>,
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

    if !dataset.data_type.eq_ignore_ascii_case("tabular") {
        return Err(format!(
            "dataset '{}' is {}, but M3 only supports tabular plans",
            dataset.id, dataset.data_type
        ));
    }

    let summary = format!(
        "Train a decision-tree tabular prototype on {} and report accuracy against a majority-class baseline.",
        dataset.name
    );
    let plan = WorkerPlan {
        schema_version: SCHEMA_VERSION,
        dataset_id: dataset.id.clone(),
        hf_id: dataset.hf_id.clone(),
        revision: dataset.revision.clone(),
        label_column: dataset.label_column.clone(),
        model_type: "xgboost".to_string(),
        framework: "xgboost".to_string(),
        device: "cpu".to_string(),
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

pub fn run_experiment(
    plan: WorkerPlan,
    goal_text: String,
    agent_artifacts: AgentArtifacts,
) -> Result<ExperimentDetail, String> {
    validate_plan(&plan)?;

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
                update_complete(
                    &conn,
                    &id,
                    &metrics,
                    &path_string(&metrics_path),
                    &String::from_utf8_lossy(&output.stdout),
                    &String::from_utf8_lossy(&output.stderr),
                )?;
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
                    primary_metric, metric_value, baseline_metric
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
    stdout: &str,
    stderr: &str,
) -> Result<(), String> {
    conn.execute(
        "UPDATE experiments SET
            updated_at_ms=?2, status='complete', primary_metric=?3,
            metric_value=?4, baseline_metric=?5, model_type=?6, framework=?7,
            device=?8, metrics_path=?9, worker_stdout=?10, worker_stderr=?11,
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
            stdout,
            stderr,
        ],
    )
    .map(|_| ())
    .map_err(|e| format!("cannot update completed experiment '{id}': {e}"))
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
                    worker_stdout, worker_stderr, error_code, error_message
             FROM experiments
             WHERE id=?1",
        )
        .map_err(|e| format!("cannot prepare experiment lookup: {e}"))?;

    let detail = stmt
        .query_row([id], |row| {
            let metrics_path: Option<String> = row.get(13)?;
            let error_path: Option<String> = row.get(14)?;
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
                model_card_path: row.get(15)?,
                worker_stdout: row.get(16)?,
                worker_stderr: row.get(17)?,
                error_code: row.get(18)?,
                error_message: row.get(19)?,
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

        let detail = run_experiment(plan, "Smoke-test readmission fixture".to_string(), artifacts).unwrap();
        assert_eq!(detail.status, "complete");
        assert!(detail.metric_value.is_some());
        assert!(detail.metrics_path.is_some());
        assert!(detail.metrics.is_some());
    }

    fn list_experiments_from_conn(conn: &Connection) -> Result<Vec<ExperimentSummary>, String> {
        let mut stmt = conn
            .prepare(
                "SELECT id, created_at_ms, updated_at_ms, status, goal_text, dataset_id,
                        primary_metric, metric_value, baseline_metric
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
                })
            })
            .unwrap();
        rows.collect::<Result<Vec<_>, _>>()
            .map_err(|e| format!("cannot read row: {e}"))
    }
}
