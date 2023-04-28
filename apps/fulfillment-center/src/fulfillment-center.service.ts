import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import axios from 'axios';

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

    async getSamplesStatus(sampleIds: string[]): Promise<IFulfillmentCenterSample[]> {
        const url = `${FULFILLMENT_CENTER_BASE_URL}/sample_id_status`;
        const body = { sampleIds };

        try {
            const response = await axios.post(url, body, { headers: this.getHeaders() });

            console.log(JSON.stringify(response.data));

            return response.data;
        } catch (err) {
            const message = err.message;
            console.log(err.message);
            throw new UnprocessableEntityException({
                message: message,
                errorCode: 'FULFILLMENT_CENTER_GET_SAMPLES_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }
}
