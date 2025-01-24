# CardForest 技术架构

## 整体架构

CardForest 采用现代的全栈架构：

- **前端**：Next.js + Apollo Client + Chakra UI
- **后端**：NestJS + GraphQL + ArangoDB
- **认证**：NextAuth.js + JWT

## 目录结构

```
cardforest/
├── packages/
│   ├── server/           # NestJS 后端
│   │   ├── controllers/  # REST API 控制器
│   │   ├── graphql/      # GraphQL 解析器和模式
│   │   ├── guards/       # 认证和授权守卫
│   │   ├── modules/      # 功能模块
│   │   ├── services/     # 业务逻辑服务
│   │   └── strategies/   # 认证策略
│   └── web/             # Next.js 前端
```

## 核心模块

1. [认证系统](./modules/auth.md)
2. [用户系统](./modules/user.md)
3. [卡片系统](./modules/card.md)
4. [模板系统](./modules/template.md)

## 技术选型理由

1. **ArangoDB**
   - 支持图数据结构，适合存储卡片间的复杂关系
   - 支持文档存储，适合存储灵活的卡片内容
   - 提供高效的图遍历查询

2. **NestJS + GraphQL**
   - 模块化架构，易于扩展
   - GraphQL 提供灵活的数据查询
   - TypeScript 支持，类型安全

3. **Next.js + Apollo**
   - 服务端渲染支持
   - 强大的数据获取和缓存
   - 现代化的开发体验

## 开发规范

1. **模块组织**
   - 每个功能模块包含自己的 Service、Resolver 和 Types
   - 通过依赖注入管理模块间关系
   - 保持模块的高内聚低耦合

2. **GraphQL 设计**
   - 查询和变更分离
   - 使用 DataLoader 优化性能
   - 遵循 GraphQL 最佳实践

3. **数据库设计**
   - 合理使用文档和边集合
   - 建立适当的索引
   - 优化查询性能

## 部署架构

1. **开发环境**
   - Docker Compose 本地开发
   - 热重载支持
   - 开发工具集成

2. **生产环境**
   - 容器化部署
   - 负载均衡
   - 监控和日志
