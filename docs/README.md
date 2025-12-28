# 项目文档索引

欢迎来到 DeployHub 项目的完整文档。本文档集提供了项目架构、API 规范、数据流和实现指南的全面概述。

---

## 📚 文档列表

### 1. [ROUTES_COMPLETE.md](./ROUTES_COMPLETE.md) - 完整路由清单

**内容**:
- 📄 所有 17 个页面路由的详细文档
- 🎣 12 个 Composables（钩子）清单（6个已实现，6个待实现）
- 🔌 21 个后端 API 端点清单（1个已实现，20个待实现）
- 🗄️ 6 个数据库模型（2个已有，4个待添加）
- 📊 项目完成度统计（40%）
- 🎯 下一步行动计划

**适合阅读对象**:
- 项目经理：了解项目整体进度
- 开发人员：查找特定页面或功能的状态
- 新成员：快速了解项目结构

**关键信息**:
- 每个路由的实现状态（✅ 已实现 / ❌ 缺失）
- 每个页面需要的 Composables 和 API
- 优先级排序的开发计划

---

### 2. [DATA_FLOW.md](./DATA_FLOW.md) - 数据流和钩子连接

**内容**:
- 🔄 完整数据流示意图
- 📋 具体实现示例（获取、创建、删除、更新）
- 🎣 所有 Composables 的使用场景表
- 🔐 认证流程详解
- 📊 状态管理模式
- 🔄 数据同步策略（乐观更新、轮询、缓存失效）
- 🎯 最佳实践（错误处理、加载状态、防抖节流）

**适合阅读对象**:
- 前端开发人员：理解数据如何在应用中流动
- 新成员：学习项目的状态管理模式
- 代码审查者：确保数据流符合最佳实践

**关键信息**:
- 用户操作 → Composable → API → 数据库 → 响应更新的完整流程
- 每个操作的具体代码示例
- 响应式状态管理的实现方式

---

### 3. [API_SPEC.md](./API_SPEC.md) - API 规范文档

**内容**:
- 📋 21 个 API 端点的完整规范
- 🔐 认证和授权机制
- ❌ 错误处理规范
- 📝 请求/响应格式
- 🔒 安全注意事项
- 📊 数据库关系图
- 🎯 实现优先级

**适合阅读对象**:
- 后端开发人员：实现 API 端点
- 前端开发人员：调用 API 时查看规范
- API 使用者：了解如何使用各个端点

**关键信息**:
- 每个端点的详细规范（URL、方法、参数、响应）
- 认证要求和权限验证
- 完整的实现代码示例

---

## 🎯 快速导航

### 按角色导航

#### 🎨 前端开发人员
1. 先阅读 [ROUTES_COMPLETE.md](./ROUTES_COMPLETE.md) 了解页面结构
2. 阅读 [DATA_FLOW.md](./DATA_FLOW.md) 学习数据流和 Composables
3. 参考 [API_SPEC.md](./API_SPEC.md) 调用 API

#### ⚙️ 后端开发人员
1. 先阅读 [API_SPEC.md](./API_SPEC.md) 了解要实现的 API
2. 阅读 [DATA_FLOW.md](./DATA_FLOW.md) 了解认证流程
3. 参考 [ROUTES_COMPLETE.md](./ROUTES_COMPLETE.md) 了解数据库模型

#### 📋 项目经理
1. 阅读 [ROUTES_COMPLETE.md](./ROUTES_COMPLETE.md) 的完成度统计
2. 查看下一步行动计划
3. 了解各功能的优先级

#### 🆕 新团队成员
1. 按顺序阅读所有三个文档
2. 重点关注 [DATA_FLOW.md](./DATA_FLOW.md) 的示例代码
3. 参考主 [README.md](../README.md) 了解项目设置

---

### 按功能导航

#### 🗂️ 项目管理功能
- **路由**: [ROUTES_COMPLETE.md](./ROUTES_COMPLETE.md) - 路由 5-9
- **数据流**: [DATA_FLOW.md](./DATA_FLOW.md) - 示例 1, 2, 4
- **API**: [API_SPEC.md](./API_SPEC.md) - Projects API (5个端点)

#### 🚀 部署管理功能
- **路由**: [ROUTES_COMPLETE.md](./ROUTES_COMPLETE.md) - 路由 8, 10, 11
- **数据流**: [DATA_FLOW.md](./DATA_FLOW.md) - 示例 3
- **API**: [API_SPEC.md](./API_SPEC.md) - Deployments API (4个端点)

#### 👥 团队管理功能
- **路由**: [ROUTES_COMPLETE.md](./ROUTES_COMPLETE.md) - 路由 13
- **API**: [API_SPEC.md](./API_SPEC.md) - Teams API (5个端点)

#### 🔑 Token 管理功能
- **路由**: [ROUTES_COMPLETE.md](./ROUTES_COMPLETE.md) - 路由 16
- **API**: [API_SPEC.md](./API_SPEC.md) - Tokens API (3个端点)

---

## 📊 项目概览

### 当前状态

| 类别 | 已完成 | 总数 | 完成率 |
|------|--------|------|--------|
| **页面路由** | 11 | 17 | 65% |
| **Composables** | 6 | 12 | 50% |
| **API 端点** | 1 | 21 | 5% |
| **数据库模型** | 2 | 6 | 33% |
| **总体** | - | - | **~40%** |

### 技术栈

