import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configSerivce = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const corsWhitelist = [
    configSerivce.get('CLIENT_URL'),
    'http://localhost:3000/',
  ];

  app.enableCors({
    credentials: true,
    origin: corsWhitelist,
  });

  await app.listen(3333);
}
bootstrap();
