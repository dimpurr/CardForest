import { Module, APP_GUARD } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ArangoDBService } from '../services/arangodb.service';
import { InstallService } from '../services/install.service';
import { CardService } from '../services/card.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ModelService } from '../services/model.service';
import { CardResolver } from '../graphql/card.resolver';
import { UserResolver } from '../graphql/user.resolver';
import { ModelResolver } from '../graphql/model.resolver';
import { AuthResolver } from '../graphql/auth.resolver';
import { DatabaseModule } from './database.module';
import { RepositoryModule } from './repository.module';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoggerModule } from './logger.module';
import { CardController } from 'src/controllers/card.controller';
import { AuthController } from '../controllers/auth.controller';
import { InstallController } from '../controllers/install.controller';
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
        const logger = new GraphqlExceptionFilter().logger;
        logger.debug('GraphQL Context', {
          headers: req.headers,
          cookies: req.cookies,
          user: req.user,
        });
        return { req, res };
      },
      // 使用自定义的 GraphQL 异常过滤器
      formatError: (error) => {
        return new GraphqlExceptionFilter().formatError(error);
      },
    }),

    // 功能模块
    UserModule,
    DatabaseModule,
    AuthModule,
    RepositoryModule,
  ],
  controllers: [AppController, CardController, AuthController, InstallController, ModelController],
  providers: [
    AppService,
    ArangoDBService,
    InstallService,
    CardService,
    UserService,
    AuthService,
    ModelService,
    CardResolver,
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
