import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { UsersService } from '../../users/src/users.service';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { redisModuleInstance } from '../../common/src/utils/database/redis.provider';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';
import { translatorInstance } from '../../common/src/utils/translator/translator.provider';
import { HautAiController } from './haut-ai.controller';
import { HautAiService } from './haut-ai.service';
import { SessionsService } from '../../sessions/src/sessions.service';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { entities } from '../../common/src/utils/database/database-entity.provider';
import { modelProviders } from './models.provider';
import { UserHautAiFieldsService } from './user-haut-ai-fields.service';
import { FilesService } from '../../files/src/files.service';
import { FileHelper } from '../../common/src/utils/helpers/file.helper';
import { S3Service } from '../../files/src/s3.service';

@Module({
  imports: [
    ConfigModule,
    jwtModuleInstance,
    redisModuleInstance,
    translatorInstance,
  ],
  controllers: [HautAiController],
  providers: [
    HautAiService,
    UserHautAiFieldsService,
    UsersService,
    FilesService,
    FileHelper,
    S3Service,
    SessionsService,
    JwtStrategy,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders,
  ],
})
export class HautAiModule { }
