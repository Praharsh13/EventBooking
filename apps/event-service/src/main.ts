import { NestFactory } from '@nestjs/core';
import { EventServiceModule } from './event-service.module';
import { Port } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(EventServiceModule);
  await app.listen(Port.EVENT_SERVICE);
}
bootstrap();
