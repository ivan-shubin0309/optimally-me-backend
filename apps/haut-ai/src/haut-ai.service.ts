import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import axios from 'axios';
import { SubjectInDto } from './models/subject-in.dto';

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

    private getHeaders(accessToken: string): Record<string, string | number | boolean> {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return headers;
    }

    getAccessToken(): string {
        return this.configService.get('HAUT_AI_ACCESS_TOKEN');
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
        const url = `${this.baseUrl}/api/v1/companies/${this.configService.get('HAUT_AI_COMPANY_ID')}/datasets/${datasetId}/subjects/${subjectId}/batches/${batchId}/images/`;
        const data: any = {
            b64data: photo.toString('base64')
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

    async getImageResults(accessToken: string, datasetId: string, subjectId: string, batchId: string, imageId: string): Promise<any> {
        const url = `${this.baseUrl}/api/v1/companies/${this.configService.get('HAUT_AI_COMPANY_ID')}/datasets/${datasetId}/subjects/${subjectId}/batches/${batchId}/images/${imageId}/results/`;

        try {
            const response = await axios.get(url, { headers: this.getHeaders(accessToken) });
            return response.data;
        } catch (err) {
            console.log(err.message);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'HAUT_AI_REQUEST_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }
}
