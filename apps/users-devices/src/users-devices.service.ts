import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersDevicesService {
  getHello(): string {
    return 'Hello World!';
  }
}
