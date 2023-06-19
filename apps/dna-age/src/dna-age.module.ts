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
import { DnaAgeController } from './dna-age.controller';
import { DnaAgeFilesService } from './dna-age-files.service';
import { modelProviders } from './models.provider';
import { FileHelper } from '../../common/src/utils/helpers/file.helper';
import { SamplesService } from '../../samples/src/samples.service';
import { FulfillmentCenterService } from '../../fulfillment-center/src/fulfillment-center.service';
import { UsersBiomarkersService } from '../../users-biomarkers/src/users-biomarkers.service';
import { FilesService } from '../../files/src/files.service';
import { S3Service } from '../../files/src/s3.service';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance,
        redisModuleInstance,
        translatorInstance
    ],
    controllers: [DnaAgeController],
    providers: [
        S3Service,
        FilesService,
        UsersBiomarkersService,
        FulfillmentCenterService,
        SamplesService,
        DnaAgeFilesService,
        SessionsService,
        UsersService,
        JwtStrategy,
        FileHelper,
        ...guardProviders,
        sequelizeProvider(entities),
        ...modelProviders
    ],
})
export class DnaAgeModule { }
