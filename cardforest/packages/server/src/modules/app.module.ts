import { Module, Logger } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ArangoDBService } from '../services/arangodb.service';
import { UserResolver } from '../graphql/user.resolver';
import { ModelResolver } from '../graphql/model.resolver';
import { AuthResolver } from '../graphql/auth.resolver';
import { DatabaseModule } from './database.module';
import { RepositoryModule } from './repository.module';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { InstallModule } from './install.module';
import { CardModule } from './card.module';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoggerModule } from './logger.module';
import { ModelController } from '../controllers/model.controller';
import { GraphqlExceptionFilter } from '../common/filters/graphql-exception.filter';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 日志模块
    LoggerModule,

    // GraphQL 模块
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql/graphql.ts'),
      },
      playground: {
        settings: {
          'request.credentials': 'include', // 允许发送 cookies
        },
      },
      context: ({ req, res }) => {
        // 使用结构化日志记录请求信息
        const logger = new Logger('GraphQLContext');
        logger.debug('GraphQL Context', {
          headers: req.headers,
          cookies: req.cookies,
          user: req.user,
        });
        return { req, res };
      },
      // 使用自定义的 GraphQL 异常过滤器
      formatError: (error) => {
        const filter = new GraphqlExceptionFilter();
        return filter.formatError(error as any);
      },
    }),

    // 功能模块
    UserModule,
    DatabaseModule,
    AuthModule,
    RepositoryModule,
    InstallModule,
    CardModule,
  ],
  controllers: [AppController, ModelController],
  providers: [
    AppService,
    ArangoDBService,
    // InstallService 已在 InstallModule 中提供
    // CardService 已在 CardModule 中提供
    // UserService 已在 UserModule 中提供
    // AuthService 已在 AuthModule 中提供
    // ModelService 已在 CardModule 中提供
    // CardResolver 已在 CardModule 中提供
    UserResolver,
    ModelResolver,
    AuthResolver,
    // 全局 JWT 认证守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
