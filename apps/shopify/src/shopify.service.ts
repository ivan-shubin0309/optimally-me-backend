import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { User } from '../../users/src/models';
import { UpdateShopifyCustomerDto } from './models/update-shopify-customer.dto';
import * as crypto from 'crypto';
import axios from 'axios';

const apiVersion = '2022-10';

type Record<K extends keyof any, T> = {
  [P in K]: T;
};

@Injectable()
export class ShopifyService {
  private readonly baseUrl: string;
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = `https://${configService.get('SHOPIFY_IDP_IDENTIFIER')}.myshopify.com`;
  }

  private getHeaders(): Record<string, string | number | boolean> {
    return {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': this.configService.get('SHOPIFY_API_ACCESS_TOKEN')
    };
  }

  verifyWebhook(hmac: string, rawBody: Buffer): boolean {
    const hash = crypto
      .createHmac('sha256', this.configService.get('SHOPIFY_WEBHOOK_SECRET'))
      .update(rawBody)
      .digest('base64');

    console.log(hash);
    console.log(hmac);

    return hash === hmac;
  }

  async updateCustomer(customerId: string, user: User): Promise<void> {
    const url = `${this.baseUrl}/admin/api/${apiVersion}/customers/${customerId}.json`;
    const data = { customer: new UpdateShopifyCustomerDto(user) };

    try {
      await axios.put(url, data, { headers: this.getHeaders() });
    } catch (err) {
      console.log(err.message);
      throw new UnprocessableEntityException({
        message: err.message,
        errorCode: 'SHOPIFY_REQUEST_ERROR',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY
      });
    }
  }
}
