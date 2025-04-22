# CardForest 后端改进计划

## 项目目标回顾

CardForest 是一个面向对象的卡片系统，旨在结合 Notion 的结构化数据管理和 Obsidian/Roam 的动态链接能力，创建一个既灵活又规范的知识管理系统。核心特性包括：

1. **模板继承体系**：采用原型链式的继承机制，允许多层次的模板继承和字段扩展
2. **卡片的多层次内容**：包括 Body（主体内容）、Content（富文本正文）和 Meta（元数据）
3. **动态链接系统**：支持 Meta 引用、内联引用和嵌入引用

## 当前后端架构分析

当前后端采用 NestJS + GraphQL + ArangoDB 架构，存在以下问题：

- [ ] **数据访问层不一致**：直接在服务中使用 ArangoDB API，混合使用字符串查询和 aql 模板
- [ ] **错误处理不统一**：缺乏统一的错误处理机制，错误消息格式不一致
- [ ] **用户对象处理不一致**：用户 ID 提取逻辑分散，缺乏统一的用户对象模型
- [ ] **代码重复**：查询逻辑在多个服务中重复，缺乏共享的工具函数
- [ ] **类型安全不足**：大量使用 `any` 类型，GraphQL 生成的类型未充分利用
- [ ] **配置管理分散**：环境变量直接在代码中使用，缺乏集中式的配置管理

## 改进计划

### 第一阶段：数据访问层重构

- [x] **1.1 创建统一的仓库模式**
  - [x] 实现基础仓库类 `BaseRepository<T>`：包含构造函数接收 Database 和 collectionName；实现 findById/findAll/create/update/delete 等基础方法；使用 aql 模板字符串构建查询；添加适当的类型注解确保类型安全
  - [x] 实现 UserRepository：继承 BaseRepository<User>；添加 findByUsername/findByOAuthId 等特定方法；使用 @Injectable() 装饰器使其可注入
  - [x] 实现 CardRepository：继承 BaseRepository<Card>；添加 findByCreator/findWithRelations 等特定方法；处理卡片关系查询
  - [x] 实现 ModelRepository：继承 BaseRepository<Model>；添加 findWithInheritance 等特定方法；处理模板继承关系
  - [x] 在服务中注入并使用仓库：将直接的数据库访问替换为仓库方法调用；使用构造函数注入仓库实例

- [x] **1.2 统一 AQL 查询构建**
  - [x] 使用 arangojs 提供的 `aql` 模板字符串替换原始字符串查询：将所有字符串拼接的查询替换为 aql模板；确保参数作为变量传入而非字符串拼接；使用 ${} 语法插入参数
  - [x] 创建常用查询工具函数：实现 createPaginatedQuery 函数支持分页（包含 offset/limit）；实现 createSortedQuery 函数支持排序（包含升序/降序）；实现 createFilteredQuery 函数支持复杂过滤条件
  - [x] 使用类型安全的查询构建：确保查询函数返回 aql.Query 类型；使用泛型参数指定返回类型；在查询函数中添加适当的类型注解

### 第二阶段：错误处理与日志统一

- [ ] **2.1 创建统一的错误处理机制**
  - [ ] 实现基础错误类 `AppError`：继承自 Error；包含 message/code/statusCode/data 属性；在构造函数中设置 this.name = this.constructor.name
  - [ ] 实现特定错误类：`NotFoundError`（404，资源未找到）；`ValidationError`（400，验证错误）；`UnauthorizedError`（401，未授权）；`ForbiddenError`（403，禁止访问）
  - [ ] 创建 HTTP 异常过滤器：实现 ExceptionFilter 接口；使用 @Catch() 装饰器；处理 AppError 实例并返回结构化响应；在 main.ts 中使用 app.useGlobalFilters()
  - [ ] 创建 GraphQL 异常过滤器：实现 formatError 函数；在 GraphQLModule.forRoot 中配置；将 AppError 转换为结构化的 GraphQL 错误
  - [ ] 在服务中使用自定义错误：替换直接抛出的错误；使用特定错误类型提供更多上下文；在错误中包含足够的详细信息

- [ ] **2.2 改进日志系统**
  - [ ] 集成 nestjs-pino：安装 nestjs-pino/pino/pino-pretty 包；在 AppModule 中导入 LoggerModule.forRoot()；配置日志级别、格式和输出
  - [ ] 在 main.ts 中配置全局日志：使用 app.useLogger(app.get(Logger))；设置 bufferLogs: true；确保所有异常都被记录
  - [ ] 在服务中注入和使用日志器：使用构造函数注入 Logger；替换所有 console.log/error/warn 调用；使用适当的日志级别（info/error/warn/debug）
  - [ ] 添加结构化日志：使用对象而非字符串记录日志；包含上下文信息（用户ID、请求ID等）；使用 logger.setContext() 设置模块名称

### 第三阶段：用户对象和认证统一

- [ ] **3.1 统一用户对象模型**
  - [ ] 创建用户接口：定义 User 接口包含所有必要字段（_id/_key/username/email/provider/providerId/createdAt/updatedAt）；定义 UserPayload 接口用于 JWT 载荷（sub/username/provider）
  - [ ] 创建用户工具类：实现 extractUserId 方法从不同格式提取用户ID（字符串/对象的sub/_key/id/_id属性）；实现 createUserReference 方法创建标准用户引用（如 'users/123'）
  - [ ] 实现用户序列化与反序列化：创建 toUserDto 方法转换数据库用户对象为 DTO；创建 normalizeUser 方法标准化不同来源的用户对象
  - [ ] 在 GraphQL 解析器中使用统一用户模型：使用 @CurrentUser() 装饰器获取当前用户；确保返回的用户对象结构一致
  - [ ] 在数据库查询中处理用户引用：使用灵活的查询条件处理不同格式的 createdBy 字段；在关系查询中正确处理用户引用

