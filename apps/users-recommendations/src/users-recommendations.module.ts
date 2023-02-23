import { Module } from '@nestjs/common';
import { UsersBiomarkersService } from '../../users-biomarkers/src/users-biomarkers.service';
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
import { UsersRecommendationsController } from './users-recommendations.controller';
import { UsersRecommendationsService } from './users-recommendations.service';
import { FileHelper } from '../../common/src/utils/helpers/file.helper';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        translatorInstance
    ],
    controllers: [UsersRecommendationsController],
    providers: [
        UsersRecommendationsService,
        UsersBiomarkersService,
        FileHelper,
        SessionsService,
        UsersService,
        JwtStrategy,
        ...guardProviders,
        sequelizeProvider(entities),
        ...modelProviders
    ],
})
export class UsersRecommendationsModule { }
