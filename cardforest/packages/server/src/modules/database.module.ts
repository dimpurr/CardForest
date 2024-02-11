// database.module.ts
import { Module } from '@nestjs/common';
import { ArangoDBService } from '../services/arangodb.service';
// import { ConfigModule } from '@nestjs/config';

@Module({
  //   imports: [ConfigModule],
  providers: [ArangoDBService],
  exports: [ArangoDBService], // 导出 ArangoDBService 以便其他模块使用
})
export class DatabaseModule {}
