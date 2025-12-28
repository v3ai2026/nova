# 🤝 贡献指南

感谢你考虑为本项目做出贡献！

## 📋 开发流程

### 1. 克隆仓库
```bash
git clone https://github.com/v3ai2026/nova.git
cd nova
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 创建功能分支
```bash
git checkout -b feature/your-feature-name
```

### 5. 开发并提交
```bash
# 开发你的功能
# ...

# 提交前自动检查会运行
git add .
git commit -m "feat: add your feature"
```

### 6. 推送并创建 PR
```bash
git push origin feature/your-feature-name
```

然后在 GitHub 上创建 Pull Request。

## ✅ 提交前检查

在提交 PR 前，请确保：

```bash
# 代码检查
npm run lint

# 类型检查
npm run type-check

# 运行测试
npm run test

# 代码格式化
npm run format
```

## 📝 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type)：**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例：**
```
feat(user): add user profile page

- Add user profile component
- Add user edit form
- Add user avatar upload

Closes #123
```

## 🔍 Code Review

所有 PR 都需要至少一名团队成员审查通过才能合并。

请阅读 [CODE_REVIEW.md](CODE_REVIEW.md) 了解详细的审查标准。

## 🐛 报告 Bug

请使用 GitHub Issues 报告 Bug，并提供：

1. Bug 描述
2. 复现步骤
3. 期望行为
4. 实际行为
5. 截图（如果适用）
6. 环境信息（浏览器、操作系统等）

## 💡 提出新功能

欢迎提出新功能建议！请创建 Issue 并说明：

1. 功能描述
2. 使用场景
3. 预期收益
4. 可能的实现方案

## 📞 联系我们

如有任何问题，欢迎：

- 创建 Issue
- 发起 Discussion
- 联系维护者

感谢你的贡献！🎉
