import * as fs from 'fs';
import { SES } from '@aws-sdk/client-ses';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '../common/src/utils/config/config.service';
import { CommandsModule } from './commands.module';
import { EmailTemplates } from '../common/src/resources/mailer/email-templates';

const TEMPLATE_PATH = 'email-templates';
const BASE_ENCODING = 'utf8';
const BASE_SUBJECT = 'Subject';

async function syncEmailTemplate(Mailer: SES): Promise<void> {
    try {
        const emailTemplates = fs.readdirSync(TEMPLATE_PATH);

        if (emailTemplates.length) {
            for (const emailTemplate of emailTemplates) {
                const templateName = emailTemplate.split('.')[0];
                const htmlPart = fs.readFileSync(`${TEMPLATE_PATH}/${emailTemplate}`, BASE_ENCODING);
                const subjectPart = EmailTemplates[templateName.toUpperCase()] && EmailTemplates[templateName.toUpperCase()].SUBJECT || BASE_SUBJECT;

                try {
                    const existingTemplate = await Mailer.getTemplate({ TemplateName: templateName });

                    if (existingTemplate) {
                        console.log(`deleting ${templateName}`);
                        await Mailer.deleteTemplate({ TemplateName: templateName });
                    }
                } catch (e) { }

                await Mailer
                    .createTemplate({
                        Template: {
                            TemplateName: templateName,
                            SubjectPart: subjectPart,
                            HtmlPart: htmlPart,
                        }
                    });
                console.log(`${templateName} created`);
            }
        }

    } catch (err) {
        throw err;
    }

}

async function main() {
    const app = await NestFactory.create(CommandsModule);
    const configService = app.get(ConfigService);
    const Mailer = new SES({
        region: configService.get('SES_REGION'),
        credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')
        }
    });

    try {
        console.log('Start sync email template to SES');
        await syncEmailTemplate(Mailer);
        console.log('End sync email template to SES');
        process.exit(0);

    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

main();
