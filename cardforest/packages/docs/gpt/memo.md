# CardForest 开发备忘录

## API 命名规范

### GraphQL 查询命名
- 使用 `my` 前缀表示当前用户相关的查询，如 `myCards`，而不是 `userCards`
- 使用 `full` 后缀表示包含完整关联数据的查询，如 `card/full`、`template/full`
- 保持命名一致性，避免同一概念使用不同名称（如 `userCards` vs `myCards`）

## 后端开发规范

### 调试页面设计
后端调试页面（如 `/install`、`/card/full`）保持简单的 HTML 风格：
- 只使用基础 HTML 标签
- 避免复杂的样式和脚本
- 主要用于开发调试和状态查看

### 认证系统
系统包含两套认证流程，注意区分：
1. 后端调试认证
   - 路径：`/user/auth/github`
   - 回调：`/user/auth/auth-callback-backend`
   - 用途：开发调试和后端状态查看

2. 前端应用认证
   - 路径：前端路由处理
   - 回调：前端处理 OAuth 回调
   - 用途：实际用户使用

## 数据模型设计

### 模板系统
模板设计要点：
- 支持继承关系：基础模板 -> 特化模板
- 字段定义包含验证规则和 UI 展示信息
- 系统字段（createdAt, updatedAt）自动处理

### 卡片系统
卡片数据结构：
- 基础字段：title, content, body
- meta 字段存储模板特定的数据
- 支持父子关系：通过 relations 集合管理

## 多平台部署架构

### 部署模式
CardForest 支持三种部署模式：
1. **Electron 桌面应用**
   - 本地数据存储
   - 离线优先
   - 系统级集成（文件系统访问等）

2. **Web 应用**
   - 公开访问
   - 多用户支持
   - 实时协作

3. **同构部署**
   - 支持在同一代码库中切换部署模式
   - 共享核心业务逻辑
   - 适配不同运行环境

### 技术实现要点

#### 代码组织
```
packages/
  ├── core/           # 共享的核心逻辑
  │   ├── models/     # 数据模型
  │   └── services/   # 业务服务
  │
  ├── web-client/     # Next.js Web 应用
  │   └── pages/      # Web 路由和页面
  │
  ├── desktop/        # Electron 应用
  │   ├── main/       # 主进程
  │   └── renderer/   # 渲染进程（复用 web-client）
  │
  └── server/         # 后端服务
      └── src/        # 服务器代码
```

#### 关键设计决策
1. **数据层抽象**
   - 使用 Repository 模式隔离数据访问
   - Web 模式：远程 ArangoDB
   - Desktop 模式：本地 ArangoDB 或 SQLite

2. **认证系统**
   - Web 模式：OAuth + JWT
   - Desktop 模式：系统级认证

3. **文件系统**
   - Web 模式：云存储
   - Desktop 模式：本地文件系统

4. **状态管理**
   - 使用 Jotai 支持不同环境
   - Provider 模式注入环境依赖

#### 开发注意事项
1. **环境检测**
   ```typescript
   const isElectron = typeof window !== 'undefined' && 
                     window.process?.type === 'renderer';
   ```

2. **条件导入**
   ```typescript
   const storage = isElectron 
     ? require('./electron-storage')
     : require('./web-storage');
   ```

3. **API 适配**
   - 使用适配器模式处理平台差异
   - 保持 API 接口一致性
   - 在运行时选择具体实现

4. **构建配置**
   - 使用环境变量控制构建目标
   - 分离平台特定代码
   - 共享通用组件和逻辑

### 常见陷阱
1. **路径处理**
   - Web：使用 URL 路径
   - Desktop：使用文件系统路径
   - 注意跨平台兼容性

2. **API 调用**
   - Web：REST/GraphQL API
   - Desktop：IPC 通信
   - 需要统一的抽象层

3. **数据同步**
   - Web：实时同步
   - Desktop：定期同步
   - 处理冲突解决

4. **安全考虑**
   - Web：CSRF、XSS 防护
   - Desktop：本地权限管理
   - 加密敏感数据

## 待定事项与开发优先级

### 暂不考虑的功能
1. **文件系统和附件**
   - 本地文件系统集成
   - 云存储方案
   - 附件预览和管理
   - 待进一步设计存储策略

2. **多用户场景**
   - 用户权限系统
   - 协作功能
   - 数据隔离策略
   - 实时同步机制

3. **部署模式整合**
   - Electron 与 Web 数据同步
   - 多设备同步策略
   - 离线功能范围
   - 用户数据迁移

### 当前开发重点
1. **Web 端核心功能**
   - 卡片编辑和管理
   - 模板系统
   - 基础 UI 组件
   - 单用户数据流

2. **基础架构**
   - Next.js + Radix UI 设置
   - GraphQL 集成
   - 状态管理（Jotai）
   - 路由系统

3. **UI/UX 设计**
   - 响应式布局
   - 主题系统
   - 交互设计
   - 可访问性

### 开发顺序
1. 搭建基础框架
2. 实现核心 UI 组件
3. 集成 GraphQL
4. 开发卡片编辑器
5. 实现模板系统
6. 添加关系管理
7. 优化用户体验

## 常见问题

### 认证相关
- JWT token 需要在 cookie 中设置正确的选项（httpOnly, secure, sameSite）
- 前端和后端的认证状态需要同步
- 使用 AuthGuard 保护需要认证的 API

### GraphQL 相关
- 使用 @UseGuards(AuthGuard) 保护需要认证的查询
- 使用 @CurrentUser() 获取当前用户信息
- 注意字段命名的一致性和语义性

### 数据库相关
- ArangoDB 查询中的绑定参数必须显式提供
- 使用 aql 标签字符串处理复杂查询
- 关系查询需要考虑性能影响
