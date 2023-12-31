import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { entities } from '../../common/src/utils/database/database-entity.provider';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { redisModuleInstance } from '../../common/src/utils/database/redis.provider';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { SessionsService } from '../../sessions/src/sessions.service';
import { UsersService } from '../../users/src/users.service';
import { UsersResultsController } from './users-results.controller';
import { UsersResultsService } from './users-results.service';
import { modelProviders } from './models.provider';
import { FiltersService } from '../../biomarkers/src/services/filters/filters.service';
import { FileHelper } from '../../common/src/utils/helpers/file.helper';
import { UsersRecommendationsService } from '../../users-recommendations/src/users-recommendations.service';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        translatorInstance
    ],
    controllers: [UsersResultsController],
    providers: [
        SessionsService,
        UsersService,
        UsersResultsService,
        UsersRecommendationsService,
        FiltersService,
        JwtStrategy,
        FileHelper,
        ...guardProviders,
        sequelizeProvider(entities),
        ...modelProviders
    ],
})
export class UsersResultsModule { }
