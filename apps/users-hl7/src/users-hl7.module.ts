import { Module } from '@nestjs/common';
import { FileHelper } from '../../common/src/utils/helpers/file.helper';
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
import { modelProviders } from './models.provider';
import { UsersHl7ObjectsService } from './users-hl7-objects.service';
import { UsersHl7Controller } from './users-hl7.controller';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        translatorInstance,
    ],
    controllers: [UsersHl7Controller],
    providers: [
        UsersHl7ObjectsService,
        UsersService,
        SessionsService,
        FileHelper,
        JwtStrategy,
        ...guardProviders,
        sequelizeProvider(entities),
        ...modelProviders,
    ],
})
export class UsersHl7Module { }
