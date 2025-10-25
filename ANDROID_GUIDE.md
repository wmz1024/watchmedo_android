# Android 使用指南

本文档详细说明如何在 Android 设备上使用 Device Monitor 应用。

## 安装前准备

### 开发环境要求

1. **Node.js** 20 或更高版本
2. **Rust** 最新稳定版
3. **Android Studio** 或 Android SDK
4. **Android NDK** (推荐 26.1.10909125)
5. **Java JDK** 17 或更高版本

### 配置环境变量

#### Windows

```powershell
# PowerShell
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
$env:NDK_HOME = "$env:ANDROID_HOME\ndk\26.1.10909125"
```

#### Linux/Mac

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export NDK_HOME=$ANDROID_HOME/ndk/26.1.10909125
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 快速开始

### 1. 运行设置脚本

#### Windows
```bash
.\setup.bat
```

#### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

### 2. 初始化 Android 项目

```bash
npm run android:init
```

这将创建 Android 项目结构在 `src-tauri/gen/android/` 目录下。

### 3. 构建 APK

#### 调试版本（更快）

```bash
npm run android:build-debug
```

#### 发布版本

```bash
npm run android:build
```

APK 文件将生成在：
```
src-tauri/gen/android/app/build/outputs/apk/
├── universal/
│   ├── debug/
│   │   └── app-universal-debug.apk
│   └── release/
│       └── app-universal-release.apk
├── arm64-v8a/
├── armeabi-v7a/
└── x86_64/
```

### 4. 安装到设备

#### 通过 USB

```bash
# 确保已启用 USB 调试
adb devices

# 安装 APK
adb install src-tauri/gen/android/app/build/outputs/apk/universal/debug/app-universal-debug.apk
```

#### 直接复制

将 APK 文件复制到手机，点击安装。

## 应用权限

### 自动授予的权限

- `INTERNET` - 网络访问
- `ACCESS_NETWORK_STATE` - 网络状态
- `WAKE_LOCK` - 保持唤醒

### 需要手动授予的权限

#### 使用情况访问权限（必需）

1. 打开应用后，点击"启动监控"
2. 系统会提示需要"使用情况访问"权限
3. 点击"设置"跳转到系统设置
4. 找到"Device Monitor"应用
5. 启用"允许使用情况访问"
6. 返回应用

**为什么需要这个权限？**
- 获取应用使用统计
- 获取前台应用信息
- 收集系统运行数据

#### 电池优化（推荐关闭）

为了保证后台持续运行：

1. 进入"设置" > "应用" > "Device Monitor"
2. 点击"电池"
3. 选择"不优化"或"无限制"

## 配置应用

### 1. 服务器地址

输入接收数据的服务器 API 地址，例如：

- 本地测试：`http://10.0.2.2:3000/api/device-info`（Android 模拟器）
- 局域网：`http://192.168.1.100:3000/api/device-info`
- 公网：`https://your-server.com/api/device-info`

**注意事项：**
- Android 不允许在 HTTPS 应用中使用 HTTP 请求（需要配置网络安全策略）
- 确保服务器防火墙允许来自设备的连接

### 2. 发送间隔

设置数据发送的时间间隔（秒）：

- 最小值：5 秒
- 推荐值：30-60 秒
- 注意：间隔太短会增加电量和流量消耗

### 3. 启动监控

点击"启动监控"按钮开始自动发送数据。

## 网络配置

### 允许 HTTP 请求（开发环境）

如果需要使用 HTTP 连接（不推荐生产环境），需要配置网络安全策略。

创建 `src-tauri/gen/android/app/src/main/res/xml/network_security_config.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true" />
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">192.168.1.0/24</domain>
    </domain-config>
</network-security-config>
```

在 `AndroidManifest.xml` 中引用：

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

## 测试服务器

### 启动本地测试服务器

```bash
cd server-example
npm install
npm start
```

服务器将在 `http://localhost:3000` 运行。

### 从 Android 设备连接

#### 真实设备（USB 调试）

使用端口转发：

```bash
adb reverse tcp:3000 tcp:3000
```

然后在应用中使用：`http://localhost:3000/api/device-info`

#### 真实设备（同一局域网）

1. 查看电脑 IP：
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

2. 在应用中使用：`http://[电脑IP]:3000/api/device-info`
   例如：`http://192.168.1.100:3000/api/device-info`

#### Android 模拟器

使用特殊 IP：`http://10.0.2.2:3000/api/device-info`

## 查看日志

### 实时查看应用日志

```bash
adb logcat | grep -i "device-monitor"
```

### 查看崩溃日志

```bash
adb logcat *:E
```

## 常见问题

### Q: 构建失败，找不到 NDK

**A:** 确保已安装 NDK 并设置环境变量：

```bash
# 安装 NDK
sdkmanager "ndk;26.1.10909125"

# 设置环境变量
export NDK_HOME=$ANDROID_HOME/ndk/26.1.10909125
```

### Q: 应用安装后打不开

**A:** 可能是 ABI 不兼容，尝试安装 universal 版本：

```bash
adb install src-tauri/gen/android/app/build/outputs/apk/universal/debug/app-universal-debug.apk
```

### Q: 无法获取应用使用统计

**A:** 确保已授予"使用情况访问"权限：
1. 设置 > 安全与隐私 > 特殊应用权限
2. 使用情况访问 > Device Monitor > 允许

### Q: 后台运行一段时间后停止

**A:** 调整电池优化设置：
1. 关闭电池优化
2. 允许后台运行
3. 允许自启动（部分厂商）

### Q: 发送失败，网络错误

**A:** 检查以下事项：
1. 设备是否联网
2. 服务器地址是否正确
3. 服务器是否在运行
4. 防火墙是否阻止连接
5. 是否需要配置网络安全策略（HTTP）

### Q: CPU 使用率总是 0

**A:** 这是正常现象，Android 限制了应用获取其他应用的 CPU 使用率。应用只能获取系统整体的 CPU 使用率。

## 生产部署建议

### 1. 使用 HTTPS

- 配置 SSL 证书
- 使用可信任的证书颁发机构

### 2. 添加认证

- API Key 验证
- JWT Token
- 设备唯一标识

### 3. 数据压缩

- 启用 GZIP 压缩
- 减少数据量

### 4. 错误处理

- 实现重试机制
- 本地缓存失败的数据
- 提供详细的错误信息

### 5. 隐私保护

- 敏感数据脱敏
- 遵守隐私政策
- 用户同意机制

## 签名 APK（发布版）

### 1. 生成密钥库

```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 2. 配置签名

编辑 `src-tauri/gen/android/app/build.gradle`：

```gradle
android {
    signingConfigs {
        release {
            storeFile file("my-release-key.keystore")
            storePassword "your-password"
            keyAlias "my-key-alias"
            keyPassword "your-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### 3. 构建签名 APK

```bash
npm run android:build
```

## 参考资源

- [Tauri 官方文档](https://tauri.app/)
- [Android 开发者文档](https://developer.android.com/)
- [Rust 官方文档](https://www.rust-lang.org/)

## 技术支持

如有问题，请提交 Issue 到 GitHub 仓库。

