# Device Monitor - 设备监控应用

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue.svg)](https://tauri.app/)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange.svg)](https://www.rust-lang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![Android](https://img.shields.io/badge/Android-7.0+-green.svg)](https://www.android.com/)

基于 Tauri 2.0 开发的 Android 设备监控应用，可定期收集设备信息并发送到服务器。

[快速开始](QUICKSTART.md) | [文档](ANDROID_GUIDE.md) | [贡献指南](CONTRIBUTING.md)

</div>

## 功能特性

- 📱 收集设备系统信息（CPU、内存、存储、网络、电池）
- 🔄 定时自动发送数据到服务器（可自定义间隔）
- ⚙️ 可配置服务器地址和发送间隔
- 📊 实时查看设备信息
- 🚀 支持后台运行
- 🔒 无需 Root 权限

## 收集的信息

- **系统信息**: 设备名称、运行时间
- **CPU**: 所有核心的使用率
- **内存**: 总内存、已使用内存、使用率
- **磁盘**: 各分区的容量和可用空间
- **网络**: 各网卡的接收和发送流量
- **电池**: 电量和充电状态（仅 Android）
- **进程**: 前 20 个进程的内存和 CPU 使用情况

## 技术栈

- **框架**: Tauri 2.0
- **前端**: React + TypeScript + Vite
- **后端**: Rust
- **依赖库**: 
  - sysinfo (系统信息)
  - reqwest (HTTP 客户端)
  - tokio (异步运行时)
  - parking_lot (高性能互斥锁)

## 本地开发

### 前置要求

1. Node.js 20+
2. Rust (最新稳定版)
3. Android SDK 和 NDK
4. Java 17+

### 安装依赖

```bash
# 安装前端依赖
npm install

# 安装 Tauri CLI
npm install -g @tauri-apps/cli@next
```

### 初始化 Android 项目

```bash
npm run tauri android init
```

### 运行开发版本

```bash
# 桌面版开发
npm run tauri dev

# Android 开发（需要连接设备或模拟器）
npm run tauri android dev
```

### 构建 APK

```bash
# 构建 Android APK
npm run tauri android build

# APK 输出路径
# src-tauri/gen/android/app/build/outputs/apk/
```

## 使用说明

1. **启动应用**
2. **配置服务器地址**: 输入接收数据的服务器 API 地址
3. **设置发送间隔**: 设置数据发送间隔（最小 5 秒）
4. **点击"启动监控"**: 开始定期发送设备信息
5. **查看状态**: 实时查看发送状态和设备信息

### 权限说明

应用需要以下权限：

- `INTERNET` - 发送数据到服务器
- `ACCESS_NETWORK_STATE` - 获取网络状态
- `PACKAGE_USAGE_STATS` - 获取应用使用统计（需要用户手动授权）
- `BATTERY_STATS` - 获取电池信息
- `WAKE_LOCK` - 保持后台运行

### 服务器端 API 格式

应用会向配置的服务器地址发送 POST 请求，请求体为 JSON 格式：

```json
{
  "computer_name": "Device-Name",
  "uptime": 23906,
  "cpu_usage": [52.3, 53.4, 84.1, 42.5],
  "memory_usage": {
    "total": 8589934592,
    "used": 4294967296,
    "percent": 50.0
  },
  "processes": [...],
  "disks": [...],
  "network": [...],
  "battery": {
    "level": 85.0,
    "is_charging": true
  }
}
```

## GitHub Actions 自动构建

项目包含 GitHub Actions 工作流，会在以下情况自动构建 APK：

- 推送到 main/master 分支
- 创建 Pull Request
- 手动触发

构建完成后，APK 文件会作为 Artifact 上传，可在 Actions 页面下载。

## 许可证

MIT License

## 注意事项

1. 首次运行需要授予"使用情况访问"权限才能获取应用使用统计
2. 为保证后台运行，建议在系统设置中关闭应用的电池优化
3. 发送间隔建议设置为 30 秒或以上，避免频繁请求消耗流量
4. 确保服务器 API 能够接收 JSON 格式的 POST 请求

## 故障排除

### Android 构建失败

1. 确保已安装 Android SDK 和 NDK
2. 设置环境变量：
   ```bash
   export ANDROID_HOME=/path/to/android-sdk
   export NDK_HOME=$ANDROID_HOME/ndk/26.1.10909125
   ```
3. 添加 Rust Android 目标：
   ```bash
   rustup target add aarch64-linux-android armv7-linux-androideabi
   ```

### 应用无法发送数据

1. 检查服务器地址是否正确
2. 确保设备有网络连接
3. 检查服务器是否可访问
4. 查看应用内的错误提示

## 贡献

欢迎提交 Issue 和 Pull Request！
