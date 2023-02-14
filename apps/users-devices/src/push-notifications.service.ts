import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import * as firebaseAdmin from 'firebase-admin';
import { messaging } from 'firebase-admin';

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

    async pushNotification() {
        let toUserDevices = userDevices, sendResult;

        if (!Array.isArray(userDevices)) {
            toUserDevices = [userDevices];
        }

        const notificationPayload = {
            tokens: toUserDevices.map(userDevice => userDevice.deviceToken),
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

        if (notification.premiumArticleId) {
            notificationPayload.data.premiumArticleId = notification.premiumArticleId.toString();
        }

        try {
            sendResult = await this.messagingInstance.sendMulticast(notificationPayload);

            const notificationLogs = userDevices.map(userDevice => ({
                recipientId: userDevice.userId,
                token: userDevice.deviceToken,
                title: notification.title,
                body: notification.body,
                type: notification.type
            }));

            await this.PushNotificationLog.bulkCreate(notificationLogs);

            this.pushNotificationLogger.info('Push-notification was successfully delivered.');
        } catch (e) {
            this.pushNotificationLogger.error(e);
        }
    }
}
