import { NestFactory } from '@nestjs/core';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { Hl7ObjectDataGeneratorCronModule } from './hl7-object-data-generator-cron.module';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
    const app = await NestFactory.create(Hl7ObjectDataGeneratorCronModule);
    const configService = app.get(ConfigService);
    const jwtService = app.get(JwtService);

    const baseUrl = configService.get('SWAGGER_BACKEND_URL');
    const url = `${baseUrl}/hl7/webhook/object-generator`;
    const authToken = jwtService.sign({ isWebhook: true });

    try {
        await axios.post(
            url,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );
    } catch (err) {
        console.log(err.message);
        if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        }
        throw new UnprocessableEntityException({
            message: err.message,
            errorCode: 'BACKEND_REQUEST_ERROR',
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY
        });
    }

    return {
        statusCode: 200,
        body: JSON.stringify({}),
    };
};