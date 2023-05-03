export class SesMessageBaseParamDto {
    constructor(data?: string, charset = 'UTF-8') {
        this.Charset = charset;
        this.Data = data;
    }

    readonly Charset: string;
    readonly Data: string;
}
