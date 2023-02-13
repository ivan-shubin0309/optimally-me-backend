import { Controller, Get } from '@nestjs/common';
import { UsersDevicesService } from './users-devices.service';

@Controller()
export class UsersDevicesController {
  constructor(private readonly usersDevicesService: UsersDevicesService) {}

  @Get()
  getHello(): string {
    return this.usersDevicesService.getHello();
  }
}
