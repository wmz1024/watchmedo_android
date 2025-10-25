# 快速入门指南

5 分钟快速上手 Device Monitor！

## 📋 前置要求

确保已安装以下工具：

- ✅ Node.js 20+
- ✅ Rust（最新稳定版）
- ✅ Android Studio 或 Android SDK
- ✅ Java 17+

## 🚀 快速开始（3 步）

### 步骤 1: 安装依赖

**Windows:**
```bash
.\setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

或手动安装：
```bash
# 安装前端依赖
npm install

# 安装 Tauri CLI
npm install -g @tauri-apps/cli@next

# 添加 Rust Android 目标
rustup target add aarch64-linux-android armv7-linux-androideabi
```

### 步骤 2: 配置 Android 环境

**设置环境变量:**

Windows (PowerShell):
```powershell
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
$env:NDK_HOME = "$env:ANDROID_HOME\ndk\26.1.10909125"
```

Linux/Mac:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export NDK_HOME=$ANDROID_HOME/ndk/26.1.10909125
```

**初始化 Android 项目:**
```bash
npm run android:init
```

### 步骤 3: 构建 APK

```bash
# 调试版本（推荐测试用）
npm run android:build-debug

# 或发布版本
npm run android:build
```

APK 位置：
```
src-tauri/gen/android/app/build/outputs/apk/universal/debug/app-universal-debug.apk
```

## 📱 安装到手机

### 方法 1: USB 连接

```bash
# 启用 USB 调试，然后运行：
adb install src-tauri/gen/android/app/build/outputs/apk/universal/debug/app-universal-debug.apk
```

### 方法 2: 直接复制

将 APK 复制到手机，点击安装。

## 🧪 测试应用

### 1. 启动测试服务器

```bash
cd server-example
npm install
npm start
```

服务器运行在 `http://localhost:3000`

### 2. 配置手机连接

**真实设备（USB 调试）：**
```bash
adb reverse tcp:3000 tcp:3000
```

**真实设备（WiFi）：**
使用电脑 IP：`http://192.168.1.100:3000`（替换为实际 IP）

**Android 模拟器：**
使用：`http://10.0.2.2:3000`

### 3. 在应用中配置

1. 打开 Device Monitor 应用
2. 服务器地址输入：`http://localhost:3000/api/device-info`（或相应地址）
3. 发送间隔设置为：`30` 秒
4. 点击"启动监控"

### 4. 授予权限

首次启动需要授予"使用情况访问"权限：
1. 应用会自动提示
2. 点击"设置"跳转到系统设置
3. 找到 Device Monitor
4. 启用权限
5. 返回应用

### 5. 查看结果

在测试服务器的控制台中，您会看到设备信息每 30 秒更新一次！

## 🎉 成功！

如果在服务器控制台看到设备信息，说明一切正常！

## 📝 常用命令

```bash
# 开发桌面版
npm run tauri:dev

# 构建桌面版
npm run tauri:build

# Android 开发（需要连接设备）
npm run android:dev

# 查看 Android 日志
adb logcat | grep -i "device-monitor"

# 卸载应用
adb uninstall com.devicemonitor.app
```

## ❓ 遇到问题？

### 构建失败

1. 检查 ANDROID_HOME 和 NDK_HOME 是否设置
2. 确保 NDK 版本正确：26.1.10909125
3. 运行：`rustup target list --installed` 确认已安装 Android 目标

### 应用打不开

1. 尝试安装 universal 版本
2. 检查 Android 版本（需要 API 24+，即 Android 7.0+）

### 无法连接服务器

1. 检查服务器是否运行
2. 检查手机和电脑是否在同一网络
3. 检查防火墙设置
4. 对于 HTTP 连接，可能需要配置网络安全策略（见 ANDROID_GUIDE.md）

### 获取不到数据

1. 确保已授予"使用情况访问"权限
2. 关闭电池优化
3. 检查应用是否在后台运行

## 📚 更多文档

- [完整文档](README.md)
- [Android 详细指南](ANDROID_GUIDE.md)
- [项目结构说明](PROJECT_STRUCTURE.md)
- [贡献指南](CONTRIBUTING.md)

## 🆘 获取帮助

- 查看 [Issues](https://github.com/your-repo/issues)
- 提交新 Issue
- 查看 README 中的常见问题

---

**提示：** 第一次构建可能需要较长时间（10-20 分钟），因为需要下载依赖和编译 Rust 代码。后续构建会快很多！

祝您使用愉快！🎊

