@echo off
echo =========================================
echo Device Monitor - 项目设置脚本
echo =========================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js 20+
    exit /b 1
)
echo ✅ Node.js 已安装

REM 检查 Rust
where rustc >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Rust 未安装，请先安装 Rust
    echo    下载地址: https://rustup.rs/
    exit /b 1
)
echo ✅ Rust 已安装

REM 安装前端依赖
echo.
echo 📦 安装前端依赖...
call npm install

REM 安装 Tauri CLI
echo.
echo 📦 安装 Tauri CLI...
call npm install -g @tauri-apps/cli@next

REM 添加 Rust Android 目标
echo.
echo 📦 添加 Rust Android 编译目标...
call rustup target add aarch64-linux-android
call rustup target add armv7-linux-androideabi
call rustup target add i686-linux-android
call rustup target add x86_64-linux-android

echo.
echo =========================================
echo ✅ 设置完成！
echo =========================================
echo.
echo 下一步：
echo 1. 确保已安装 Android SDK 和 NDK
echo 2. 设置环境变量：
echo    set ANDROID_HOME=C:\path\to\android-sdk
echo    set NDK_HOME=%%ANDROID_HOME%%\ndk\26.1.10909125
echo.
echo 3. 初始化 Android 项目：
echo    npm run tauri android init
echo.
echo 4. 构建 APK：
echo    npm run tauri android build
echo.
pause

