import { Module } from '@nestjs/common';
import { ConfigModule } from '../common/src/utils/config/config.module';

@Module({
    imports: [
        ConfigModule
    ],
    controllers: [],
    providers: [],
})
export class CommandsModule { }
