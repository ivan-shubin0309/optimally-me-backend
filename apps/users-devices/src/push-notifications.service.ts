import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import * as firebaseAdmin from 'firebase-admin';
import { messaging } from 'firebase-admin';
import { UserDevice } from './models/user-device.entity';

export interface INotificationBody {
    title: string,
    body: string,
    type: number
}

@Injectable()
export class PushNotificationsService {
    readonly messagingInstance: messaging.Messaging;

    constructor(
        readonly configService: ConfigService
    ) {
        this.messagingInstance = firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert({
                projectId: configService.get('FIREBASE_PROJECT_ID'),
                clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
                privateKey: configService.get('FIREBASE_PRIVATE_KEY')
            })
        }).messaging();

    }

    async sendPushNotification(userDevices: UserDevice | UserDevice[], notification: INotificationBody): Promise<void> {
        let sendResult, toUserDevices: UserDevice[];

        if (!Array.isArray(userDevices)) {
            toUserDevices = [userDevices];
        } else {
            toUserDevices = userDevices;
        }

        const notificationPayload = {
            tokens: toUserDevices.map(userDevice => userDevice.token),
            notification: { title: notification.title, body: notification.body },
            data: {
                type: `${notification.type}`
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default'
                    }
                },
            },
        };

        try {
            sendResult = await this.messagingInstance.sendMulticast(notificationPayload);

            console.log('Push-notification was successfully delivered.');
        } catch (e) {
            console.log(e.message);
        }

        console.log(`Result: ${JSON.stringify(sendResult)}`);
        console.log(`Tokens: ${toUserDevices.map(userDevice => userDevice.token)}`);
        console.log(`Notification: ${JSON.stringify(notificationPayload)}`);
    }
}
