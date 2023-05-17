import { Module } from '@nestjs/common';
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
import { Hl7TemplatesController } from './hl7-templates.controller';
import { Hl7TemplatesService } from './hl7-templates.service';
import { modelProviders } from './models.provider';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        translatorInstance
    ],
    controllers: [Hl7TemplatesController],
    providers: [
        Hl7TemplatesService,
        UsersService,
        JwtStrategy,
        SessionsService,
        ...guardProviders,
        sequelizeProvider(entities),
        ...modelProviders
    ],
})
export class Hl7TemplatesModule { }
