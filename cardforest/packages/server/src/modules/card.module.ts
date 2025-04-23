import { Module } from '@nestjs/common';
import { CardService } from '../services/card.service';
import { CardResolver } from '../graphql/card.resolver';
import { CardController } from '../controllers/card.controller';
import { DatabaseModule } from './database.module';
import { RepositoryModule } from './repository.module';
import { ModelModule } from './model.module';
import { AuthModule } from './auth.module';

/**
 * 卡片模块，提供卡片相关功能
 */
@Module({
  imports: [DatabaseModule, RepositoryModule, ModelModule, AuthModule],
  controllers: [CardController],
  providers: [CardService, CardResolver],
  exports: [CardService],
})
export class CardModule {}