- [ ] **3.2 改进认证系统**
  - [ ] 重构 JWT 服务：使用 @nestjs/jwt 模块；实现 generateToken/validateToken/extractTokenFromRequest 方法；使用配置服务获取 JWT 密钥和过期时间
  - [ ] 创建统一的认证守卫：实现 JwtAuthGuard 类实现 CanActivate 接口；从多个来源提取 JWT（Authorization 头部/cookies/URL 参数）；在 GraphQL 和 REST 接口中使用相同的守卫
  - [ ] 改进 OAuth 集成：使用 @nestjs/passport 和相应的策略（passport-github）；实现统一的 OAuth 回调处理；确保前端和后端认证流程兼容
  - [ ] 创建 CurrentUser 装饰器：实现参数装饰器提取当前用户；在 GraphQL 解析器和 REST 控制器中使用；支持可选参数指定是否必需用户
  - [ ] 实现统一的认证模块：创建 AuthModule 包含所有认证相关服务和守卫；使用 forRoot/forFeature 模式支持配置；导出所有必要的服务和守卫

### 第四阶段：类型安全和代码质量

- [ ] **4.1 增强类型安全**
  - [ ] 减少 `any` 类型的使用：将所有 any 类型替换为具体类型或泛型；使用 unknown 代替 any 并添加类型检查；在必要时使用类型断言而非 any
  - [ ] 利用 GraphQL 生成的类型：配置 GraphQLModule 生成 TypeScript 类型定义；在解析器和服务中使用生成的类型；确保返回类型与生成的类型一致
  - [ ] 创建 DTO 类：为所有输入和输出创建 DTO 类（CreateCardDto/UpdateCardDto/CardDto 等）；使用 class-validator 装饰器添加验证规则；使用 class-transformer 实现类型转换
  <!-- - [ ] 实现验证管道：在 main.ts 中添加全局验证管道 app.useGlobalPipes(new ValidationPipe())；配置验证选项（whitelist/transform/forbidNonWhitelisted）；定制验证错误消息 -->
  <!-- - [ ] 使用接口和类型别名：为所有实体创建接口（User/Card/Model 等）；使用类型别名简化复杂类型；使用泛型提高代码复用性 -->

<!-- - [ ] **4.2 代码质量改进**（暂时不需要）
  - [ ] 实现单元测试
  - [ ] 添加 ESLint 规则
  - [ ] 使用 Prettier 格式化代码 -->

<!-- ### 第五阶段：性能优化（暂时不需要）

- [ ] **5.1 查询优化**
  - [ ] 优化 ArangoDB 查询
  - [ ] 实现数据缓存
  - [ ] 添加数据库索引

- [ ] **5.2 GraphQL 优化**
  - [ ] 实现数据加载器（DataLoader）
  - [ ] 优化 N+1 查询问题
  - [ ] 添加查询复杂度限制 -->

## 技术选型与实施策略

### 推荐使用的库

1. **数据访问层**
   - arangojs - ArangoDB 官方 JavaScript 驱动，提供了 aql 模板字符串功能
   - arangojs-repository - 可选，为 ArangoDB 提供仓库模式的库（这个库并不存在，谢谢，别被误导了）

2. **错误处理与日志**
   - nestjs-pino - NestJS 的 Pino 日志集成，提供高性能结构化日志
   - pino-pretty - 美化 Pino 日志输出，便于开发调试

3. **验证与转换**
   - class-validator - 基于装饰器的强大验证库
   - class-transformer - 对象到类的转换库，与 class-validator 配合使用

4. **配置管理**
   - @nestjs/config - NestJS 官方配置模块，提供环境变量管理

### 实施策略

1. **增量实施**
   - 逐步改进，避免大规模重写
   - 先实现基础设施，再逐步迁移现有代码

2. **保持向后兼容**
   - 确保改进不会破坏现有功能
   - 添加充分的测试和错误处理

3. **优先级实施顺序**
   - 先实现数据访问层，为其他改进套用基础
   - 然后实现错误处理和日志系统
   - 最后实现用户对象和认证统一
   - 最后增强类型安全

## 预期成果

通过实施这个改进计划，我们期望达到以下成果：

1. **更好地支持模板继承系统**
   - 通过统一的数据访问层，更好地处理模板继承关系
   - 提供类型安全的方式处理模板字段和继承链
   - 使用仓库模式简化复杂的模板查询

2. **增强卡片关系管理**
   - 通过统一的查询构建，更高效地处理卡片关系
   - 提供类型安全的关系查询方法
   - 改进错误处理，提供更好的调试体验

3. **提高开发效率**
   - 通过统一的代码组织和模式，减少重复工作
   - 提供更好的类型提示和错误检查
   - 通过结构化日志和错误处理，简化调试过程

4. **增强系统安全性和可靠性**
   - 通过统一的认证和授权机制，增强系统安全性
   - 通过统一的错误处理，提高系统稳定性
   - 通过类型安全和验证，减少运行时错误

5. **为未来功能开发奠定基础**
   - 提供清晰的代码组织和模式，便于扩展
   - 通过统一的数据访问层，简化新功能的开发
   - 为未来的协作功能和实时同步提供基础

这个计划将使 CardForest 后端更好地支持面向对象的卡片系统设计，并为未来的功能开发提供坚实的基础。
