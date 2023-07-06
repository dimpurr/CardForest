import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArangoDBService } from './services/arangodb.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   typePaths: ['./**/*.graphql'],
    //   definitions: {
    //     path: join(process.cwd(), 'src/graphql.ts'),
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService, ArangoDBService],
})
export class AppModule {}
