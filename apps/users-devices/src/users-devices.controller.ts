import { Body, Controller, Headers, HttpStatus, Post, Request, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/src/resources/common/public.decorator';
import { PushNotificationTypes } from '../../common/src/resources/push-notifications/push-notification-types';
import { TranslatorService } from 'nestjs-translator';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { SessionDataDto } from '../../sessions/src/models';
import { PostDeviceTokenDto } from './models/post-device-token.dto';
import { INotificationBody, PushNotificationsService } from './push-notifications.service';
import { UsersDevicesService } from './users-devices.service';
import { JwtService } from '@nestjs/jwt';

@ApiBearerAuth()
@ApiTags('users/devices')
@Controller('users/devices')
export class UsersDevicesController {
    constructor(
        private readonly usersDevicesService: UsersDevicesService,
        private readonly translator: TranslatorService,
        private readonly pushNotificationsService: PushNotificationsService,
        private readonly jwtService: JwtService,
    ) { }

    @ApiOperation({ summary: 'Save user device notification token' })
    @Roles(UserRoles.user)
    @Post()
    async saveNotificationToken(@Body() body: PostDeviceTokenDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
        const userDevice = await this.usersDevicesService.getOne([
            { method: ['byUserId', req.user.userId] },
            { method: ['byToken', body.token] }
        ]);

        if (userDevice) {
            userDevice.update({
                sessionId: req.user.sessionId,
                token: body.token
            });
        } else {
            await this.usersDevicesService.create({
                userId: req.user.userId,
                sessionId: req.user.sessionId,
                token: body.token
            });
        }
    }

    @Public()
    @ApiOperation({ summary: 'Send data sync notifications' })
    @Post('notifications/data-sync')
    async sendDataSyncPushNotifications(@Headers('Authorization') authHeader): Promise<void> {
        const token = authHeader && authHeader.split(' ')[1];

        const decodedToken: any = this.jwtService.decode(token);

        if (!decodedToken || !decodedToken.isWebhook) {
            throw new UnauthorizedException({
                message: this.translator.translate('WRONG_CREDENTIALS'),
                errorCode: 'WRONG_CREDENTIALS',
                statusCode: HttpStatus.UNAUTHORIZED
            });
        }

        const scopes: any[] = ['withConnectedSDK'];
        const limit = 1000;
        const userDevicesCount = await this.usersDevicesService.getCount(scopes);
        const iterations = Math.ceil(userDevicesCount / limit);

        const notificationBody: INotificationBody = {
            title: this.translator.translate('DATA_SYNC_NOTIFICATION_TITLE'),
            body: this.translator.translate('DATA_SYNC_NOTIFICATION_BODY'),
            type: PushNotificationTypes.datasync
        };

        for (let i = 0; i < iterations; i++) {
            const devicesList = await this.usersDevicesService.getList(scopes.concat([{ method: ['pagination', { limit: limit, offset: i * limit }] }]));
            await this.pushNotificationsService.sendPushNotification(devicesList, notificationBody);
        }
    }
}
