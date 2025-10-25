import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

interface DeviceInfo {
  computer_name: string;
  uptime: number;
  cpu_usage: number[];
  memory_usage: {
    total: number;
    used: number;
    percent: number;
  };
  processes: Array<{
    memory: number;
    is_focused: boolean;
    window_title: string;
    executable_name: string;
    pid: number;
    cpu_usage: number;
  }>;
  disks: Array<{
    name: string;
    mount_point: string;
    total_space: number;
    available_space: number;
  }>;
  network: Array<{
    name: string;
    received: number;
    transmitted: number;
  }>;
  battery: {
    level: number;
    is_charging: boolean;
  } | null;
}

interface AppConfig {
  server_url: string;
  interval_seconds: number;
}

function App() {
  const [serverUrl, setServerUrl] = useState("http://localhost:3000/api/device-info");
  const [interval, setInterval] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [lastSendTime, setLastSendTime] = useState("从未发送");
  const [status, setStatus] = useState("未启动");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadConfig();
    checkStatus();
    const timer = setInterval(checkStatus, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadConfig = async () => {
    try {
      const config = await invoke<AppConfig | null>("load_config");
      if (config) {
        setServerUrl(config.server_url);
        setInterval(config.interval_seconds);
      }
    } catch (error) {
      console.error("加载配置失败:", error);
    }
  };

  const checkStatus = async () => {
    try {
      const running = await invoke<boolean>("is_monitoring_running");
      setIsRunning(running);

      const [time, stat] = await invoke<[string, string]>("get_monitoring_status");
      setLastSendTime(time);
      setStatus(stat);
    } catch (error) {
      console.error("检查状态失败:", error);
    }
  };

  const handleStart = async () => {
    try {
      const result = await invoke<string>("start_monitoring", {
        serverUrl,
        intervalSeconds: interval,
      });
      setMessage(result);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`错误: ${error}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleStop = async () => {
    try {
      const result = await invoke<string>("stop_monitoring");
      setMessage(result);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`错误: ${error}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const result = await invoke<string>("save_config", {
        serverUrl,
        intervalSeconds: interval,
      });
      setMessage(result);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`错误: ${error}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleGetInfo = async () => {
    try {
      const info = await invoke<DeviceInfo>("get_current_info");
      setDeviceInfo(info);
    } catch (error) {
      setMessage(`获取设备信息失败: ${error}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}天 ${hours}小时 ${minutes}分钟`;
  };

  return (
    <div className="container">
      <h1>设备监控</h1>

      {message && <div className="message">{message}</div>}

      <div className="card">
        <h2>配置</h2>
        <div className="form-group">
          <label>服务器地址:</label>
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="http://localhost:3000/api/device-info"
            disabled={isRunning}
          />
        </div>

        <div className="form-group">
          <label>发送间隔 (秒):</label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            min="5"
            disabled={isRunning}
          />
        </div>

        <div className="button-group">
          <button onClick={handleSaveConfig} disabled={isRunning}>
            保存配置
          </button>
          {!isRunning ? (
            <button onClick={handleStart} className="primary">
              启动监控
            </button>
          ) : (
            <button onClick={handleStop} className="danger">
              停止监控
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h2>状态</h2>
        <div className="status-grid">
          <div className="status-item">
            <span className="label">运行状态:</span>
            <span className={`status ${isRunning ? "running" : "stopped"}`}>
              {isRunning ? "运行中" : "已停止"}
            </span>
          </div>
          <div className="status-item">
            <span className="label">最后发送:</span>
            <span>{lastSendTime}</span>
          </div>
          <div className="status-item">
            <span className="label">发送状态:</span>
            <span>{status}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>设备信息</h2>
          <button onClick={handleGetInfo}>刷新</button>
        </div>

        {deviceInfo && (
          <div className="device-info">
            <div className="info-section">
              <h3>系统信息</h3>
              <p><strong>设备名称:</strong> {deviceInfo.computer_name}</p>
              <p><strong>运行时间:</strong> {formatUptime(deviceInfo.uptime)}</p>
            </div>

            <div className="info-section">
              <h3>CPU使用率</h3>
              <p><strong>核心数:</strong> {deviceInfo.cpu_usage.length}</p>
              <p><strong>平均使用率:</strong> {(deviceInfo.cpu_usage.reduce((a, b) => a + b, 0) / deviceInfo.cpu_usage.length).toFixed(2)}%</p>
            </div>

            <div className="info-section">
              <h3>内存使用</h3>
              <p><strong>总内存:</strong> {formatBytes(deviceInfo.memory_usage.total)}</p>
              <p><strong>已使用:</strong> {formatBytes(deviceInfo.memory_usage.used)}</p>
              <p><strong>使用率:</strong> {deviceInfo.memory_usage.percent.toFixed(2)}%</p>
            </div>

            {deviceInfo.battery && (
              <div className="info-section">
                <h3>电池</h3>
                <p><strong>电量:</strong> {deviceInfo.battery.level.toFixed(0)}%</p>
                <p><strong>充电状态:</strong> {deviceInfo.battery.is_charging ? "充电中" : "未充电"}</p>
              </div>
            )}

            <div className="info-section">
              <h3>磁盘 ({deviceInfo.disks.length})</h3>
              {deviceInfo.disks.slice(0, 3).map((disk, index) => (
                <div key={index} className="disk-item">
                  <p><strong>{disk.mount_point}</strong> {disk.name}</p>
                  <p>总容量: {formatBytes(disk.total_space)} / 可用: {formatBytes(disk.available_space)}</p>
                </div>
              ))}
            </div>

            <div className="info-section">
              <h3>网络 ({deviceInfo.network.length})</h3>
              {deviceInfo.network.slice(0, 3).map((net, index) => (
                <div key={index} className="network-item">
                  <p><strong>{net.name}</strong></p>
                  <p>接收: {formatBytes(net.received)} / 发送: {formatBytes(net.transmitted)}</p>
                </div>
              ))}
            </div>

            <div className="info-section">
              <h3>进程 (前10个)</h3>
              {deviceInfo.processes.slice(0, 10).map((proc, index) => (
                <div key={index} className="process-item">
                  <p><strong>{proc.executable_name}</strong> (PID: {proc.pid})</p>
                  <p>内存: {formatBytes(proc.memory)} / CPU: {proc.cpu_usage.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

