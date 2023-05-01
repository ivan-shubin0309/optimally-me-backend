import { Module } from '@nestjs/common';
import { KlaviyoModelService } from '../../klaviyo/src/klaviyo-model.service';
import { KlaviyoService } from '../../klaviyo/src/klaviyo.service';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { entities } from '../../common/src/utils/database/database-entity.provider';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { redisModuleInstance } from '../../common/src/utils/database/redis.provider';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { SessionsService } from '../../sessions/src/sessions.service';
import { UsersService } from '../../users/src/users.service';
import { modelProviders } from './models.provider';
import { SamplesController } from './samples.controller';
import { SamplesService } from './samples.service';
import { FulfillmentCenterService } from '../../fulfillment-center/src/fulfillment-center.service';

@Module({
  imports: [
    ConfigModule,
    jwtModuleInstance,
    redisModuleInstance,
    translatorInstance,
  ],
  controllers: [SamplesController],
  providers: [
    SamplesService,
    UsersService,
    SessionsService,
    KlaviyoModelService,
    KlaviyoService,
    FulfillmentCenterService,
    JwtStrategy,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders,
  ],
})
export class SamplesModule { }
