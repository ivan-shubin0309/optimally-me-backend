import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { User } from '../../users/src/models';
import { UpdateShopifyCustomerDto } from './models/update-shopify-customer.dto';
import * as crypto from 'crypto';
import axios from 'axios';
import { CustomerMetafieldDto } from './models/customer-metafield.dto';

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

    return hash === hmac;
  }

  async updateCustomer(customerId: string, user: User, isThrowError = true): Promise<void> {
    const customer = new UpdateShopifyCustomerDto(user);

    await this.putCustomer(customer, customerId, isThrowError);
    if (customer.metafields.length) {
      await this.updateMetafields(customer, customerId, isThrowError);
    }
  }

  async putCustomer(customer: UpdateShopifyCustomerDto, customerId: string, isThrowError = true): Promise<void> {
    const url = `${this.baseUrl}/admin/api/${apiVersion}/customers/${customerId}.json`;
    const data = { customer };

    try {
      console.log(JSON.stringify(data));
      await axios.put(url, data, { headers: this.getHeaders() });
    } catch (err) {
      console.log(err.message);
      if (!isThrowError) {
        throw new UnprocessableEntityException({
          message: err.message,
          errorCode: 'SHOPIFY_PUT_CUSTOMER_ERROR',
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY
        });
      }
    }
  }


  async postMetafield(metafield: CustomerMetafieldDto, customerId: string, isThrowError = true): Promise<void> {
    const url = `${this.baseUrl}/admin/api/${apiVersion}/customers/${customerId}/metafields.json`;
    const data = { metafield };

    try {
      console.log(JSON.stringify(data));
      await axios.post(url, data, { headers: this.getHeaders() });
    } catch (err) {
      console.log(err.message);
      if (!isThrowError) {
        throw new UnprocessableEntityException({
          message: err.message,
          errorCode: 'SHOPIFY_POST_METAFIELD_ERROR',
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY
        });
      }
    }
  }

  async updateMetafields(customer: UpdateShopifyCustomerDto, customerId: string, isThrowError = true): Promise<void> {
    await Promise.all(
      customer.metafields.map(metafield => this.postMetafield(metafield, customerId, isThrowError))
    );
  }
}
