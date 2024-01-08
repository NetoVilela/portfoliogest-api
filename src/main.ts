import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {
  const env = process.env.NODE_ENV;

  const httpsOptions = {
    ...(env === 'prod' && {
      key: fs.readFileSync('./certificates/private.key'),
      cert: fs.readFileSync('./certificates/origin.crt'),
    }),
  };

  const app = await NestFactory.create(AppModule, {
    ...(env === 'prod' && { httpsOptions }),
  });

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
