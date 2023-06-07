import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import axios from 'axios';
import { DateTime } from 'luxon';
import { KlaviyoEventTypes } from '../../common/src/resources/klaviyo/klaviyo-event-types';

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

export interface IKitActivatedEventProperties {
    sampleId: string,
    testName: string,
    isFemaleCycleStatusRequired: boolean,
    femaleCycleStatus: string,
    labProfileId: string,
    expiryDate: string,
    activationDate: string,
}

export interface ISampleReceivedEventProperties {
    sampleId: string,
    testName: string,
    labProfileId: string,
    receivedDate: string,
    activationDate: string,
}

interface IResultsReadyEventProperties {
    sampleId: string,
    testName: string,
    labProfileId: string,
    activationDate: string,
    resultsDate: string,
    isResultsFailed: boolean,
    resultsFailedReasons: string[],
    isCriticalResults: boolean,
    criticalResults: string[],
}

interface IBadResultsEventProperties {
    sampleId: string,
    testName: string,
    labProfileId: string,
    activationDate: string,
    resultsDate: string,
    badResults: { biomarkerName: string, range: string }[]
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

            console.log(JSON.stringify(response.data));

            return response.data.data;
        } catch (err) {
            let message = err.message;
            console.log(err.message);
            if (err?.response?.data?.errors) {
                console.log(JSON.stringify(err.response.data.errors));
                message = err.response.data.errors
                    .map(error => error.detail)
                    .join('. ');
            }
            throw new UnprocessableEntityException({
                message: message,
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
            console.log(JSON.stringify(response.data));
            return response.data.data;
        } catch (err) {
            let message = err.message;
            console.log(err.message);
            if (err?.response?.data?.errors) {
                console.log(JSON.stringify(err.response.data.errors));
                message = err.response.data.errors
                    .map(error => error.detail)
                    .join('. ');
            }
            throw new UnprocessableEntityException({
                message: message,
                errorCode: 'KLAVIYO_CREATE_PROFILE_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    async getProfile(email: string): Promise<IKlaviyoCreateProfile & { id: string, [key: string]: any }> {
        const url = `${KLAVIYO_BASE_URL}/profiles/?filter=equals(email,${encodeURIComponent(`"${email}"`)})&page[size]=1`;

        try {
            const response = await axios.get(url, { headers: this.getHeaders() });

            console.log(JSON.stringify(response.data));

            return response.data?.data?.length ? response.data.data[0] : null;
        } catch (err) {
            let message = err.message;
            console.log(err.message);
            if (err?.response?.data?.errors) {
                console.log(JSON.stringify(err.response.data.errors));
                message = err.response.data.errors
                    .map(error => error.detail)
                    .join('. ');
            }
            throw new UnprocessableEntityException({
                message: message,
                errorCode: 'KLAVIYO_GET_PROFILE_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    async createEvent(email: string, eventName: string, properties: { [key: string]: any | any[] }): Promise<void> {
        const url = `${KLAVIYO_BASE_URL}/events/`;
        const body = {
            data: {
                type: 'event',
                attributes: {
                    profile: { email },
                    metric: {
                        name: eventName
                    },
                    properties,
                    time: DateTime.utc().toISO()
                }
            }
        };

        try {
            await axios.post(url, body, { headers: this.getHeaders() });
        } catch (err) {
            let message = err.message;
            console.log(err.message);
            if (err?.response?.data?.errors) {
                console.log(JSON.stringify(err.response.data.errors));
                message = err.response.data.errors
                    .map(error => error.detail)
                    .join('. ');
            }
            throw new UnprocessableEntityException({
                message: message,
                errorCode: 'KLAVIYO_CREATE_EVENT_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    createAccountEvent(email: string, source: string): Promise<void> {
        return this.createEvent(
            email,
            KlaviyoEventTypes.accountCreated,
            {
                Source: source,
                Date_Created: DateTime.utc().toFormat('yyyy-MM-dd')
            }
        );
    }

    testKitActivatedEvent(email: string, properties: IKitActivatedEventProperties): Promise<void> {
        return this.createEvent(
            email,
            KlaviyoEventTypes.kitActivated,
            {
                Sample_Id: properties.sampleId,
                Test_Name: properties.testName,
                Test_Category: 'Blood',
                Requires_Female_Cycle_Status: properties.isFemaleCycleStatusRequired,
                Female_Cycle_Status: properties.femaleCycleStatus,
                Lab_Profile_Id: properties.labProfileId,
                Expiry_Date: properties.expiryDate,
                Activation_Date: properties.activationDate
            },
        );
    }

    sampleReceivedEvent(email: string, properties: ISampleReceivedEventProperties): Promise<void> {
        return this.createEvent(
            email,
            KlaviyoEventTypes.sampleReceived,
            {
                Sample_Id: properties.sampleId,
                Test_Name: properties.testName,
                Test_Category: 'Blood',
                Lab_Profile_Id: properties.labProfileId,
                Received_Date: properties.receivedDate,
                Activation_Date: properties.activationDate
            },
        );
    }

    resultsReadyEvent(email: string, properties: IResultsReadyEventProperties): Promise<void> {
        return this.createEvent(
            email,
            KlaviyoEventTypes.resultsReady,
            {
                Sample_Id: properties.sampleId,
                Test_Name: properties.testName,
                Test_Category: 'Blood',
                Lab_Profile_Id: properties.labProfileId,
                Activation_Date: properties.activationDate,
                Results_Date: properties.resultsDate,
                Results_Failed: properties.isResultsFailed,
                Results_Failed_Reason: properties.resultsFailedReasons,
                Critical_Results: properties.isCriticalResults,
                Critical_Results_Details: properties.criticalResults,
            },
        );
    }

    badResultsEvent(email: string, properties: IBadResultsEventProperties): Promise<void> {
        return this.createEvent(
            email,
            KlaviyoEventTypes.badResults,
            {
                Sample_Id: properties.sampleId,
                Test_Name: properties.testName,
                Test_Category: 'Blood',
                Lab_Profile_Id: properties.labProfileId,
                Activation_Date: properties.activationDate,
                Results_Date: properties.resultsDate,
                Bad_Results: properties.badResults.map(badResult => ({
                    biomarker_name: badResult.biomarkerName,
                    range: badResult.range
                }))
            },
        );
    }
}
