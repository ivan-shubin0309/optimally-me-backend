import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { entities } from '../../common/src/utils/database/database-entity.provider';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { SessionsService } from '../../sessions/src/sessions.service';
import { UsersService } from '../../users/src/users.service';
import { redisModuleInstance } from '../../common/src/utils/database/redis.provider';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { AdminsUsersController } from './admins-users.controller';
import { modelProviders } from './models.provider';
import { ConfigModule } from '../../common/src/utils/config/config.module';

@Module({
  imports: [
    ConfigModule,
    jwtModuleInstance,
    redisModuleInstance,
    translatorInstance
  ],
  controllers: [AdminsUsersController],
  providers: [
    SessionsService,
    UsersService,
    JwtStrategy,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders
  ],
})
export class AdminsUsersModule { }
