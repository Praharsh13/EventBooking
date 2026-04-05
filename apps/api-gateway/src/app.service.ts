import { Injectable } from '@nestjs/common';
import { Port, Service } from '@app/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `${Service.API_GATEWAY} is running on Port ${Port.API_GATEWAY}`;
  }
}
