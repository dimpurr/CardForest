import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 配置 CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
  });
  
  app.use(cookieParser());
  await app.listen(3030);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
