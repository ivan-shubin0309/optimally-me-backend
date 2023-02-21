import { NestFactory } from '@nestjs/core';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { Callback, Context, Handler } from 'aws-lambda';
import { appBuilder } from '../../common/src/utils/appBuilder/app-builder.provider';
import { UsersWidgetsModule } from './users-widgets.module';

let server: Handler;

async function bootstrap(): Promise<Handler> {
    const app = await NestFactory.create(UsersWidgetsModule);
    const configService = app.get(ConfigService);
    await appBuilder(app, configService);

    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
