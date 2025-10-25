use serde::{Deserialize, Serialize};
use sysinfo::{System, Disks, Networks};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeviceInfo {
    pub computer_name: String,
    pub uptime: u64,
    pub cpu_usage: Vec<f32>,
    pub memory_usage: MemoryInfo,
    pub processes: Vec<ProcessInfo>,
    pub disks: Vec<DiskInfo>,
    pub network: Vec<NetworkInfo>,
    pub battery: Option<BatteryInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MemoryInfo {
    pub total: u64,
    pub used: u64,
    pub percent: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessInfo {
    pub memory: u64,
    pub is_focused: bool,
    pub window_title: String,
    pub executable_name: String,
    pub pid: u32,
    pub cpu_usage: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiskInfo {
    pub name: String,
    pub mount_point: String,
    pub total_space: u64,
    pub available_space: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkInfo {
    pub name: String,
    pub received: u64,
    pub transmitted: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BatteryInfo {
    pub level: f32,
    pub is_charging: bool,
}

pub fn get_device_info() -> DeviceInfo {
    let mut sys = System::new_all();
    sys.refresh_all();

    // 获取计算机名称
    let computer_name = System::host_name().unwrap_or_else(|| "Unknown".to_string());

    // 获取系统运行时间
    let uptime = System::uptime();

    // 获取CPU使用率（所有核心）
    let cpu_usage: Vec<f32> = sys.cpus().iter().map(|cpu| cpu.cpu_usage()).collect();

    // 获取内存信息
    let total_memory = sys.total_memory();
    let used_memory = sys.used_memory();
    let memory_percent = (used_memory as f64 / total_memory as f64) * 100.0;
    
    let memory_usage = MemoryInfo {
        total: total_memory,
        used: used_memory,
        percent: memory_percent,
    };

    // 获取进程信息（前20个按内存排序）
    let mut processes: Vec<ProcessInfo> = sys
        .processes()
        .iter()
        .map(|(pid, process)| ProcessInfo {
            memory: process.memory(),
            is_focused: false,
            window_title: process.name().to_string_lossy().to_string(),
            executable_name: process.name().to_string_lossy().to_string(),
            pid: pid.as_u32(),
            cpu_usage: process.cpu_usage(),
        })
        .collect();
    
    processes.sort_by(|a, b| b.memory.cmp(&a.memory));
    processes.truncate(20);

    // 获取磁盘信息
    let disks = Disks::new_with_refreshed_list();
    let disk_info: Vec<DiskInfo> = disks
        .iter()
        .map(|disk| DiskInfo {
            name: disk.name().to_string_lossy().to_string(),
            mount_point: disk.mount_point().to_string_lossy().to_string(),
            total_space: disk.total_space(),
            available_space: disk.available_space(),
        })
        .collect();

    // 获取网络信息
    let networks = Networks::new_with_refreshed_list();
    let network_info: Vec<NetworkInfo> = networks
        .iter()
        .map(|(name, data)| NetworkInfo {
            name: name.clone(),
            received: data.received(),
            transmitted: data.transmitted(),
        })
        .collect();

    // 获取电池信息（Android特定）
    let battery = get_battery_info();

    DeviceInfo {
        computer_name,
        uptime,
        cpu_usage,
        memory_usage,
        processes,
        disks: disk_info,
        network: network_info,
        battery,
    }
}

#[cfg(target_os = "android")]
fn get_battery_info() -> Option<BatteryInfo> {
    // 在Android上通过JNI获取电池信息
    // 这里需要实现JNI调用
    // 暂时返回None，后续可以通过JNI实现
    None
}

#[cfg(not(target_os = "android"))]
fn get_battery_info() -> Option<BatteryInfo> {
    // 非Android平台返回None
    None
}

