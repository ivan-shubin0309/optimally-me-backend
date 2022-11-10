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
import { AlternativeNamesService } from './services/alternative-names/alternative-names.service';
import { FiltersService } from './services/filters/filters.service';
import { FilesService } from '../../files/src/files.service';
import { RecommendationFilesService } from './services/recommendations/recommendation-files.service';
import { S3Service } from '../../files/src/s3.service';
import { FileHelper } from '../../common/src/utils/helpers/file.helper';
import { RecommendationImpactsService } from './services/recommendation-impacts/recommendation-impacts.service';
import { CacheService } from '../../common/src/resources/cache/cache.service';
import { Sequelize } from 'sequelize-typescript';
import sequelize from 'sequelize';

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
    AlternativeNamesService,
    FiltersService,
    FilesService,
    RecommendationFilesService,
    S3Service,
    FileHelper,
    RecommendationImpactsService,
    CacheService,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders
  ]
})
export class BiomarkersModule {}
