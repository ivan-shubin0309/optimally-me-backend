import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'apps/common/src/resources/common/role.decorator';
import { UserRoles } from 'apps/common/src/resources/users';
import { UsersDevicesService } from './users-devices.service';

@Controller()
export class UsersDevicesController {
  constructor(private readonly usersDevicesService: UsersDevicesService) {}

  @ApiResponse({ type: () =>  })
  @ApiOperation({ summary: 'Get list of user biomarkers' })
  @Roles(UserRoles.user)
  @Post()
  async saveNotificationToken(): Promise<void> {
  }
}
