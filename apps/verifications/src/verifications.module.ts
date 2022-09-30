import { Module } from '@nestjs/common';
import { SessionsService } from '../../sessions/src/sessions.service';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { redisModuleInstance } from '../../common/src/utils/database/redis.provider';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { UsersService } from '../../users/src/users.service';
import { VerificationsService } from './verifications.service';
import { MailerService } from '../../common/src/resources/mailer/mailer.service';
import { entities } from '../../common/src/utils/database/database-entity.provider';
import { VerificationsController } from './verifications.controller';
import { modelProviders } from './models.provider';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        translatorInstance
    ],
    controllers: [
        VerificationsController
    ],
    providers: [
        VerificationsService,
        UsersService,
        SessionsService,
        MailerService,
        JwtStrategy,
        ...guardProviders,
        sequelizeProvider(entities),
        ...modelProviders,
    ],
})
export class VerificationsModule { }
