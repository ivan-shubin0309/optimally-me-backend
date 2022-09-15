import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../utils/config/config.service';
import { User } from '../../../../users/src/models';
import { TranslatorService } from 'nestjs-translator';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';


@Injectable()
export class MailerService {

    private readonly SESClient;

    constructor(
        private readonly configService: ConfigService,
        private readonly translatorService: TranslatorService
    ) {
        this.SESClient = new SESClient({ region: this.configService.get('SES_REGION') });
    }

    private getEmailTo(email: string) {
        return this.configService.get('SES_ENV') === 'prod'
            ? email
            : this.configService.get('SES_SENDER_EMAIL');
    }

    private async sendEmail(html: string, subject: string, sendToEmail: string): Promise<void> {
        const emailTo = this.getEmailTo(sendToEmail);

        const params = {
            Destination: {
                ToAddresses: [emailTo]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: html
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                }
            },
            Source: this.configService.get('SES_SOURCE_EMAIL'),
        };

        const command = new SendEmailCommand(params);
        const response = await this.SESClient.send(command);
        console.log('MailerService: Email sent with SES');
        console.log(JSON.stringify(response));
    }

    async sendRestorePasswordEmail(user: User, token: string): Promise<void> {

        return this.sendEmail(
            this.translatorService.translate('RESTORE_PASSWORD_EMAIL_TEXT', {
                replace: {
                    link: `${this.configService.get('ADMIN_FRONTEND_BASE_URL')}/restore-password?code=${token}`,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            }),
            this.translatorService.translate('RESTORE_PASSWORD_EMAIL_SUBJECT'),
            user.email
        );
    }
}