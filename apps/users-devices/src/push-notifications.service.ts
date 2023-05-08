import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import * as firebaseAdmin from 'firebase-admin';
import { messaging } from 'firebase-admin';
import * as uuid from 'uuid';

export interface INotificationBody {
    title: string,
    body: string,
    type: number,
    data?: any,
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
        }, uuid.v4()).messaging();
    }

    async sendPushNotification(tokens: string[] | string, notification: INotificationBody): Promise<void> {
        let sendResult, deviceTokens: string[];

        if (!Array.isArray(tokens)) {
            deviceTokens = [tokens];
        } else {
            deviceTokens = tokens;
        }

        const notificationPayload = {
            tokens: deviceTokens,
            notification: { title: notification.title, body: notification.body },
            data: {
                type: `${notification.type}`,
                ...notification.data
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
        console.log(`Tokens: ${deviceTokens.join(', ')}`);
        console.log(`Notification: ${JSON.stringify(notificationPayload)}`);
    }
}
