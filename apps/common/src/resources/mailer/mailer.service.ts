import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../utils/config/config.service';
import { User } from '../../../../users/src/models';
import { TranslatorService } from 'nestjs-translator';
import { SendEmailCommand, SES } from '@aws-sdk/client-ses';
import { SesMessageParamsDto } from './models/ses-message-params.dto';
import { SesMessageBodyDto } from './models/ses-message-body.dto';
import { SesMessageBaseParamDto } from './models/ses-message-base-param.dto';
import { EmailTemplates } from './email-templates';

interface IEmailParams {
    readonly from?: string,
    readonly to: string[],
    readonly html?: string,
    readonly subject?: string,
    readonly text?: string,
    readonly templateName?: string,
    readonly templateData?: any,
}

@Injectable()
export class MailerService {
    private readonly SES: SES;

    constructor(
        private readonly configService: ConfigService,
        private readonly translatorService: TranslatorService
    ) {
        this.SES = new SES({
            region: this.configService.get('SES_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')
            }
        });
    }

    private async sendMail(params: IEmailParams): Promise<void> {
        const emailParams = new SesMessageParamsDto(
            params.from || this.configService.get('SES_SOURCE_EMAIL'),
            params.to,
            [],
            new SesMessageBodyDto(
                new SesMessageBaseParamDto(
                    params.html || params.text,
                    'UTF-8',
                ),
                new SesMessageBaseParamDto(),
            ),
            new SesMessageBaseParamDto(
                params.subject,
                'UTF-8',
            ),
            params.templateName || '',
            params.templateData || {}
        );

        if (params.templateName) {
            await this.SES.sendTemplatedEmail(emailParams);
        } else {
            await this.SES.sendEmail(emailParams);
        }
    }


    private async sendEmail(html: string, subject: string, sendToEmail: string): Promise<void> {

        const params = {
            Destination: {
                ToAddresses: [sendToEmail]
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
        const response = await this.SES.send(command);
        console.log('MailerService: Email sent with SES');
        console.log(JSON.stringify(response));
    }

    async sendRestorePasswordEmail(user: User, token: string): Promise<void> {

        return this.sendEmail(
            this.translatorService.translate('RESTORE_PASSWORD_EMAIL_TEXT', {
                replace: {
                    link: `${this.configService.get('ADMIN_FRONTEND_BASE_URL')}/auth/restore-password?code=${token}`,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            }),
            this.translatorService.translate('RESTORE_PASSWORD_EMAIL_SUBJECT'),
            user.email
        );
    }

    async sendUserRestorePasswordEmail(user: User, link: string): Promise<void> {

        return this.sendEmail(
            this.translatorService.translate('USER_RESTORE_PASSWORD_EMAIL_TEXT', {
                replace: {
                    link,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            }),
            this.translatorService.translate('USER_RESTORE_PASSWORD_EMAIL_SUBJECT'),
            user.email
        );
    }

    async sendUserVerificationEmail(user: User, token: string, queryString?: string): Promise<void> {
        let link = `${this.configService.get('FRONTEND_BASE_URL')}/verify-email?token=${token}`;

        if (queryString) {
            link = `${link}&${queryString}`;
        }

        return this.sendMail(
            {
                to: [user.email],
                templateData: {
                    title: this.translatorService.translate('USER_EMAIL_VERIFICATION_SUBJECT'),
                    body: this.translatorService.translate('USER_EMAIL_VERIFICATION_TEXT', {
                        replace: { link }
                    }),
                    subject: this.translatorService.translate('USER_EMAIL_VERIFICATION_SUBJECT')
                },
                templateName: EmailTemplates.BASE_EMAIL_TEMPLATE.NAME,
            }
        );
    }

    async sendAdminSampleIdError(user: User, options: { sampleId: string, resultAt: string, labName: string, customerId: number | string, rawFile: string }): Promise<void> {
        const link = `${this.configService.get('ADMIN_FRONTEND_BASE_URL')}/app/customer-results`;

        return this.sendEmail(
            this.translatorService.translate('ADMIN_EMAIL_SAMPLE_ID_ERROR_BODY', {
                replace:
                {
                    sampleId: options.sampleId, 
                    resultAt: options.resultAt,
                    labName: options.labName,
                    customerId: options.customerId.toString(),
                    rawFile: options.rawFile,
                    link
                }
            }),
            this.translatorService.translate('ADMIN_EMAIL_SAMPLE_ID_ERROR_SUBJECT', {
                replace: { sampleId: options.sampleId, resultAt: options.resultAt }
            }),
            user.email
        );
    }
}