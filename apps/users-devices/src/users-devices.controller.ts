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
import { UsersVerifiedDevicesService } from '../../additional-authentications/src/users-verified-devices.service';

@ApiBearerAuth()
@ApiTags('users/devices')
@Controller('users/devices')
export class UsersDevicesController {
    constructor(
        private readonly usersDevicesService: UsersDevicesService,
        private readonly translator: TranslatorService,
        private readonly pushNotificationsService: PushNotificationsService,
        private readonly jwtService: JwtService,
        private readonly usersVerifiedDevicesService: UsersVerifiedDevicesService,
    ) { }

    @ApiOperation({ summary: 'Save user device notification token' })
    @Roles(UserRoles.user)
    @Post()
    async saveNotificationToken(@Body() body: PostDeviceTokenDto, @Request() req: Request & { user: SessionDataDto & { [key: string]: any } }): Promise<void> {
        const userMfaDevice = await this.usersVerifiedDevicesService.getOne([
            { method: ['byIsMfaDevice', true] },
            { method: ['byUserId', req.user.userId] }
        ]);

        const userDevice = await this.usersDevicesService.getOne([
            { method: ['byUserId', req.user.userId] },
            { method: ['byToken', body.token] }
        ]);

        const userVerifiedDevice = await this.usersVerifiedDevicesService.getOne([
            { method: ['byDeviceId', req.user.deviceId] },
            { method: ['byUserId', req.user.userId] }
        ]);


        if (userMfaDevice) {
            await userMfaDevice.update({ deviceToken: null, isMfaDevice: false });
        }

        if (userVerifiedDevice) {
            await userVerifiedDevice.update({ deviceToken: body.token, isMfaDevice: true });
        }

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
            await this.pushNotificationsService.sendPushNotification(devicesList.map(device => device.token), notificationBody);
        }
    }
}
