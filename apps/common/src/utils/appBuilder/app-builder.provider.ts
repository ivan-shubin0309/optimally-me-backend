import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

export const appBuilder = async (app: INestApplication, configService: ConfigService): Promise<INestApplication> => {
    app.enableCors({ origin: JSON.parse(configService.get('CORS_ORIGINS')) });

    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    return app;
};
