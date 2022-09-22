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
import { Category } from './models';
import { modelProviders } from './model.providers';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';

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
    JwtStrategy,
    ...guardProviders,
    sequelizeProvider([User, Category]),
    ...modelProviders
  ]
})
export class BiomarkersModule {}
