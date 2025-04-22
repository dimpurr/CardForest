import { Module } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CardRepository } from '../repositories/card.repository';
import { ModelRepository } from '../repositories/model.repository';
import { ArangoDBService } from '../services/arangodb.service';

/**
 * 仓库模块，提供所有仓库的注册
 */
@Module({
  providers: [
    ArangoDBService,
    UserRepository,
    CardRepository,
    ModelRepository,
  ],
  exports: [
    UserRepository,
    CardRepository,
    ModelRepository,
  ],
})
export class RepositoryModule {}
