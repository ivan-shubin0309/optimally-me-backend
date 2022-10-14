import { Module } from '@nestjs/common';
import { BiomarkersService } from '../../biomarkers/src/biomarkers.service';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { entities } from '../../common/src/utils/database/database-entity.provider';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { redisModuleInstance } from '../../common/src/utils/database/redis.provider';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { SessionsService } from '../../sessions/src/sessions.service';
import { UsersService } from '../../users/src/users.service';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { AdminsResultsController } from './admins-results.controller';
import { AdminsResultsService } from './admins-results.service';
import { modelProviders } from './models.provider';
import { BiomarkersFactory } from 'apps/biomarkers/src/biomarkers.factory';

@Module({
  imports: [
    ConfigModule,
    jwtModuleInstance,
    redisModuleInstance,
    translatorInstance
  ],
  controllers: [AdminsResultsController],
  providers: [
    AdminsResultsService,
    BiomarkersService,
    BiomarkersFactory,
    SessionsService,
    UsersService,
    JwtStrategy,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders
  ],
})
export class AdminsResultsModule { }
