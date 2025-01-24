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
