import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import * as morgan from 'morgan';

export const appBuilder = async (app: INestApplication, configService: ConfigService): Promise<INestApplication> => {
    app.enableCors({ origin: JSON.parse(configService.get('CORS_ORIGINS')) });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

    app.use(morgan('tiny'));

    await app.init();
    return app;
};
