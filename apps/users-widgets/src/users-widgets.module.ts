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
import { modelProviders } from './models.provider';
import { UsersWidgetsController } from './users-widgets.controller';
import { UsersWidgetSettingsService } from './users-widget-settings.service';
import { WefitterService } from '../../wefitter/src/wefitter.service';
import { UsersWidgetDataSourcesService } from './users-widget-data-sources.service';
import { UsersDashboardSettingsService } from './users-dashboard-settings.service';
import { UsersMetricGraphSettingsService } from './users-metric-graph-service';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        translatorInstance
    ],
    controllers: [UsersWidgetsController],
    providers: [
        UsersWidgetSettingsService,
        SessionsService,
        UsersService,
        WefitterService,
        UsersWidgetDataSourcesService,
        UsersDashboardSettingsService,
        UsersMetricGraphSettingsService,
        JwtStrategy,
        ...guardProviders,
        sequelizeProvider(entities),
        ...modelProviders
    ],
})
export class UsersWidgetsModule { }
