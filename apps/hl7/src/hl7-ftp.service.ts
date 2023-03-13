import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import * as ftp from 'basic-ftp';

const HL7_BASE_REQUEST_PATH = 'HL7/HL7 Requests';

@Injectable()
export class Hl7FtpService {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    private async getFtpClient(): Promise<ftp.Client> {
        const client = new ftp.Client();
        client.ftp.verbose = true;
        try {
            await client.access({
                host: this.configService.get('HL7_FTP_HOST'),
                user: this.configService.get('HL7_FTP_USERNAME'),
                password: this.configService.get('HL7_FTP_PASSWORD'),
                secure: true
            });
        } catch (err) {
            console.log(err);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'HL7_FTP_CONNECTION_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
        return client;
    }

    async uploadFileToFileServer(source: string, fileName: string): Promise<void> {
        const client = await this.getFtpClient();

        await client
            .uploadFrom(source, `${HL7_BASE_REQUEST_PATH}/${fileName}.hl7`)
            .catch(err => {
                console.log(err);
                throw new UnprocessableEntityException({
                    message: err.message,
                    errorCode: 'HL7_FTP_UPLOAD_ERROR',
                    statusCode: HttpStatus.UNPROCESSABLE_ENTITY
                });
            });
    }
}
