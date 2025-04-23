import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './modules/app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  // 创建应用实例，启用日志缓冲
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // 使用 Pino Logger 作为全局日志器
  app.useLogger(app.get(Logger));

  // 注册全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 配置 CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
  });

  // 使用 cookie-parser 中间件
  app.use(cookieParser());

  // 启动应用
  const port = process.env.PORT || 3030;
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
