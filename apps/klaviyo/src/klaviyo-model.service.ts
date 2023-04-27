import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../users/src/models';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { KlaviyoService } from './klaviyo.service';
import { UserKlaviyo } from './models/user-klaviyo.entity';
import { SexClientValues } from '../../common/src/resources/filters/sex-types';
import { Hl7Object } from '../../hl7/src/models/hl7-object.entity';
import { DateTime } from 'luxon';
import { OtherFeatureTypes } from 'apps/common/src/resources/filters/other-feature-types';
import { Transaction } from 'sequelize';

@Injectable()
export class KlaviyoModelService extends BaseService<UserKlaviyo> {
    constructor(
        @Inject('USER_KLAVIYO_MODEL') protected model: Repository<UserKlaviyo>,
        @Inject('HL7_OBJECT_MODEL') protected readonly hl7ObjectModel: Repository<Hl7Object>,
        private readonly klaviyoService: KlaviyoService,
    ) { super(model); }

    async getKlaviyoProfile(user: User, transaction?: Transaction): Promise<UserKlaviyo> {
        let userKlaviyo = await this.model
            .scope([{ method: ['byUserId', user.id] }])
            .findOne({ transaction });

        if (!userKlaviyo) {
            let klaviyoProfile = await this.klaviyoService.getProfile(user.email);

            if (!klaviyoProfile) {
                const lastHl7Object = await this.hl7ObjectModel
                    .scope([
                        { method: ['byUserId', user.id] },
                        { method: ['orderBy', [['createdAt', 'desc']]] }
                    ])
                    .findOne({ transaction });

                klaviyoProfile = await this.klaviyoService.createProfile({
                    type: 'profile',
                    attributes: {
                        email: user.email,
                        first_name: user.firstName,
                        last_name: user.lastName,
                        properties: {
                            Gender: SexClientValues[user.additionalField.sex],
                            Date_of_Birth: user.additionalField.dateOfBirth,
                            Accepts_Marketing: true,
                            Self_Assessment_Quiz_Completed: user.additionalField.isSelfAssesmentQuizCompleted,
                            Blood_Last_Activation_Date: lastHl7Object
                                ? DateTime.fromJSDate(lastHl7Object.createdAt).toFormat('yyyy-MM-dd')
                                : null,
                            Blood_Last_Activated_Sample_ID: lastHl7Object
                                ? lastHl7Object.sampleCode
                                : null,
                            Blood_Last_Activated_Test_Name: lastHl7Object
                                ? lastHl7Object.testProductName
                                : null,
                            Last_Female_Cycle_Status: lastHl7Object
                                ? OtherFeatureTypes[lastHl7Object.userOtherFeature]
                                : null,
                        }
                    }
                });
            }

            userKlaviyo = await this.model.create({ userId: user.id, klaviyoUserId: klaviyoProfile.id }, { transaction });
        }

        return userKlaviyo;
    }
}
