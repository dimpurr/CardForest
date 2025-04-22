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

- [ ] **1.1 创建统一的仓库模式**
  - [ ] 实现基础仓库类 `BaseRepository<T>`：包含构造函数接收 Database 和 collectionName；实现 findById/findAll/create/update/delete 等基础方法；使用 aql 模板字符串构建查询；添加适当的类型注解确保类型安全
  - [ ] 实现 UserRepository：继承 BaseRepository<User>；添加 findByUsername/findByOAuthId 等特定方法；使用 @Injectable() 装饰器使其可注入
  - [ ] 实现 CardRepository：继承 BaseRepository<Card>；添加 findByCreator/findWithRelations 等特定方法；处理卡片关系查询
  - [ ] 实现 ModelRepository：继承 BaseRepository<Model>；添加 findWithInheritance 等特定方法；处理模板继承关系
  - [ ] 在服务中注入并使用仓库：将直接的数据库访问替换为仓库方法调用；使用构造函数注入仓库实例

- [ ] **1.2 统一 AQL 查询构建**
  - [ ] 使用 arangojs 提供的 `aql` 模板字符串替换原始字符串查询：将所有字符串拼接的查询替换为 aql模板；确保参数作为变量传入而非字符串拼接；使用 ${} 语法插入参数
  - [ ] 创建常用查询工具函数：实现 createPaginatedQuery 函数支持分页（包含 offset/limit）；实现 createSortedQuery 函数支持排序（包含升序/降序）；实现 createFilteredQuery 函数支持复杂过滤条件
  - [ ] 使用类型安全的查询构建：确保查询函数返回 aql.Query 类型；使用泛型参数指定返回类型；在查询函数中添加适当的类型注解

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
  - [ ] 实现验证管道：在 main.ts 中添加全局验证管道 app.useGlobalPipes(new ValidationPipe())；配置验证选项（whitelist/transform/forbidNonWhitelisted）；定制验证错误消息
  - [ ] 使用接口和类型别名：为所有实体创建接口（User/Card/Model 等）；使用类型别名简化复杂类型；使用泛型提高代码复用性

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

## 技术选型与库推荐

### 1. 数据访问层

- **arangojs-repository**：为 ArangoDB 提供仓库模式的库
  ```typescript
  // 示例：使用 arangojs-repository
  import { Repository } from 'arangojs-repository';

  export class UserRepository extends Repository<User> {
    constructor(db: Database) {
      super(db, 'users');
    }

    async findByUsername(username: string): Promise<User | null> {
      return this.findOne({ username });
    }
  }
  ```

- **arangojs 的 aql 模板字符串**：官方提供的安全查询构建方式
  ```typescript
  // 示例：使用 aql 模板字符串
  import { aql } from 'arangojs';

  const username = 'user123';
  const query = aql`
    FOR user IN users
    FILTER user.username == ${username}
    RETURN user
  `;
  const cursor = await db.query(query);
  ```

- **自定义查询工具函数**：基于 aql 模板字符串的常用查询模式
  ```typescript
  // 示例：分页查询工具函数
  export function createPaginatedQuery<T>(collection: string, filter: string, page: number, pageSize: number): aql.Query {
    const offset = (page - 1) * pageSize;
    return aql`
      FOR doc IN ${collection}
      ${filter ? aql`FILTER ${filter}` : aql``}
      LIMIT ${offset}, ${pageSize}
      RETURN doc
    `;
  }
  ```

### 2. 错误处理与日志

- **nestjs-pino**：NestJS 的 Pino 日志集成
  ```typescript
  // 示例：使用 nestjs-pino
  import { LoggerModule } from 'nestjs-pino';

  @Module({
    imports: [
      LoggerModule.forRoot({
        pinoHttp: {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true }
          }
        }
      })
    ]
  })
  export class AppModule {}
  ```

### 3. 验证与转换

- **class-validator** 和 **class-transformer**：用于验证输入数据和转换对象
  ```typescript
  // 示例：使用 class-validator
  import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

  export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    modelId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    content?: string;
  }
  ```

### 4. 配置管理

- **@nestjs/config**：NestJS 官方配置模块
  ```typescript
  // 示例：使用 @nestjs/config
  import { ConfigModule, ConfigService } from '@nestjs/config';

  @Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ['.env.local', '.env']
      })
    ]
  })
  export class AppModule {}
  ```

## 实施策略

1. **增量实施**：逐步改进，避免大规模重写
2. **先创建基础设施**：先实现基础组件，再逐步迁移现有代码
3. **保持向后兼容**：确保改进不会破坏现有功能
4. **优先解决关键问题**：先解决影响最大的问题

