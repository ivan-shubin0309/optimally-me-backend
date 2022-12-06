import { Body, Controller, Headers, HttpCode, HttpStatus, NotFoundException, Post, Query, RawBodyRequest, Req, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRoles } from '../../common/src/resources/users';
import { Public } from '../../common/src/resources/common/public.decorator';
import { UsersService } from '../../users/src/users.service';
import { ShopifyService } from './shopify.service';
import { TranslatorService } from 'nestjs-translator';

@ApiTags('shopify')
@Controller('shopify')
export class ShopifyController {
  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
  ) { }

  @Public()
  @ApiOperation({ summary: 'Shopify customer creation webhook' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/events/customer-creation')
  async customerCreation(@Body() body: any, @Headers('X-Shopify-Hmac-SHA256') hmac, @Req() req: RawBodyRequest<Request>): Promise<void> {
    const isVerified = this.shopifyService.verifyWebhook(hmac, req.rawBody);

    if (!isVerified) {
      throw new UnauthorizedException({
        message: this.translator.translate('SHOPIFY_EVENT_NOT_VERIFIED'),
        errorCode: 'SHOPIFY_EVENT_NOT_VERIFIED',
        statusCode: HttpStatus.UNAUTHORIZED
      });
    }

    const user = await this.usersService.getOne([
      { method: ['byRoles', UserRoles.user] },
      { method: ['byEmail', body.email] },
      'withAdditionalField'
    ]);

    if (!user) {
      throw new NotFoundException({
        message: this.translator.translate('USER_NOT_FOUND'),
        errorCode: 'USER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    await this.shopifyService.updateCustomer(body.id, user);
  }
}
