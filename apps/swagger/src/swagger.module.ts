import { Module } from '@nestjs/common';
import { SessionsModule } from '../../sessions/src/sessions.module';
import { UsersModule } from '../../users/src/users.module';
import { AdminsSessionsModule } from '../../admins-sessions/src/admins-sessions.module';
import { AdminsVerificationsModule } from '../../admins-verifications/src/admins-verifications.module';
import { BiomarkersModule } from '../../biomarkers/src/biomarkers.module';

@Module({
  imports: [
    UsersModule,
    SessionsModule,
    AdminsSessionsModule,
    AdminsVerificationsModule,
    BiomarkersModule
  ]
})
export class SwaggerAppModule { }
