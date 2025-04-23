import { Module } from '@nestjs/common';
import { InstallService } from '../services/install.service';
import { UserModule } from './user.module';
import { DatabaseModule } from './database.module';
import { RepositoryModule } from './repository.module';
import { CardModule } from './card.module';
import { ModelModule } from './model.module';
import { InstallController } from '../controllers/install.controller';

/**
 * 安装模块，提供系统初始化功能
 */
@Module({
  imports: [
    UserModule,
    DatabaseModule,
    RepositoryModule,
    CardModule,
    ModelModule,
  ],
  controllers: [InstallController],
  providers: [
    InstallService,
  ],
  exports: [InstallService],
})
export class InstallModule {}
