import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { modelProviders } from './models.provider';
import { User } from './models';
import { SessionsService } from '../../sessions/src/sessions.service';
import { redisModuleInstance } from '../../common/src/utils/database/redis.provider';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        translatorInstance,
    ],
    providers: [
        UsersService,
        SessionsService,
        JwtStrategy,
        ...guardProviders,
        sequelizeProvider([User]),
        ...modelProviders,
    ],
    controllers: [UsersController]
})
export class UsersModule { }
