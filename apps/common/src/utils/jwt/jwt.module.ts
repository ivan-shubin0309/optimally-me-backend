import { JwtModule } from '@nestjs/jwt';
import { DateTime } from 'luxon';
import { ConfigService } from '../config/config.service';

export const jwtModuleInstance = JwtModule.registerAsync({
  useFactory: (configService: ConfigService) => ({
    publicKey: configService.get('JWT_PUBLIC_KEY'),
    privateKey: configService.get('JWT_PRIVATE_KEY'),
    signOptions: {
      expiresIn: Math.ceil(
        DateTime
          .fromMillis(parseInt(configService.get('JWT_EXPIRES_IN')))
          .toSeconds()
      ),
      algorithm: 'RS256'
    }
  }),
  inject: [ConfigService]
});