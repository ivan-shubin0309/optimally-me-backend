import { Module } from '@nestjs/common';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { entities } from '../../common/src/utils/database/database-entity.provider';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { UsersDnaAgeController } from './users-dna-age.controller';
import { UsersDnaAgeService } from './users-dna-age.service';
import { redisModuleInstance } from '../../common/src/utils/database/redis.provider';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { modelProviders } from './models.provider';
import { UsersResultsService } from '../../users-results/src/users-results.service';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { UsersService } from '../../users/src/users.service';
import { SessionsService } from '../../sessions/src/sessions.service';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        translatorInstance,
    ],
    controllers: [UsersDnaAgeController],
    providers: [
        UsersDnaAgeService,
        UsersResultsService,
        SessionsService,
        UsersService,
        JwtStrategy,
        ...guardProviders,
        sequelizeProvider(entities),
        ...modelProviders
    ],
})
export class UsersDnaAgeModule { }
