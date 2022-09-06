import { Module } from '@nestjs/common';
import { SessionsModule } from '../../sessions/src/sessions.module';
import { UsersModule } from '../../users/src/users.module';

@Module({
  imports: [
    UsersModule,
    SessionsModule
  ]
})
export class SwaggerAppModule { }
