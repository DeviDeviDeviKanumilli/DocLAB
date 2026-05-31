use crate::marketplace::Marketplace;
use rusqlite::Connection;
use std::path::PathBuf;

/// Resolve the DocLab data root (`~/.doclab/`), creating it if missing.
pub fn data_root() -> Result<PathBuf, String> {
    let home = dirs::home_dir().ok_or("cannot resolve home directory")?;
    let root = home.join(".doclab");
    std::fs::create_dir_all(&root)
        .map_err(|e| format!("cannot create data root {}: {e}", root.display()))?;
    Ok(root)
}

/// Open `~/.doclab/doclab.db` and ensure the `datasets` table exists.
pub fn open_db() -> Result<Connection, String> {
    let path = data_root()?.join("doclab.db");
    let conn = Connection::open(&path)
        .map_err(|e| format!("cannot open db {}: {e}", path.display()))?;
    create_datasets_table(&conn)?;
    Ok(conn)
}

fn create_datasets_table(conn: &Connection) -> Result<(), String> {
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS datasets (
            id          TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            hf_id       TEXT NOT NULL,
            revision    TEXT NOT NULL,
            data_type   TEXT NOT NULL,
            task_types  TEXT NOT NULL,
            label_column TEXT NOT NULL,
            category    TEXT,
            description TEXT
        );",
    )
    .map_err(|e| format!("cannot create datasets table: {e}"))
}

/// Idempotent upsert of the curated index into SQLite. Re-running does not
/// duplicate rows. This mirror is for M3+ joins — it is NOT the query hot
/// path, so a failure here is logged by the caller, not fatal.
pub fn mirror_datasets(conn: &Connection, market: &Marketplace) -> Result<(), String> {
    for d in &market.datasets {
        let task_types = d.task_types.join(",");
        conn.execute(
            "INSERT INTO datasets
                (id, name, hf_id, revision, data_type, task_types, label_column, category, description)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
             ON CONFLICT(id) DO UPDATE SET
                name=?2, hf_id=?3, revision=?4, data_type=?5,
                task_types=?6, label_column=?7, category=?8, description=?9",
            rusqlite::params![
                d.id, d.name, d.hf_id, d.revision, d.data_type,
                task_types, d.label_column, d.category, d.description,
            ],
        )
        .map_err(|e| format!("cannot mirror dataset '{}': {e}", d.id))?;
    }
    Ok(())
}

