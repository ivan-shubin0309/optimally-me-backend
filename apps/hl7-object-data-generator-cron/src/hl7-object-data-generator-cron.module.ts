import { Module } from '@nestjs/common';
import { ConfigModule } from '../../common/src/utils/config/config.module';
import { jwtModuleInstance } from '../../common/src/utils/jwt/jwt.module';

@Module({
    imports: [
        ConfigModule,
        jwtModuleInstance
    ],
    controllers: [],
    providers: [],
})
export class Hl7ObjectDataGeneratorCronModule { }
