#!/bin/bash

echo "========================================="
echo "Device Monitor - 项目设置脚本"
echo "========================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 20+"
    exit 1
fi
echo "✅ Node.js 版本: $(node --version)"

# 检查 Rust
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust 未安装，请先安装 Rust"
    echo "   安装命令: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi
echo "✅ Rust 版本: $(rustc --version)"

# 安装前端依赖
echo ""
echo "📦 安装前端依赖..."
npm install

# 安装 Tauri CLI
echo ""
echo "📦 安装 Tauri CLI..."
npm install -g @tauri-apps/cli@next

# 添加 Rust Android 目标
echo ""
echo "📦 添加 Rust Android 编译目标..."
rustup target add aarch64-linux-android
rustup target add armv7-linux-androideabi
rustup target add i686-linux-android
rustup target add x86_64-linux-android

echo ""
echo "========================================="
echo "✅ 设置完成！"
echo "========================================="
echo ""
echo "下一步："
echo "1. 确保已安装 Android SDK 和 NDK"
echo "2. 设置环境变量："
echo "   export ANDROID_HOME=/path/to/android-sdk"
echo "   export NDK_HOME=\$ANDROID_HOME/ndk/26.1.10909125"
echo ""
echo "3. 初始化 Android 项目："
echo "   npm run tauri android init"
echo ""
echo "4. 构建 APK："
echo "   npm run tauri android build"
echo ""

