import { Module } from '@nestjs/common';
import { ModelService } from '../services/model.service';
import { ModelResolver } from '../graphql/model.resolver';
import { ModelController } from '../controllers/model.controller';
import { DatabaseModule } from './database.module';
import { RepositoryModule } from './repository.module';
import { AuthModule } from './auth.module';

/**
 * 模型模块，提供模型相关功能
 */
@Module({
  imports: [
    DatabaseModule,
    RepositoryModule,
    AuthModule,
  ],
  controllers: [ModelController],
  providers: [
    ModelService,
    ModelResolver,
  ],
  exports: [ModelService],
})
export class ModelModule {}
