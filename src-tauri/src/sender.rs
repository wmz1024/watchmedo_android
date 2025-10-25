use crate::device_info::{DeviceInfo, get_device_info};
use parking_lot::Mutex;
use std::sync::Arc;
use std::time::Duration;
use tokio::time::interval;

#[derive(Clone)]
pub struct MonitorService {
    state: Arc<Mutex<MonitorState>>,
}

struct MonitorState {
    is_running: bool,
    server_url: String,
    interval_seconds: u64,
    last_send_time: Option<String>,
    last_status: String,
}

impl MonitorService {
    pub fn new() -> Self {
        Self {
            state: Arc::new(Mutex::new(MonitorState {
                is_running: false,
                server_url: String::new(),
                interval_seconds: 30,
                last_send_time: None,
                last_status: "未启动".to_string(),
            })),
        }
    }

    pub fn start(&self, server_url: String, interval_seconds: u64) {
        let mut state = self.state.lock();
        state.is_running = true;
        state.server_url = server_url.clone();
        state.interval_seconds = interval_seconds;
        state.last_status = "启动中...".to_string();
        drop(state);

        let service = self.clone();
        tokio::spawn(async move {
            service.run_monitoring_loop().await;
        });
    }

    pub fn stop(&self) {
        let mut state = self.state.lock();
        state.is_running = false;
        state.last_status = "已停止".to_string();
    }

    pub fn is_running(&self) -> bool {
        self.state.lock().is_running
    }

    pub fn get_status(&self) -> (String, String) {
        let state = self.state.lock();
        let last_time = state.last_send_time.clone().unwrap_or_else(|| "从未发送".to_string());
        let status = state.last_status.clone();
        (last_time, status)
    }

    async fn run_monitoring_loop(&self) {
        let interval_duration = {
            let state = self.state.lock();
            Duration::from_secs(state.interval_seconds)
        };

        let mut ticker = interval(interval_duration);

        loop {
            ticker.tick().await;

            let should_continue = self.state.lock().is_running;
            if !should_continue {
                break;
            }

            self.send_device_info().await;
        }
    }

    async fn send_device_info(&self) {
        let server_url = {
            let state = self.state.lock();
            state.server_url.clone()
        };

        if server_url.is_empty() {
            let mut state = self.state.lock();
            state.last_status = "错误: 服务器地址为空".to_string();
            return;
        }

        // 获取设备信息
        let device_info = get_device_info();

        // 发送POST请求
        match self.post_device_info(&server_url, &device_info).await {
            Ok(_) => {
                let mut state = self.state.lock();
                state.last_send_time = Some(chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string());
                state.last_status = "发送成功".to_string();
            }
            Err(e) => {
                let mut state = self.state.lock();
                state.last_status = format!("发送失败: {}", e);
            }
        }
    }

    async fn post_device_info(&self, url: &str, info: &DeviceInfo) -> Result<(), String> {
        let client = reqwest::Client::new();
        
        let response = client
            .post(url)
            .json(info)
            .timeout(Duration::from_secs(10))
            .send()
            .await
            .map_err(|e| format!("网络错误: {}", e))?;

        if response.status().is_success() {
            Ok(())
        } else {
            Err(format!("HTTP错误: {}", response.status()))
        }
    }
}

