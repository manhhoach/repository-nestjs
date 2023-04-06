import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {HttpExceptionFilter} from './exceptions/http.exception.filter'

import * as dotenv from 'dotenv';
dotenv.config({path: `.env.${process.env.NODE_ENV}`})

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true })
  )
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(3000);
}
bootstrap();
