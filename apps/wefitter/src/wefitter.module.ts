import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { WefitterController } from './wefitter.controller';
import { WefitterService } from './wefitter.service';
import { UsersService } from '../../users/src/users.service';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { modelProviders } from './models.provider';
import { SessionsService } from '../../sessions/src/sessions.service';
import { redisModuleInstance } from '../../common/src/utils/database/redis.provider';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { entities } from '../../common/src/utils/database/database-entity.provider';
import { UsersWidgetDataSourcesService } from '../../users-widgets/src/users-widget-data-sources.service';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        translatorInstance,
    ],
    providers: [
        WefitterService,
        UsersService,
        UsersWidgetDataSourcesService,
        SessionsService,
        JwtStrategy,
        ...guardProviders,
        sequelizeProvider(entities),
        ...modelProviders,
    ],
    controllers: [WefitterController]
})
export class WefitterModule { }
