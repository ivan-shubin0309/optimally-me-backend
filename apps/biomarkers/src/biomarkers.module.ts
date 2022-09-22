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
import { Category, Unit } from './models';
import { modelProviders } from './model.providers';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { CategoriesService } from '../../common/src/resources/categories/categories.service';
import { UnitsService } from '../../common/src/resources/units/units.service';

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
    UnitsService,
    UsersService,
    JwtStrategy,
    ...guardProviders,
    sequelizeProvider([User, Category, Unit]),
    ...modelProviders
  ]
})
export class BiomarkersModule {}
