import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import axios from 'axios';
import { ItemDatasetInDto } from './models/item-dataset-in.dto';
import { ItemDatasetGetDto } from './models/item-dataset-get.dto';
import { SubjectInDto } from './models/subject-in.dto';
import { ItemImageAuxOutListDto } from './models/item-image-aux-out-list.dto';
import { client as WebsocketClient, Message } from 'websocket';

const FACE_SKIN_METRICS_APPLICATION_ID_V2 = '8b5b3acc-480b-4412-8d2c-ebe6ab4384d7';

interface UploadImageOptions {
    side_id?: number;
    light_id?: number;
    name?: string;
}

@Injectable()
export class HautAiService {
    private readonly baseUrl: string;
    private readonly websocketBaseUrl: string;
    constructor(
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = 'https://saas.haut.ai';
        this.websocketBaseUrl = 'wss://saas.haut.ai';
    }

    private getHeaders(accessToken?: string): Record<string, string | number | boolean> {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (accessToken) {
            headers['Authentication'] = `Bearer ${accessToken}`;
        }

        return headers;
    }

    async getAccessToken(): Promise<{ accessToken: string, userId: number }> {
        const url = `${this.baseUrl}/api/v1/login/`;
        const data = {
            username: this.configService.get('HAUT_AI_USERNAME'),
            password: this.configService.get('HAUT_AI_PASSWORD')
        };

        try {
            const response = await axios.post(url, data, { headers: this.getHeaders() });
            return {
                accessToken: response.data.token_access,
                userId: response.data.id
            };
        } catch (err) {
            console.log(err.message);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'HAUT_AI_REQUEST_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    async createDataset(accessToken: string, data: ItemDatasetInDto): Promise<ItemDatasetGetDto> {
        const url = `${this.baseUrl}/api/v1/companies/${this.configService.get('HAUT_AI_COMPANY_ID')}/datasets/`;

        try {
            const response = await axios.post(url, data, { headers: this.getHeaders(accessToken) });
            return new ItemDatasetGetDto(response.data);
        } catch (err) {
            console.log(err.message);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'HAUT_AI_REQUEST_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    async getDataset(accessToken: string, datasetId: string): Promise<ItemDatasetGetDto> {
        const url = `${this.baseUrl}/api/v1/companies/${this.configService.get('HAUT_AI_COMPANY_ID')}/datasets/${datasetId}`;

        try {
            const response = await axios.get(url, { headers: this.getHeaders(accessToken) });
            return new ItemDatasetGetDto(response.data);
        } catch (err) {
            if (err?.response?.status === HttpStatus.NOT_FOUND) {
                return null;
            }
            console.log(err.message);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'HAUT_AI_REQUEST_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    async attachFaceAppToDataset(accessToken: string, datasetId: string): Promise<void> {
        const url = `${this.baseUrl}/api/v1/companies/${this.configService.get('HAUT_AI_COMPANY_ID')}/applications/${FACE_SKIN_METRICS_APPLICATION_ID_V2}/runs/`;
        const data = { dataset_id: datasetId };

        try {
            await axios.post(url, data, { headers: this.getHeaders(accessToken) });
        } catch (err) {
            console.log(err.message);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'HAUT_AI_REQUEST_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    async createSubject(accessToken: string, datasetId: string, data: SubjectInDto): Promise<string> {
        const url = `${this.baseUrl}/api/v1/companies/${this.configService.get('HAUT_AI_COMPANY_ID')}/datasets/${datasetId}/subjects/`;

        try {
            const response = await axios.post(url, data, { headers: this.getHeaders(accessToken) });
            return response.data.id;
        } catch (err) {
            console.log(err.message);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'HAUT_AI_REQUEST_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    async createBatch(accessToken: string, datasetId: string, subjectId: string): Promise<string> {
        const url = `${this.baseUrl}/api/v1/companies/${this.configService.get('HAUT_AI_COMPANY_ID')}/datasets/${datasetId}/subjects/${subjectId}/batches/`;

        try {
            const response = await axios.post(url, {}, { headers: this.getHeaders(accessToken) });
            return response.data.id;
        } catch (err) {
            console.log(err.message);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'HAUT_AI_REQUEST_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    async uploadPhotoToBatch(accessToken: string, datasetId: string, subjectId: string, batchId: string, photo: Buffer, options: UploadImageOptions = {}): Promise<string> {
        const url = `${this.baseUrl}/api/v1/companies/${this.configService.get('HAUT_AI_COMPANY_ID')}/datasets/${datasetId}/subjects/${subjectId}/batches/${batchId}/images`;
        const data = {
            b64data: photo,
            name: options.name,
            side_id: options.side_id,
            light_id: options.light_id
        };

        try {
            const response = await axios.post(url, data, { headers: this.getHeaders(accessToken) });
            return response.data.id;
        } catch (err) {
            console.log(err.message);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'HAUT_AI_REQUEST_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    async getImageAux(accessToken: string, datasetId: string, subjectId: string, batchId: string, imageId: string): Promise<ItemImageAuxOutListDto> {
        const url = `${this.baseUrl}/api/v1/companies/${this.configService.get('HAUT_AI_COMPANY_ID')}/datasets/${datasetId}/subjects/${subjectId}/batches/${batchId}/images/${imageId}/aux/`;

        try {
            const response = await axios.get(url, { headers: this.getHeaders(accessToken) });
            return new ItemImageAuxOutListDto(response.data);
        } catch (err) {
            console.log(err.message);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'HAUT_AI_REQUEST_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    subscribeToNotifications(accessToken: string, userId: string, callback: (data: Message) => void): WebsocketClient {
        const url = `${this.websocketBaseUrl}/notifications/?user_id=${userId}`;
        const websocketClient = new WebsocketClient();

        websocketClient.on('connectFailed', (error) => {
            console.log('Connect Error: ' + error.toString());
            throw new UnprocessableEntityException({
                message: error.message,
                errorCode: 'HAUT_AI_WEBSOCKET_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        });

        websocketClient.on('connect', (connection) => {
            console.log('WebSocket Client Connected');
            connection.on('error', (error) => {
                console.log('Connection Error: ' + error.toString());
                throw new UnprocessableEntityException({
                    message: error.message,
                    errorCode: 'HAUT_AI_WEBSOCKET_ERROR',
                    statusCode: HttpStatus.UNPROCESSABLE_ENTITY
                });
            });
            connection.on('close', () => {
                console.log('Connection Closed');
            });
            connection.on('message', callback);
        });

        websocketClient.connect(url, null, null, { Cookie: `authorization=${accessToken}` });

        return websocketClient;
    }
}
