import { Module } from '@nestjs/common';
import { FilesService } from '../../files/src/files.service';
import { S3Service } from '../../files/src/s3.service';
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
import { Hl7FilesService } from './hl7-files.service';
import { Hl7Controller } from './hl7.controller';
import { Hl7Service } from './hl7.service';
import { modelProviders } from './models.provider';
import { FileHelper } from '../../common/src/utils/helpers/file.helper';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        translatorInstance
    ],
    controllers: [Hl7Controller],
    providers: [
        Hl7Service,
        SessionsService,
        UsersService,
        Hl7FilesService,
        FilesService,
        FileHelper,
        S3Service,
        JwtStrategy,
        ...guardProviders,
        sequelizeProvider(entities),
        ...modelProviders
    ],
})
export class Hl7Module { }