- **前端框架**: Nuxt 3 (Vue 3)
- **UI 库**: TailwindCSS
- **图标**: Lucide Icons
- **认证**: Supabase Auth
- **数据库**: PostgreSQL (Neon)
- **ORM**: Prisma
- **TypeScript**: 完全类型安全

---

## 🚀 开发流程

### 1. 实现新功能的步骤

```bash
# 1. 查看 ROUTES_COMPLETE.md 了解该功能的状态
# 2. 如果需要 API，先实现后端

# 实现 API (参考 API_SPEC.md)
1. 创建 server/api/... 文件
2. 实现认证和权限验证
3. 实现业务逻辑
4. 测试 API

# 实现 Composable (参考 DATA_FLOW.md)
1. 创建 composables/use....ts
2. 实现 useState 状态管理
3. 实现 API 调用函数
4. 添加错误处理

# 实现页面
1. 创建 pages/... .vue
2. 使用 Composable 获取数据
3. 添加 UI 组件
4. 测试功能

# 3. 更新文档
更新对应文档中的状态（❌ → ✅）
```

### 2. 代码审查清单

- [ ] 是否遵循 [DATA_FLOW.md](./DATA_FLOW.md) 的数据流模式？
- [ ] API 是否符合 [API_SPEC.md](./API_SPEC.md) 的规范？
- [ ] 是否添加了适当的错误处理？
- [ ] 是否添加了加载状态？
- [ ] 是否验证了用户权限？
- [ ] 是否更新了文档状态？

---

## 🎯 下一步行动

根据 [ROUTES_COMPLETE.md](./ROUTES_COMPLETE.md) 的优先级：

### 优先级 1（核心功能）- 当前重点 🔥

1. **扩展数据库模型**
   - [ ] 添加 `Deployment` 模型
   - [ ] 添加 `Team` 模型
   - [ ] 添加 `TeamMember` 模型
   - [ ] 添加 `ApiToken` 模型
   - [ ] 运行 `prisma migrate dev`

2. **实现项目相关 API**
   - [ ] `GET /api/projects`
   - [ ] `POST /api/projects`
   - [ ] `GET /api/projects/[id]`
   - [ ] `PUT /api/projects/[id]`
   - [ ] `DELETE /api/projects/[id]`

3. **创建 useProjects Composable**
   - [ ] 实现所有项目管理函数
   - [ ] 添加状态管理
   - [ ] 添加错误处理

4. **更新页面使用真实 API**
   - [ ] 更新 `/dashboard`
   - [ ] 更新 `/projects`
   - [ ] 更新 `/projects/[id]`
   - [ ] 创建 `/projects/new`

### 优先级 2（部署功能）

5. **实现部署相关 API** (4个端点)
6. **创建 useDeployments Composable**
7. **更新部署相关页面**

### 优先级 3（其他功能）

8. **实现团队、Token、用户 API**
9. **创建对应 Composables**
10. **创建缺失页面**

---

## 📖 相关文档

### 项目主文档
- [主 README](../README.md) - 项目介绍和设置指南
- [组件文档](../COMPONENTS.md) - UI 组件库完整文档
- [数据库文档](../DATABASE.md) - 数据库配置说明

### 外部资源
- [Nuxt 3 文档](https://nuxt.com/docs)
- [Vue 3 文档](https://vuejs.org/)
- [Prisma 文档](https://www.prisma.io/docs)
- [Supabase 文档](https://supabase.com/docs)
- [TailwindCSS 文档](https://tailwindcss.com/docs)

---

## 🤝 贡献指南

### 添加新功能

1. 在相应文档中标记功能状态为"进行中"
2. 按照 [开发流程](#开发流程) 实现功能
3. 更新文档状态为"已完成"
4. 提交 PR 并附上文档引用

### 更新文档

1. 保持文档与代码同步
2. 更新完成度统计
3. 如有架构变更，更新数据流图
4. 添加新的代码示例

---

## 📝 文档维护

### 文档更新频率

- **ROUTES_COMPLETE.md**: 每添加新页面/功能时更新
- **DATA_FLOW.md**: 架构变更或添加新模式时更新
- **API_SPEC.md**: 每实现/修改 API 时更新
- **本文件 (README.md)**: 重大里程碑时更新

### 文档版本

- **当前版本**: v1.0.0
- **最后更新**: 2024-01-15
- **维护者**: DeployHub Team

---

## ❓ 常见问题

### Q: 我应该先看哪个文档？
**A**: 取决于你的角色：
- 新成员：按顺序阅读 ROUTES_COMPLETE → DATA_FLOW → API_SPEC
- 前端开发：DATA_FLOW → ROUTES_COMPLETE → API_SPEC
- 后端开发：API_SPEC → DATA_FLOW → ROUTES_COMPLETE

### Q: 文档中的状态标记是什么意思？
**A**: 
- ✅ 已实现并可用
- ❌ 尚未实现，需要开发
- 🚧 正在开发中
- 📝 已计划但未开始

### Q: 如何知道某个功能依赖哪些 API？
**A**: 查看 ROUTES_COMPLETE.md 中每个路由的"需要的 API"部分。

### Q: 数据流图中的箭头表示什么？
**A**: 箭头表示数据的流向，从用户操作开始，经过各层，最终返回到用户界面。

---

## 📞 获取帮助

如有问题或需要澄清：

1. 查看相关文档的详细说明
2. 查看代码中的实现示例
3. 联系项目维护者
4. 在团队聊天中提问

---

**最后更新**: 2024-01-15  
**文档版本**: 1.0.0  
**项目进度**: 约 40% 完成

祝开发愉快！🚀
