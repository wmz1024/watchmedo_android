# 贡献指南

感谢您考虑为 Device Monitor 做出贡献！

## 开发流程

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 开发环境设置

请参考 [README.md](README.md) 中的"本地开发"部分。

## 代码规范

### Rust 代码

- 使用 `rustfmt` 格式化代码
- 运行 `cargo clippy` 检查代码质量
- 添加必要的注释和文档

```bash
cargo fmt
cargo clippy
```

### TypeScript/React 代码

- 使用 Prettier 格式化代码
- 遵循 ESLint 规则
- 使用有意义的变量名和函数名

```bash
npm run format  # 如果配置了
```

## 提交信息规范

使用清晰的提交信息：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式（不影响代码运行的变动）
- `refactor:` 重构
- `test:` 增加测试
- `chore:` 构建过程或辅助工具的变动

示例：
```
feat: 添加电池信息收集功能
fix: 修复内存使用率计算错误
docs: 更新 Android 使用指南
```

## Pull Request 指南

1. 确保代码能够编译和运行
2. 更新相关文档
3. 添加测试（如果适用）
4. 确保 CI/CD 通过
5. 详细描述您的更改

## 报告问题

使用 GitHub Issues 报告 bug 或建议新功能。

### Bug 报告应包含：

- 问题描述
- 重现步骤
- 预期行为
- 实际行为
- 环境信息（操作系统、版本等）
- 截图（如果适用）

### 功能建议应包含：

- 功能描述
- 使用场景
- 预期效果
- 可能的实现方案（可选）

## 行为准则

- 尊重所有贡献者
- 接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

## 许可证

提交代码即表示您同意将您的贡献按照 MIT 许可证授权。

## 问题？

如有任何问题，请随时开启一个 Issue 讨论。

感谢您的贡献！🎉

