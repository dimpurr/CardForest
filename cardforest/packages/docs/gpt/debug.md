# Debug 经验和任务安排

## 调试记录

### Auth.js 集成问题 (2025-01-24)

#### 尝试 1: 基础迁移
- 替换 NextAuth 为 Auth.js
- 问题：无限重定向循环
- 解决：移除自定义登录页面配置

#### 尝试 2: JWT 处理
- 修改后端 callback 为 POST
- 问题：backendJwt 始终为 'absent'
- 原因：session 中未正确传递 JWT

#### 尝试 3: Session 处理（进行中）
1. 症状：
   - session.status 为 'authenticated'
   - backendJwt 缺失
   - GraphQL 请求缺少 authorization header

2. 下一步：
   - 检查 GitHub callback 是否被正确调用
   - 验证 JWT 生成和传递流程
   - 添加更多日志点

### Auth.js JWT 问题调试记录 (2025-01-24)

#### 问题现象

1. 前端日志显示 session 认证成功但 JWT 缺失
   ```
   Auth State: {session: true, jwt: undefined, sessionStatus: 'authenticated', jwtStatus: 'authenticated'}
   useJWT hook session: {hasSession: true, sessionStatus: 'authenticated', backendJwt: 'absent'}
   ```

2. GraphQL 请求失败，因为 authorization header 为空
   ```
   Apollo authLink JWT: {hasJwt: false, jwtPreview: null, headers: Array(0)}
   ```

3. 后端数据库查询错误
   ```
   no value specified for declared bind parameter 'providerId'
   ```

#### 问题分析

1. Auth.js session 回调中的 token 对象没有包含 backendJwt
2. GitHub OAuth profile 结构与后端期望不匹配
   - Auth.js 使用 `profile.sub` 作为用户 ID
   - 后端代码可能在查找 `profile.id`
3. JWT 生成失败导致 GraphQL 请求无法携带认证信息

#### 解决方案

1. 更新 Auth.js 配置中的 profile 回调，确保正确映射 GitHub 用户信息
2. 修改后端 validateOAuthLogin 方法，使用正确的 profile 字段
3. 添加更多日志记录以追踪 JWT 生成和传递过程

#### 待办事项

1. [ ] 检查 GitHub OAuth profile 结构
2. [ ] 更新 Auth.js profile 回调
3. [ ] 修改后端用户验证逻辑
4. [ ] 验证 JWT 生成和传递流程

### 问题修复进展 (2025-01-24 20:58)

1. 修复了 profile 字段不匹配问题：
   - 更新 `auth.service.ts` 中的 profile 类型定义，支持 `sub` 和 `id` 字段
   - 修改 `providerId` 的获取逻辑，按优先级使用：传入的 providerId > profile.sub > profile.id

2. 优化了错误处理和日志记录：
   - 添加了更详细的 profile 信息日志
   - 改进了错误消息的可读性

3. 下一步验证：
   - [ ] 重启前后端服务
   - [ ] 清除浏览器 cookies
   - [ ] 重新尝试登录流程
   - [ ] 检查 JWT 生成和传递是否正常

### 最终解决方案 (2025-01-24 21:03)

#### 问题总结
1. Auth.js 集成问题：
   - JWT 未正确传递到前端 session
   - Apollo Client 无法获取 JWT
   - GraphQL 请求缺少认证头

#### 解决步骤

1. [...nextauth].ts 更新：
   ```typescript
   // JWT 回调优化
   async jwt({ token, account, profile, trigger }) {
     if (account?.access_token || trigger === 'signIn') {
       const data = await fetchBackendJWT({
         access_token: account?.access_token,
         provider: 'github',
         providerId: profile.id || profile.sub,
         profile: {
           sub: profile.sub,
           id: profile.id,
           login: profile.login,
           email: profile.email
         }
       })
       token.backendJwt = data.jwt
     }
     return token
   }

   // Session 回调确保 JWT 传递
   async session({ session, token }) {
     if (token.backendJwt) {
       session.backendJwt = token.backendJwt
     }
     return session
   }
   ```

