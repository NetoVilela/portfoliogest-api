import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('../certficates/private.key'),
    cert: fs.readFileSync('../certficates/origin.crt'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
