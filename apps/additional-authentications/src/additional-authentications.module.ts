import { Module } from '@nestjs/common';
import { PushNotificationsService } from '../../users-devices/src/push-notifications.service';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { entities } from '../../common/src/utils/database/database-entity.provider';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { redisModuleInstance } from '../../common/src/utils/database/redis.provider';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { SessionsService } from '../../sessions/src/sessions.service';
import { UsersService } from '../../users/src/users.service';
import { AdditionalAuthenticationsController } from './additional-authentications.controller';
import { AdditionalAuthenticationsService } from './additional-authentications.service';
import { modelProviders } from './models.provider';
import { UsersVerifiedDevicesService } from './users-verified-devices.service';
import { UsersDevicesService } from '../../users-devices/src/users-devices.service';
import { VerificationsService } from '../../verifications/src/verifications.service';
import { MailerService } from '../../common/src/resources/mailer/mailer.service';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        translatorInstance
    ],
    controllers: [AdditionalAuthenticationsController],
    providers: [
        AdditionalAuthenticationsService,
        UsersVerifiedDevicesService,
        PushNotificationsService,
        UsersDevicesService,
        VerificationsService,
        MailerService,
        SessionsService,
        UsersService,
        JwtStrategy,
        ...guardProviders,
        sequelizeProvider(entities),
        ...modelProviders
    ],
})
export class AdditionalAuthenticationsModule { }
