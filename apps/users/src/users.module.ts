import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { modelProviders } from './models.provider';
import { SessionsService } from '../../sessions/src/sessions.service';
import { redisModuleInstance } from '../../common/src/utils/database/redis.provider';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { entities } from '../../common/src/utils/database/database-entity.provider';
import { WefitterService } from '../../wefitter/src/wefitter.service';
import { VerificationsService } from '../../verifications/src/verifications.service';
import { MailerService } from '../../common/src/resources/mailer/mailer.service';
import { UserCodesService } from '../../sessions/src/user-codes.service';
import { KlaviyoModelService } from '../../klaviyo/src/klaviyo-model.service';
import { KlaviyoService } from '../../klaviyo/src/klaviyo.service';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        translatorInstance,
    ],
    providers: [
        UsersService,
        WefitterService,
        SessionsService,
        VerificationsService,
        MailerService,
        UserCodesService,
        KlaviyoModelService,
        KlaviyoService,
        JwtStrategy,
        ...guardProviders,
        sequelizeProvider(entities),
        ...modelProviders,
    ],
    controllers: [UsersController]
})
export class UsersModule { }
