import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
// import { ArangoDBService } from './services/arangodb.service';
import { InstallService } from '../services/install.service';
import { CardService } from '../services/card.service';
import { UserService } from '../services/user.service';
import { CardResolver } from '../graphql/card.resolver';
import { UserResolver } from '../graphql/user.resolver';
import { AuthModule } from './auth.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
    AuthModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // ArangoDBService,
    InstallService,
    CardService,
    UserService,
    CardResolver,
    UserResolver,
  ],
})
export class AppModule {}
