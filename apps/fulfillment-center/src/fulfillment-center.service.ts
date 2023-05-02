import { ForbiddenException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import axios from 'axios';
import * as crypto from 'crypto';

interface IFulfillmentCenterSample {
    sample_id: string,
    product_sku: string,
    product_name: string,
    lab_name: string,
    lab_profile_id: string,
    order_source: string,
    order_id: string,
    customer_username: string,
    require_female_cycle_status: boolean,
    fulfilment_name: string,
    fulfilment_id: string,
    fulfilment_sku: string,
    expiry_date: string,
    lot_no: string,
    return_tracking_id: string,
    outbound_tracking_id: string
}

const FULFILLMENT_CENTER_BASE_URL = 'https://fulfilment-api.optimallyme.com/api';

@Injectable()
export class FulfillmentCenterService {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    private getHeaders(): Record<string, string | number | boolean> {
        const headers = {
            'Content-Type': 'application/json',
            'apikey': `${this.configService.get('FULFILLMENT_CENTER_API_KEY')}`,
        };

        return headers;
    }

    async getSampleStatus(sampleId: string): Promise<IFulfillmentCenterSample[]> {
        const url = `${FULFILLMENT_CENTER_BASE_URL}/sample_id_status/${sampleId}`;

        try {
            const response = await axios.get(url, { headers: this.getHeaders() });

            console.log(JSON.stringify(response.data));

            return response.data;
        } catch (err) {
            const message = err.message;
            console.log(err.message);
            console.log(err?.response?.data && JSON.stringify(err?.response?.data));
            throw new UnprocessableEntityException({
                message: message,
                errorCode: 'FULFILLMENT_CENTER_GET_SAMPLES_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    async signatureVerify(sampleId: string, signature: string): Promise<void> {
        const hash = crypto
            .createHash('md5')
            .update(`${sampleId}${this.configService.get('FULFILLMENT_CENTER_API_KEY')}`)
            .digest('hex');

        if (hash !== signature) {
            throw new ForbiddenException({
                message: 'FULFILLMENT_CENTER_SIGNATURE_NOT_VERIFIED',
                errorCode: 'FULFILLMENT_CENTER_SIGNATURE_NOT_VERIFIED',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }
}
