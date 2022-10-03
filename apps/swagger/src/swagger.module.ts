import { Module } from '@nestjs/common';
import { SessionsModule } from '../../sessions/src/sessions.module';
import { UsersModule } from '../../users/src/users.module';
import { AdminsSessionsModule } from '../../admins-sessions/src/admins-sessions.module';
import { AdminsVerificationsModule } from '../../admins-verifications/src/admins-verifications.module';
import { BiomarkersModule } from '../../biomarkers/src/biomarkers.module';
import { VerificationsModule } from '../../verifications/src/verifications.module';

@Module({
  imports: [
    UsersModule,
    SessionsModule,
    AdminsSessionsModule,
    AdminsVerificationsModule,
    BiomarkersModule,
    VerificationsModule,
  ]
})
export class SwaggerAppModule { }
