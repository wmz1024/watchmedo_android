# 项目结构说明

本文档详细说明 Device Monitor 项目的文件结构和各部分的作用。

## 目录结构

```
appwatchmedo/
├── .github/
│   └── workflows/
│       └── build-android.yml      # GitHub Actions 自动构建 APK 的工作流
├── src/                           # 前端源代码
│   ├── App.tsx                    # 主应用组件
│   ├── main.tsx                   # React 入口文件
│   ├── styles.css                 # 全局样式
│   └── vite-env.d.ts             # Vite 类型定义
├── src-tauri/                     # Tauri 后端源代码
│   ├── src/
│   │   ├── lib.rs                # 库入口和应用逻辑
│   │   ├── main.rs               # 主程序入口
│   │   ├── device_info.rs        # 设备信息收集模块
│   │   └── sender.rs             # 数据发送和定时任务模块
│   ├── capabilities/
│   │   └── default.json          # Tauri 权限配置
│   ├── gen/                      # 生成的文件（Android 项目等）
│   │   └── android/              # Android 项目（运行 init 后生成）
│   ├── Cargo.toml                # Rust 依赖配置
│   ├── build.rs                  # 构建脚本
│   └── tauri.conf.json           # Tauri 配置文件
├── server-example/                # 测试服务器示例
│   ├── server.js                 # Express 服务器
│   ├── package.json              # 服务器依赖
│   └── README.md                 # 服务器使用说明
├── .editorconfig                  # 编辑器配置
├── .gitignore                     # Git 忽略文件
├── .prettierrc                    # Prettier 代码格式化配置
├── index.html                     # HTML 入口
├── package.json                   # 前端依赖和脚本
├── tsconfig.json                  # TypeScript 配置
├── tsconfig.node.json             # Node TypeScript 配置
├── vite.config.ts                 # Vite 构建配置
├── setup.sh                       # Linux/Mac 设置脚本
├── setup.bat                      # Windows 设置脚本
├── README.md                      # 项目主要文档
├── ANDROID_GUIDE.md              # Android 详细使用指南
├── CONTRIBUTING.md               # 贡献指南
├── LICENSE                        # MIT 许可证
└── PROJECT_STRUCTURE.md          # 本文件
```

## 核心模块说明

### 前端 (src/)

#### App.tsx
主应用组件，包含：
- 服务器配置界面
- 发送间隔设置
- 监控控制按钮
- 设备信息显示
- 状态监控

**主要功能：**
- `loadConfig()` - 加载保存的配置
- `checkStatus()` - 定时检查监控状态
- `handleStart()` - 启动监控
- `handleStop()` - 停止监控
- `handleGetInfo()` - 获取当前设备信息

#### styles.css
全局样式，包含：
- 深色主题
- 响应式布局
- 卡片样式
- 按钮样式
- 滚动条美化

### 后端 (src-tauri/src/)

#### lib.rs
应用主逻辑，包含：
- Tauri 命令定义
- 应用状态管理
- 配置管理

**Tauri 命令：**
- `get_current_info()` - 获取当前设备信息
- `start_monitoring()` - 启动监控服务
- `stop_monitoring()` - 停止监控服务
- `is_monitoring_running()` - 检查监控状态
- `get_monitoring_status()` - 获取监控状态详情
- `save_config()` - 保存配置
- `load_config()` - 加载配置

#### device_info.rs
设备信息收集模块，包含：

**数据结构：**
- `DeviceInfo` - 完整设备信息
- `MemoryInfo` - 内存信息
- `ProcessInfo` - 进程信息
- `DiskInfo` - 磁盘信息
- `NetworkInfo` - 网络信息
- `BatteryInfo` - 电池信息

**主要函数：**
- `get_device_info()` - 收集所有设备信息
- `get_battery_info()` - 获取电池信息（平台特定）

**使用的库：**
- `sysinfo` - 系统信息收集
- `jni` - Android JNI 调用（仅 Android）

#### sender.rs
数据发送和定时任务模块，包含：

**主要结构：**
- `MonitorService` - 监控服务
- `MonitorState` - 监控状态

**主要功能：**
- `start()` - 启动定时发送
- `stop()` - 停止发送
- `run_monitoring_loop()` - 监控循环
- `send_device_info()` - 收集并发送数据
- `post_device_info()` - HTTP POST 请求

