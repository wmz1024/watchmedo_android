mod device_info;
mod sender;

use device_info::{DeviceInfo, get_device_info};
use sender::MonitorService;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use parking_lot::Mutex;

#[derive(Clone, Serialize, Deserialize)]
struct AppConfig {
    server_url: String,
    interval_seconds: u64,
}

struct AppState {
    monitor_service: MonitorService,
    config: Arc<Mutex<Option<AppConfig>>>,
}

#[tauri::command]
fn get_current_info() -> Result<DeviceInfo, String> {
    Ok(get_device_info())
}

#[tauri::command]
fn start_monitoring(
    state: tauri::State<AppState>,
    server_url: String,
    interval_seconds: u64,
) -> Result<String, String> {
    if server_url.is_empty() {
        return Err("服务器地址不能为空".to_string());
    }

    if interval_seconds < 5 {
        return Err("发送间隔不能小于5秒".to_string());
    }

    state.monitor_service.start(server_url.clone(), interval_seconds);

    // 保存配置
    let config = AppConfig {
        server_url,
        interval_seconds,
    };
    *state.config.lock() = Some(config);

    Ok("监控已启动".to_string())
}

#[tauri::command]
fn stop_monitoring(state: tauri::State<AppState>) -> Result<String, String> {
    state.monitor_service.stop();
    Ok("监控已停止".to_string())
}

#[tauri::command]
fn is_monitoring_running(state: tauri::State<AppState>) -> bool {
    state.monitor_service.is_running()
}

#[tauri::command]
fn get_monitoring_status(state: tauri::State<AppState>) -> (String, String) {
    state.monitor_service.get_status()
}

#[tauri::command]
fn save_config(
    state: tauri::State<AppState>,
    server_url: String,
    interval_seconds: u64,
) -> Result<String, String> {
    let config = AppConfig {
        server_url,
        interval_seconds,
    };
    *state.config.lock() = Some(config);
    Ok("配置已保存".to_string())
}

#[tauri::command]
fn load_config(state: tauri::State<AppState>) -> Option<AppConfig> {
    state.config.lock().clone()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(AppState {
            monitor_service: MonitorService::new(),
            config: Arc::new(Mutex::new(None)),
        })
        .invoke_handler(tauri::generate_handler![
            get_current_info,
            start_monitoring,
            stop_monitoring,
            is_monitoring_running,
            get_monitoring_status,
            save_config,
            load_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
