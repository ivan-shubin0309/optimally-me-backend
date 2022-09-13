import { Module } from '@nestjs/common';
import { JwtStrategyAdmins } from '../../common/src/strategies/jwt.strategy.admins';
import { UsersService } from '../../users/src/users.service';
import { AdminsSessionsController } from './admins-sessions.controller';
import { AdminsSessionsService } from './admins-sessions.service';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { redisModuleInstance } from 'apps/common/src/utils/database/redis.provider';
import { User } from '../../users/src/models';
import { modelProviders } from './model.provider';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';

@Module({
  imports: [
    ConfigModule,
    jwtModuleInstance,
    redisModuleInstance,
    translatorInstance
  ],
  controllers: [AdminsSessionsController],
  providers: [
    AdminsSessionsService,
    UsersService,
    JwtStrategyAdmins,
    ...guardProviders,
    sequelizeProvider([User]),
    ...modelProviders
  ]
})
export class AdminsSessionsModule {}
