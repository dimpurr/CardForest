# 认证系统

## 概述

认证系统负责用户身份验证和会话管理，支持多种认证方式：
- GitHub OAuth
- JWT Token
- （未来可扩展其他认证方式）

## 核心组件

### 1. 认证策略

**GitHub 策略** (`strategies/github.strategy.ts`)
- 处理 GitHub OAuth 认证流程
- 自动创建新用户（如果不存在）
- 生成 JWT token

```typescript
// 关键流程
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  async validate(profile: any) {
    // 1. 获取用户信息
    // 2. 创建/更新用户
    // 3. 返回用户数据
  }
}
```

### 2. 认证守卫

**JWT 守卫** (`guards/jwt-auth.guard.ts`)
- 验证请求中的 JWT token
- 注入用户信息到请求上下文
- 保护需要认证的路由

### 3. 认证服务

**AuthService** (`services/auth.service.ts`)
- 管理用户认证状态
- 生成和验证 JWT tokens
- 处理用户会话

## 数据流

1. **GitHub 登录流程**：
   ```
   用户 -> GitHub OAuth -> 回调 -> 创建/更新用户 -> 生成 JWT -> 返回 token
   ```

2. **API 认证流程**：
   ```
   请求 -> JWT 守卫 -> 验证 token -> 注入用户信息 -> 处理请求
   ```

## 配置项

主要配置在 `.env` 文件中：
```
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
JWT_SECRET=xxx
```

## 相关文件

- `src/strategies/github.strategy.ts`
- `src/guards/jwt-auth.guard.ts`
- `src/services/auth.service.ts`
- `src/controllers/auth.controller.ts`

## 扩展点

1. **新认证方式**
   - 实现新的 Passport 策略
   - 添加相应的控制器和服务
   - 更新认证流程

2. **权限系统**
   - 实现细粒度的权限控制
   - 添加角色管理
   - 支持资源级别的权限