**使用的库：**
- `tokio` - 异步运行时
- `reqwest` - HTTP 客户端
- `parking_lot` - 高性能互斥锁

### 配置文件

#### tauri.conf.json
Tauri 配置文件，定义：
- 应用标识和版本
- 窗口配置
- 构建命令
- Android 权限
- Bundle 配置

**Android 权限：**
- `INTERNET` - 网络访问
- `ACCESS_NETWORK_STATE` - 网络状态
- `PACKAGE_USAGE_STATS` - 应用使用统计
- `BATTERY_STATS` - 电池信息
- `WAKE_LOCK` - 保持唤醒

#### Cargo.toml
Rust 依赖配置，包含：
- 核心依赖（Tauri、Serde、Tokio）
- 系统信息库（sysinfo）
- HTTP 客户端（reqwest）
- Android 特定依赖（jni）

#### package.json
前端依赖和脚本：

**依赖：**
- React 18
- Tauri API 2.0
- TypeScript
- Vite

**脚本：**
- `dev` - 启动开发服务器
- `build` - 构建前端
- `tauri:dev` - 启动 Tauri 开发模式
- `android:init` - 初始化 Android 项目
- `android:build` - 构建 Android APK

### GitHub Actions

#### build-android.yml
自动构建工作流，步骤：
1. 检出代码
2. 安装 Node.js
3. 安装 Rust 和 Android 目标
4. 安装 Java 和 Android SDK
5. 安装 Android NDK
6. 安装前端依赖
7. 初始化 Android 项目
8. 构建 APK
9. 上传构建产物
10. 创建 Release（可选）

**触发条件：**
- Push 到 main/master 分支
- Pull Request
- 手动触发

### 测试服务器

#### server-example/server.js
Express 测试服务器，功能：
- 接收设备信息 POST 请求
- 格式化输出到控制台
- 提供健康检查端点
- 简单的 Web 界面

## 数据流

```
┌─────────────┐
│   用户界面   │
│  (App.tsx)  │
└──────┬──────┘
       │ invoke()
       ↓
┌─────────────┐
│ Tauri 命令  │
│  (lib.rs)   │
└──────┬──────┘
       │
       ├→ get_current_info() ──→ device_info.rs ──→ 返回数据
       │
       └→ start_monitoring() ──→ sender.rs
                                     │
                                     ↓
                            ┌────────────────┐
                            │  定时循环      │
                            │  (每N秒)      │
                            └────────┬───────┘
                                     │
                                     ↓
                            ┌────────────────┐
                            │ 收集设备信息   │
                            │ device_info.rs │
                            └────────┬───────┘
                                     │
                                     ↓
                            ┌────────────────┐
                            │  HTTP POST     │
                            │  reqwest       │
                            └────────┬───────┘
                                     │
                                     ↓
                            ┌────────────────┐
                            │   服务器       │
                            └────────────────┘
```

## 平台特定代码

### Android

- JNI 调用用于获取特定信息（预留）
- 特殊权限处理
- 后台服务配置

### 桌面平台

- 标准系统 API
- 窗口管理
- 系统托盘（可扩展）

## 扩展点

### 添加新的设备信息

1. 在 `device_info.rs` 中添加新的数据结构
2. 在 `get_device_info()` 中收集数据
3. 在 `App.tsx` 中添加显示逻辑

### 添加新的 Tauri 命令

1. 在 `lib.rs` 中定义命令函数
2. 添加到 `invoke_handler!` 宏
3. 在前端使用 `invoke()` 调用

### 自定义数据发送格式

修改 `sender.rs` 中的 `post_device_info()` 函数。

### 添加本地数据存储

使用 Tauri 的文件系统 API 或数据库插件。

## 性能优化建议

1. **减少采集频率**：增加发送间隔
2. **数据压缩**：启用 gzip 或使用更紧凑的格式
3. **异步处理**：所有 I/O 操作都是异步的
4. **内存管理**：限制进程列表数量
5. **电池优化**：Android 端建议 60 秒以上间隔

## 安全考虑

1. **数据传输**：使用 HTTPS
2. **认证**：添加 API Key 或 Token
3. **数据隐私**：敏感信息脱敏
4. **权限最小化**：只请求必要权限
5. **输入验证**：服务器端验证所有数据

## 许可证

MIT License - 详见 LICENSE 文件

