import { NestFactory } from '@nestjs/core';
import { UsersDevicesModule } from './users-devices.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersDevicesModule);
  await app.listen(3000);
}
bootstrap();
