use std::process::Command;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Proves the Rust -> Python plumbing works (M0). Runs the worker's --help
/// from the repo's worker/ dir and returns its stdout.
#[tauri::command]
fn worker_healthcheck() -> Result<String, String> {
    let worker_dir = format!("{}/../worker", env!("CARGO_MANIFEST_DIR"));
    let output = Command::new("python3")
        .args(["-m", "doclab_worker", "--help"])
        .current_dir(&worker_dir)
        .output()
        .map_err(|e| format!("failed to launch python3: {e}"))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).into_owned())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).into_owned())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, worker_healthcheck])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
