import { Module } from '@nestjs/common';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { redisModuleInstance } from '../../common/src/utils/database/redis.provider';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { entities } from '../../common/src/utils/database/database-entity.provider';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { SessionsService } from '../../sessions/src/sessions.service';
import { UsersService } from '../../users/src/users.service';
import { modelProviders } from './models.provider';
import { TypeformController } from './typeform.controller';
import { TypeformService } from './typeform.service';
import { UserQuizAnswersService } from './user-quiz-answers.service';
import { UserQuizesService } from './user-quizes.service';

@Module({
  imports: [
    ConfigModule,
    jwtModuleInstance,
    redisModuleInstance,
    translatorInstance
  ],
  controllers: [TypeformController],
  providers: [
    TypeformService,
    SessionsService,
    UsersService,
    JwtStrategy,
    UserQuizesService,
    UserQuizAnswersService,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders
  ],
})
export class TypeformModule { }
