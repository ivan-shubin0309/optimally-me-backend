import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { UsersService } from '../../users/src/users.service';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { redisModuleInstance } from '../../common/src/utils/database/redis.provider';
import { modelProviders } from './model.provider';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { entities } from '../../common/src/utils/database/database-entity.provider';
import { UsersDevicesService } from '../../users-devices/src/users-devices.service';
import { UserCodesService } from './user-codes.service';
import { AdditionalAuthenticationsService } from '../../additional-authentications/src/additional-authentications.service';
import { UsersVerifiedDevicesService } from '../../additional-authentications/src/users-verified-devices.service';
import { VerificationsService } from '../../verifications/src/verifications.service';
import { MailerService } from '../../common/src/resources/mailer/mailer.service';
import { PushNotificationsService } from '../../users-devices/src/push-notifications.service';

@Module({
  imports: [
    ConfigModule,
    jwtModuleInstance,
    redisModuleInstance,
    translatorInstance
  ],
  controllers: [SessionsController],
  providers: [
    SessionsService,
    UsersService,
    JwtStrategy,
    UsersDevicesService,
    UserCodesService,
    AdditionalAuthenticationsService,
    UsersVerifiedDevicesService,
    VerificationsService,
    MailerService,
    PushNotificationsService,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders
  ]
})
export class SessionsModule {}
