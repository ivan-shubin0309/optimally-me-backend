import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import axios from 'axios';
import { DateTime } from 'luxon';

export interface IKlaviyoCreateProfile {
    type: 'profile',
    attributes: {
        email?: string,
        phone_number?: string,
        external_id?: string,
        first_name?: string,
        last_name?: string,
        organization?: string,
        title?: string,
        image?: string,
        location?: {
            address1?: string,
            address2?: string,
            city?: string,
            country?: string,
            region?: string,
            zip?: string,
            timezone?: string
        },
        properties?: { [key: string]: string | boolean | null }
    }
}

const KLAVIYO_BASE_URL = 'https://a.klaviyo.com/api';
const REVISION = '2023-02-22';

@Injectable()
export class KlaviyoService {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    private getHeaders(): Record<string, string | number | boolean> {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Klaviyo-API-Key ${this.configService.get('KLAVIYO_API_KEY')}`,
            'revision': REVISION
        };

        return headers;
    }

    async createProfile(data: IKlaviyoCreateProfile): Promise<IKlaviyoCreateProfile & { id: string, [key: string]: any }> {
        const url = `${KLAVIYO_BASE_URL}/profiles/`;
        const body = { data };

        try {
            const response = await axios.post(url, body, { headers: this.getHeaders() });
            return response.data;
        } catch (err) {
            console.log(err.message);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'KLAVIYO_CREATE_PROFILE_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    async patchProfile(data: IKlaviyoCreateProfile, profileId: string): Promise<IKlaviyoCreateProfile & { id: string, [key: string]: any }> {
        const url = `${KLAVIYO_BASE_URL}/profiles/${profileId}/`;
        const body = {
            data: {
                ...data,
                id: profileId
            }
        };

        try {
            const response = await axios.patch(url, body, { headers: this.getHeaders() });
            return response.data;
        } catch (err) {
            console.log(err.message);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'KLAVIYO_CREATE_PROFILE_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    async getProfile(email: string): Promise<IKlaviyoCreateProfile & { id: string, [key: string]: any }> {
        const url = `${KLAVIYO_BASE_URL}/profiles/?filter=equals(email,"${email}")&page[size]=1`;

        try {
            const response = await axios.get(url, { headers: this.getHeaders() });

            return response.data.length ? response.data[0] : null;
        } catch (err) {
            console.log(err.message);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'KLAVIYO_GET_PROFILE_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    async createEvent(email: string, eventName: string, source: string): Promise<void> {
        const url = `${KLAVIYO_BASE_URL}/events/`;
        const body = {
            data: {
                type: 'event',
                attributes: {
                    profile: { email },
                    metric: {
                        name: eventName
                    },
                    properties: {
                        Source: source,
                        Date_Created: DateTime.utc().toFormat('yyyy-MM-dd')
                    },
                    time: DateTime.utc().toISO()
                }
            }
        };

        try {
            await axios.post(url, body, { headers: this.getHeaders() });
        } catch (err) {
            console.log(err.message);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'KLAVIYO_CREATE_EVENT_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }
}
