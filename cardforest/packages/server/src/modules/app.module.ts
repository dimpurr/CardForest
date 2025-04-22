import { Module } from '@nestjs/common';
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
import { CardController } from 'src/controllers/card.controller';
import { AuthController } from '../controllers/auth.controller';
import { InstallController } from '../controllers/install.controller';
import { ModelController } from '../controllers/model.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
        console.log('GraphQL Context - Headers:', req.headers);
        console.log('GraphQL Context - Cookies:', req.cookies);
        return { req, res };
      },
      formatError: (error: any) => {
        console.error('GraphQL Error:', error);
        
        interface OriginalError {
          message?: string;
          code?: string;
        }

        interface ErrorExtensions {
          originalError?: OriginalError;
          code?: string;
        }

        const extensions = error.extensions as ErrorExtensions | undefined;
        const originalError = extensions?.originalError;
        
        // 处理 extensions 中的错误信息
        if (originalError) {
          return {
            message: originalError.message ?? error.message,
            code: originalError.code ?? extensions?.code ?? 'INTERNAL_SERVER_ERROR',
            locations: error.locations,
            path: error.path,
          };
        }
        
        // 返回原始错误
        return {
          message: error.message,
          code: extensions?.code ?? 'INTERNAL_SERVER_ERROR',
          locations: error.locations,
          path: error.path,
        };
      },
    }),
    UserModule,
    DatabaseModule,
    AuthModule,
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
  ],
})
export class AppModule {}
