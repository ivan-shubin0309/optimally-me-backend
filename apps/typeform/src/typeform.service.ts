import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import * as crypto from 'crypto';

@Injectable()
export class TypeformService {
  constructor(
    private readonly configService: ConfigService
  ) { }

  verifySignature(signature: string, rawBody: Buffer): boolean {
    const hash = crypto
      .createHmac('sha256', this.configService.get('TYPEFORM_SECRET'))
      .update(rawBody)
      .digest('base64');

    return hash === signature;
  }
}
