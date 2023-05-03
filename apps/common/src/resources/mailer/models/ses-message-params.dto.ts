import { SesMessageBaseParamDto } from './ses-message-base-param.dto';
import { SesMessageBodyDto } from './ses-message-body.dto';

export class SesMessageParamsDto {
    constructor(fromEmail: string, toEmails: string[], ccEmails: string[], body: SesMessageBodyDto, subject: SesMessageBaseParamDto, templateName: string, templateData: any) {
        this.Destination = {
            ToAddresses: [...toEmails],
            CcAddresses: [...ccEmails]
        };

        if (templateName) {
            this.Template = templateName;
            this.TemplateData = JSON.stringify(templateData);
        } else {
            this.Message = {
                Body: body,
                Subject: subject,
            };
        }

        this.Source = fromEmail;
    }

    readonly Destination: { ToAddresses: string[], CcAddresses: string[] };

    readonly Template: string;

    readonly TemplateData: string;

    readonly Message: { Body: SesMessageBodyDto, Subject: SesMessageBaseParamDto };

    readonly Source: string;
}
