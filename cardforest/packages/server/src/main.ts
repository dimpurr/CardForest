import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(3030);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
