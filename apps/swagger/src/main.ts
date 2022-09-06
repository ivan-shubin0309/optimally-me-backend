import { NestFactory } from '@nestjs/core';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { SwaggerAppModule } from './swagger.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { appBuilder } from '../../common/src/utils/appBuilder/app-builder.provider';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(SwaggerAppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle(configService.get('SWAGGER_TITLE'))
    .setVersion('1.0')
    .addServer(configService.get('SWAGGER_BACKEND_URL'))
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    'swagger',
    app,
    document,
    {
      swaggerOptions: {
        displayOperationId: true,
      },
    }
  );

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
