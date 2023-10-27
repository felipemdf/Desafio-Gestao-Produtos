import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors({
    origin: ['http://localhost:4200', '*'],
    allowedHeaders: ['Content-Type', 'Accept'],
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  });

  app.use(json({ limit: '50MB' }));
  await app.listen(3000);
}
bootstrap();
