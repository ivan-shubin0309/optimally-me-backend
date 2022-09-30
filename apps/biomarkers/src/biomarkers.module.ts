import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { UsersService } from '../../users/src/users.service';
import { BiomarkersController } from './biomarkers.controller';
import { BiomarkersService } from './biomarkers.service';
import { SessionsService } from '../../sessions/src/sessions.service';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { redisModuleInstance } from 'apps/common/src/utils/database/redis.provider';
import { modelProviders } from './models.provider';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { BiomarkersFactory } from './biomarkers.factory';
import { entities } from '../../common/src/utils/database/database-entity.provider';
import { UnitsService } from './services/units/units.service';
import { CategoriesService } from './services/categories/categories.service';
import { RecommendationsService } from './services/recommendations/recommendations.service';
import { FilterCharacteristicsService } from './services/filterCharacteristicsService/filter-characteristics.service';

@Module({
  imports: [
    ConfigModule,
    jwtModuleInstance,
    redisModuleInstance,
    translatorInstance
  ],
  controllers: [BiomarkersController],
  providers: [
    SessionsService,
    BiomarkersService,
    UsersService,
    UnitsService,
    RecommendationsService,
    CategoriesService,
    FilterCharacteristicsService,
    JwtStrategy,
    BiomarkersFactory,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders
  ]
})
export class BiomarkersModule {}