2. Apollo Client 配置优化：
   ```typescript
   const authLink = setContext(async (operation, { headers }) => {
     const session = await getSession()
     const jwt = session?.backendJwt
     
     return {
       headers: {
         ...headers,
         authorization: jwt ? `Bearer ${jwt}` : '',
         'Content-Type': 'application/json'
       }
     }
   })
   ```

3. useJWT Hook 改进：
   ```typescript
   export const useJWT = () => {
     const { data: session, status } = useSession()
     const [jwt, setJwt] = useState<string | null>(null)

     useEffect(() => {
       if (session?.backendJwt) {
         setJwt(session.backendJwt)
       }
     }, [session, status])

     return {
       jwt,
       isAuthenticated: status === 'authenticated' && !!jwt,
       status,
       session
     }
   }
   ```

#### 验证结果
1. 后端成功生成 JWT：
   ```
   [AuthController] JWT generated successfully
   ```

2. Apollo Client 正确获取 JWT：
   ```
   Apollo authLink JWT: {hasJwt: true, jwtPreview: 'eyJhbGciOi...'}
   Apollo authLink final headers: {authorization: 'present'}
   ```

3. 前端状态正确：
   ```
   Auth State: {session: true, sessionStatus: 'authenticated'}
   useJWT hook: {hasSession: true, backendJwt: 'present'}
   ```

#### 关键经验
1. Auth.js 的 JWT 和 Session 回调必须正确配置才能传递自定义数据
2. Apollo Client 的 authLink 应该异步获取最新的 session 数据
3. useJWT hook 需要响应 session 状态变化
4. 完整的日志记录对调试至关重要

### 代码变更

1. auth.service.ts:
```typescript
async validateOAuthLogin(data: {
  provider: string;
  providerId: string;
  profile: {
    sub?: string;  // Auth.js GitHub provider 使用 sub
    id?: string;   // 向后兼容
    login: string;
    email: string;
  };
  // ...
}) {
  // ...
  providerId: providerId || profile.sub || profile.id
  // ...
}
```

2. [...nextauth].ts:
```typescript
profile: {
  sub: profile?.sub,
  login: profile?.login,
  email: profile?.email
}
```

## 常见问题和解决方案

### 1. Auth.js JWT 问题

**问题描述**：
- Auth.js 的 session 中 backendJwt 始终为 'absent'
- 前端无法获取有效的 JWT token
- GraphQL 请求缺少 authorization header

**解决步骤**：
1. 确保后端正确处理 OAuth 回调：
   - 将 GET 回调改为 POST
   - 正确解析 access_token 和 profile
   - 返回格式化的 JWT response
2. 在 Auth.js 配置中：
   - 添加正确的 session 配置
   - 实现 jwt 和 session 回调
   - 添加详细的日志记录
3. 前端集成：
   - 确保 useJWT hook 正确处理 session 状态
   - 验证 Apollo Client 认证头部设置
   - 添加错误处理和重试逻辑

### 2. 重定向循环

**问题描述**：
- 登录时出现无限重定向
- URL 中的 callbackUrl 参数不断嵌套

**解决方案**：
1. 移除自定义登录页面配置
2. 确保正确配置 `NEXTAUTH_URL`
3. 清除浏览器 cookies 后重试

## Agent 调试指南

### 必要记忆

1. **环境配置**：
   - 前端运行在 http://localhost:3000
   - 后端运行在 http://localhost:3030
   - 需要配置 GitHub OAuth 应用

2. **关键文件位置**：
   - 认证配置：`packages/web-client/pages/api/auth/[...nextauth].ts`
   - 后端控制器：`packages/server/src/controllers/auth.controller.ts`
   - JWT 服务：`packages/server/src/services/auth.service.ts`

3. **调试工具**：
   - 浏览器开发者工具（网络请求和控制台）
   - 前端和后端的日志输出
   - ArangoDB Web 界面（用户数据）

### 调试流程

1. **前端问题**：
   - 检查 Auth.js 配置
   - 验证环境变量
   - 查看 session 状态

2. **后端问题**：
   - 验证 API 路由
   - 检查数据库连接
   - 确认 JWT 生成

3. **集成问题**：
   - 确认 CORS 配置
   - 验证 API 端点
   - 检查认证流程
