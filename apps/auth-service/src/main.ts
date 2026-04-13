import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

  //Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
