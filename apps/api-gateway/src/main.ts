import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Port } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(Port.API_GATEWAY);
}
bootstrap();
