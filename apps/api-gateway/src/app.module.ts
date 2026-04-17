import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsService } from './events/events.service';
import { EventsController } from './events/events.controller';
import { EventsModule } from './events/events.module';
import { JwtStrategy } from './jwt.startegy';

@Module({
  imports: [AuthModule, EventsModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
