import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import * as ClientSftp from 'ssh2-sftp-client';
import * as https from 'https';
import { Readable } from 'stream';

const HL7_BASE_REQUEST_PATH = './HL7/HL7 Requests';
const FILE_PREFIX = 'OPME';

@Injectable()
export class Hl7FtpService {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    private async getFtpClient(): Promise<ClientSftp> {
        const client = new ClientSftp();
        await client
            .connect({
                host: this.configService.get('HL7_FTP_HOST'),
                port: this.configService.get('HL7_FTP_PORT'),
                username: this.configService.get('HL7_FTP_USERNAME'),
                password: this.configService.get('HL7_FTP_PASSWORD'),
            })
            .catch(err => {
                console.log(err.message);
                throw new UnprocessableEntityException({
                    message: err.message,
                    errorCode: 'HL7_FTP_CONNECTION_ERROR',
                    statusCode: HttpStatus.UNPROCESSABLE_ENTITY
                });
            });
        return client;
    }

    async uploadFileToFileServer(source: string, fileName: string): Promise<void> {
        const fileStream = await new Promise<Readable>((resolve, reject) => {
            https.get(source, (stream) => {
                resolve(stream);
            });
        });

        const client = await this.getFtpClient();

        await client
            .put(fileStream, `${HL7_BASE_REQUEST_PATH}/${FILE_PREFIX}-${fileName}.hl7`)
            .catch(err => {
                console.log(err.message);
                throw new UnprocessableEntityException({
                    message: err.message,
                    errorCode: 'HL7_FTP_UPLOAD_ERROR',
                    statusCode: HttpStatus.UNPROCESSABLE_ENTITY
                });
            });
    }
}
