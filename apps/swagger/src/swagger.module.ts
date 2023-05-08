import { Module } from '@nestjs/common';
import { SessionsModule } from '../../sessions/src/sessions.module';
import { UsersModule } from '../../users/src/users.module';
import { AdminsSessionsModule } from '../../admins-sessions/src/admins-sessions.module';
import { AdminsVerificationsModule } from '../../admins-verifications/src/admins-verifications.module';
import { BiomarkersModule } from '../../biomarkers/src/biomarkers.module';
import { VerificationsModule } from '../../verifications/src/verifications.module';
import { WefitterModule } from '../../wefitter/src/wefitter.module';
import { AdminsUsersModule } from '../../admins-users/src/admins-users.module';
import { AdminsResultsModule } from '../../admins-results/src/admins-results.module';
import { FilesModule } from '../../files/src/files.module';
import { UsersBiomarkersModule } from '../../users-biomarkers/src/users-biomarkers.module';
import { ShopifyModule } from '../../shopify/src/shopify.module';
import { UsersResultsModule } from '../../users-results/src/users-results.module';
import { HautAiModule } from '../../haut-ai/src/haut-ai.module';
import { SamplesModule } from '../../samples/src/samples.module';
import { TypeformModule } from '../../typeform/src/typeform.module';
import { UsersDevicesModule } from '../../users-devices/src/users-devices.module';
import { UsersWidgetsModule } from '../../users-widgets/src/users-widgets.module';
import { UsersRecommendationsModule } from '../../users-recommendations/src/users-recommendations.module';
import { Hl7Module } from '../../hl7/src/hl7.module';
import { Hl7ErrorNotificationsModule } from '../../hl7-error-notifications/src/hl7-error-notifications.module';
import { UsersHl7Module } from '../../users-hl7/src/users-hl7.module';
import { FulfillmentCenterModule } from '../../fulfillment-center/src/fulfillment-center.module';
import { AdditionalAuthenticationsModule } from '../../additional-authentications/src/additional-authentications.module';

@Module({
  imports: [
    UsersModule,
    SessionsModule,
    AdminsSessionsModule,
    AdminsVerificationsModule,
    BiomarkersModule,
    VerificationsModule,
    WefitterModule,
    AdminsUsersModule,
    AdminsResultsModule,
    FilesModule,
    UsersBiomarkersModule,
    ShopifyModule,
    UsersResultsModule,
    HautAiModule,
    TypeformModule,
    SamplesModule,
    UsersDevicesModule,
    UsersWidgetsModule,
    UsersRecommendationsModule,
    Hl7Module,
    Hl7ErrorNotificationsModule,
    UsersHl7Module,
    FulfillmentCenterModule,
    AdditionalAuthenticationsModule,
  ]
})
export class SwaggerAppModule { }
