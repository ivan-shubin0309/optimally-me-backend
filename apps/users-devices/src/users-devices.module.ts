import { Module } from '@nestjs/common';
import { UsersDevicesController } from './users-devices.controller';
import { UsersDevicesService } from './users-devices.service';

@Module({
  imports: [],
  controllers: [UsersDevicesController],
  providers: [UsersDevicesService],
})
export class UsersDevicesModule {}
