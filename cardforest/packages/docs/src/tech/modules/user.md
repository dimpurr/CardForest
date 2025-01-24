# 用户系统

## 概述

用户系统管理用户账户、认证和授权。支持多种认证方式，并与卡片系统紧密集成，控制资源访问权限。

## 数据模型

### 用户结构
```typescript
interface User {
  _key: string;         // ArangoDB 文档键
  username: string;     // 用户名
  password?: string;    // 密码（可选，OAuth用户可能没有）
  email?: string;       // 邮箱
  profile: {           // 用户资料
    avatar?: string;    // 头像
    displayName?: string;
    bio?: string;
  };
  oauth: {             // OAuth 信息
    github?: {
      id: string;
      username: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}
```

## 核心组件

### 1. 用户服务

**UserService** (`services/user.service.ts`)
- 用户 CRUD 操作
- 密码管理
- 用户资料更新

关键方法：
```typescript
// 创建用户
async createUser(input: CreateUserInput) {
  // 1. 验证用户数据
  // 2. 处理密码
  // 3. 创建用户记录
}

// 通过 OAuth 创建/更新用户
async upsertOAuthUser(provider: string, profile: any) {
  // 1. 查找现有用户
  // 2. 更新或创建用户
  // 3. 关联 OAuth 信息
}
```

### 2. GraphQL API

**用户解析器** (`graphql/user.resolver.ts`)
- 用户查询和变更
- 用户资料管理
- 权限控制

## 数据库设计

### 集合
1. `users`：存储用户数据
2. `user_sessions`：存储会话信息（可选）

### 索引
- 用户名唯一索引
- 邮箱唯一索引
- OAuth ID 索引

### 示例查询
```aql
// 获取用户及其卡片
FOR user IN users
  FILTER user._key == @userId
  LET cards = (
    FOR card IN cards
    FILTER card.createdBy == user._id
    RETURN card
  )
  RETURN { user, cards }
```

## 相关文件

- `src/services/user.service.ts`
- `src/graphql/user.resolver.ts`
- `src/strategies/github.strategy.ts`

## 权限系统

### 资源访问控制
1. **卡片权限**
   - 创建者完全控制
   - 支持共享和协作
   - 公开/私有设置

2. **系统权限**
   - 模板创建权限
   - 系统设置权限
   - 用户管理权限

## 扩展点

1. **认证方式**
   - 添加新的 OAuth 提供商
   - 实现邮箱验证
   - 支持双因素认证

2. **用户功能**
   - 用户组和团队
   - 高级权限管理
   - 用户活动日志

3. **资料管理**
   - 自定义资料字段
   - 用户偏好设置
   - 通知管理
