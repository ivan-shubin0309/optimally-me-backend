import { SesMessageBaseParamDto } from './ses-message-base-param.dto';

export class SesMessageBodyDto {
    constructor(html, text) {
        this.Html = html;
        this.Text = text;
    }

    readonly Html: SesMessageBaseParamDto;
    readonly Text: SesMessageBaseParamDto;
}