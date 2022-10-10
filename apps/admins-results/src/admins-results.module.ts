import { Module } from '@nestjs/common';
import { JwtStrategy } from 'apps/common/src/strategies/jwt.strategy';
import { ConfigModule } from 'apps/common/src/utils/config/config.module';
import { entities } from 'apps/common/src/utils/database/database-entity.provider';
import { sequelizeProvider } from 'apps/common/src/utils/database/database.provider';
import { redisModuleInstance } from 'apps/common/src/utils/database/redis.provider';
import { guardProviders } from 'apps/common/src/utils/guards/guard.provider';
import { jwtModuleInstance } from 'apps/common/src/utils/jwt/jwt.module';
import { translatorInstance } from 'apps/common/src/utils/translator/translator.provider';
import { SessionsService } from 'apps/sessions/src/sessions.service';
import { UsersService } from 'apps/users/src/users.service';
import { AdminsResultsController } from './admins-results.controller';
import { AdminsResultsService } from './admins-results.service';
import { modelProviders } from './models.provider';

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
    SessionsService,
    UsersService,
    JwtStrategy,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders
  ],
})
export class AdminsResultsModule { }
