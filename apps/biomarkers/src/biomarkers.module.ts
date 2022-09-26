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
import { User } from '../../users/src/models';
import {
  Category,
  Unit,
  BiomarkerRule,
  Biomarker,
  BiomarkerInteraction,
  AlternativeName,
  FilterRecommendation,
  BiomarkerFilter,
  BiomarkerFilterAge,
  LibraryFilterAge,
  BiomarkerFilterSex,
  LibraryFilterSex,
  BiomarkerFilterEthnicity,
  LibraryFilterEthnicity,
  LibraryInteraction,
  BiomarkerFilterOtherFeature,
  LibraryFilterOtherFeature,
  LibraryFilter,
  LibraryFilterRecommendation,
  LibraryRule,
} from './models';
import { modelProviders } from './model.providers';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { CategoriesService } from './services/category/category.service';
import { UnitsService } from './services/units/units.service';
import { FilterSexAgeEthnicityOtherFeatureService } from './services/filterSexAgeEthnicityOtherFeature/filter-sex-age-ethnicity-other-feature.service';
import { InteractionsService } from './services/interactions/interactions.service';
import { RulesService } from './services/rules/rules.service';
import { AlternativeNamesService } from './services/alternativeNames/alternative.service';
import { FiltersService } from './services/filters/filters.service';
import { RecommendationsService } from './services/recommendations/recommendations.service';
import { FilterAgesService } from './services/filterAges/filter-ages.service';
import { FilterSexesService } from './services/filterSexes/filter-sexes.service';
import { FilterEthnicityService } from './services/filterEthnicity/filter-ethnicity.service';
import { FilterOtherFeaturesService } from './services/filterOtherFeatures/filter-other-features.service';
import { CreateParamsHelper } from '../../common/src/utils/helpers/create-params.helper';




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
    CategoriesService,
    InteractionsService,
    FiltersService,
    FilterSexAgeEthnicityOtherFeatureService,
    FilterSexesService,
    FilterAgesService,
    FilterEthnicityService,
    FilterOtherFeaturesService,
    RecommendationsService,
    AlternativeNamesService,
    RulesService,
    UnitsService,
    UsersService,
    JwtStrategy,
    CreateParamsHelper,
    ...guardProviders,
    sequelizeProvider([
      User,
      Category,
      Unit,
      BiomarkerRule,
      Biomarker,
      BiomarkerInteraction,
      LibraryInteraction,
      AlternativeName,
      FilterRecommendation,
      BiomarkerFilter,
      BiomarkerFilterAge,
      LibraryFilterAge,
      BiomarkerFilterSex,
      LibraryFilterSex,
      BiomarkerFilterEthnicity,
      LibraryFilterEthnicity,
      BiomarkerFilterOtherFeature,
      LibraryFilterOtherFeature,
      LibraryFilter,
      LibraryFilterRecommendation,
      LibraryRule
    ]),
    ...modelProviders
  ]
})
export class BiomarkersModule {}
