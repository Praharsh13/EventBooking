import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { KafkaModule } from '@app/kafka';
import { DatabaseModule } from '@app/database';
import {PassportModule} from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategies';

@Module({
  imports: [
    KafkaModule.register('auth-service-group'),
    DatabaseModule,
    PassportModule,
    //This module will help make the signing of JWT token 
    JwtModule.register({
      secret:'secret',
      signOptions:{expiresIn:'1d'}
    })
],
  controllers: [AuthServiceController],
  providers: [AuthServiceService,JwtStrategy],
})
export class AuthServiceModule {}