## 具体实施示例

### 1. 创建基础仓库类

```typescript
// repositories/base.repository.ts
import { Database, aql } from 'arangojs';

export abstract class BaseRepository<T> {
  constructor(
    protected readonly db: Database,
    protected readonly collectionName: string
  ) {}

  async findById(id: string): Promise<T | null> {
    const query = aql`
      FOR doc IN ${this.collectionName}
      FILTER doc._key == ${id}
      RETURN doc
    `;
    const cursor = await this.db.query(query);
    return cursor.hasNext() ? cursor.next() : null;
  }

  async findAll(): Promise<T[]> {
    const query = aql`
      FOR doc IN ${this.collectionName}
      RETURN doc
    `;
    const cursor = await this.db.query(query);
    return cursor.all();
  }

  async create(data: Partial<T>): Promise<T> {
    const collection = this.db.collection(this.collectionName);
    const result = await collection.save(data);
    return { ...data, _id: result._id, _key: result._key, _rev: result._rev } as T;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const collection = this.db.collection(this.collectionName);
    const result = await collection.update(id, data, { returnNew: true });
    return result.new as T;
  }

  async delete(id: string): Promise<boolean> {
    const collection = this.db.collection(this.collectionName);
    await collection.remove(id);
    return true;
  }
}
```

### 2. 实现用户仓库

```typescript
// repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { Database, aql } from 'arangojs';
import { BaseRepository } from './base.repository';
import { User } from '../interfaces/user.interface';
import { ArangoDBService } from '../services/arangodb.service';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private readonly arangoDBService: ArangoDBService) {
    super(arangoDBService.getDatabase(), 'users');
  }

  async findByUsername(username: string): Promise<User | null> {
    const query = aql`
      FOR user IN users
      FILTER user.username == ${username}
      RETURN user
    `;
    const cursor = await this.db.query(query);
    return cursor.hasNext() ? cursor.next() : null;
  }

  async findByOAuthId(provider: string, providerId: string): Promise<User | null> {
    const query = aql`
      FOR user IN users
      FILTER user.provider == ${provider} AND user.providerId == ${providerId}
      RETURN user
    `;
    const cursor = await this.db.query(query);
    return cursor.hasNext() ? cursor.next() : null;
  }
}
```

### 3. 重构用户服务

```typescript
// services/user.service.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { User } from '../interfaces/user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { AppError, NotFoundError } from '../errors/app.error';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new AppError('Username already exists', 'USER_EXISTS', 400);
    }

    // 创建用户
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepository.create({
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }
    return user;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }
}
```

### 4. 创建自定义错误类

```typescript
// errors/app.error.ts
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly data?: any
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, data?: any) {
    super(message, 'VALIDATION_ERROR', 400, data);
  }
}
```

### 5. 创建全局异常过滤器

```typescript
// filters/global-exception.filter.ts
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { AppError } from '../errors/app.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof AppError) {
      response.status(exception.statusCode).json({
        code: exception.code,
        message: exception.message,
        data: exception.data,
      });
    } else {
      // 处理其他类型的错误
      console.error('Unhandled exception:', exception);
      response.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      });
    }
  }
}
```

### 6. 集成日志系统

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // 使用 Pino 日志
  app.useLogger(app.get(Logger));

  // 全局异常过滤器
  app.useGlobalFilters(new GlobalExceptionFilter());

  // CORS 配置
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  });

  await app.listen(3030);
}
bootstrap();
```

### 7. 创建配置服务

```typescript
// services/config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get databaseUrl(): string {
    return this.configService.get<string>('ARANGO_DB_URL');
  }

  get databaseName(): string {
    return this.configService.get<string>('ARANGO_DB_NAME');
  }

  get databasePassword(): string {
    return this.configService.get<string>('ARANGO_DB_PASSWORD');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN', '24h');
  }

  get frontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  }
}
```

## 预期成果

通过实施这个改进计划，我们期望达到以下成果：

1. **更一致的代码库**：统一的数据访问模式、错误处理和日志记录
2. **更好的开发体验**：类型安全、代码自动完成和更好的错误提示
3. **更高的代码质量**：减少重复代码、更好的测试覆盖率和更少的错误
4. **更好的性能**：优化的查询和缓存策略
5. **更容易的维护**：清晰的代码组织和文档

这个计划将使 CardForest 后端更加健壮、可维护和可扩展，为未来的功能开发奠定坚实的基础。
