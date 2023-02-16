import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { SessionDataDto } from '../../sessions/src/models';
import { PostDeviceTokenDto } from './models/post-device-token.dto';
import { UsersDevicesService } from './users-devices.service';

@ApiBearerAuth()
@ApiTags('users/devices')
@Controller('users/devices')
export class UsersDevicesController {
    constructor(private readonly usersDevicesService: UsersDevicesService) { }

    @ApiOperation({ summary: 'Save user device notification token' })
    @Roles(UserRoles.user)
    @Post()
    async saveNotificationToken(@Body() body: PostDeviceTokenDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
        await this.usersDevicesService.create({
            userId: req.user.userId,
            sessionId: req.user.sessionId,
            token: body.token
        });
    }
}
