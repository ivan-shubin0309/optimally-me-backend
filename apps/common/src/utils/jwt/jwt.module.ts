import { JwtModule } from '@nestjs/jwt';
import { DateTime } from 'luxon';
import { ConfigService } from '../config/config.service';

export const jwtModuleInstance = JwtModule.registerAsync({
  useFactory: (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: Math.ceil(
        DateTime
          .fromMillis(parseInt(configService.get('JWT_EXPIRES_IN')))
          .toSeconds()
      ),
    }
  }),
  inject: [ConfigService]
});