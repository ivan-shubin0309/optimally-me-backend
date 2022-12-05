import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import * as ShopifyAPI from 'shopify-node-api';
import { User } from '../../users/src/models';
import { UpdateShopifyCustomerDto } from './models/update-shopify-customer.dto';
import * as crypto from 'crypto';

const apiVersion = '2022-10';

@Injectable()
export class ShopifyService {
  private readonly shopifyApi: ShopifyAPI;
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.shopifyApi = new ShopifyAPI({
      shop: configService.get('SHOPIFY_IDP_IDENTIFIER'),
      shopify_api_key: configService.get('SHOPIFY_API_KEY'),
      shopify_shared_secret: configService.get('SHOPIFY_WEBHOOK_SECRET'),
      access_token: configService.get('SHOPIFY_API_ACCESS_TOKEN')
    });
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
    const url = `/admin/api/${apiVersion}/customers/${customerId}.json`;
    const data = { customer: new UpdateShopifyCustomerDto(user) };

    const promise = new Promise((resolve, reject) =>
      this.shopifyApi.put(url, data, function (err, data) {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      })
    );

    await promise.catch(err => {
      console.log(err.message);
      throw new UnprocessableEntityException({
        message: err.message,
        errorCode: 'SHOPIFY_REQUEST_ERROR',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY
      });
    });
  }
}
