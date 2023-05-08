import { ApiProperty } from '@nestjs/swagger';
import { EthnicityTypes } from '../../../common/src/resources/filters/ethnicity-types';
import { OtherFeatureTypes } from '../../../common/src/resources/filters/other-feature-types';
import { RegistrationSteps } from '../../../common/src/resources/users/registration-steps';
import { SexTypes } from '../../../common/src/resources/filters/sex-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { UserAdditionalField } from './user-additional-field.entity';
import { SkinTypes } from '../../../common/src/resources/filters/skin-types';
import { AdditionalAuthenticationTypes } from '../../../common/src/resources/users-mfa-devices/additional-authentication-types';

export class UserAdditionalFieldDto {
    constructor(additionalField: UserAdditionalField) {
        this.userId = additionalField.userId;
        this.sex = additionalField.sex;
        this.dateOfBirth = additionalField.dateOfBirth;
        this.ethnicity = additionalField.ethnicity;
        this.otherFeature = additionalField.otherFeature;
        this.registrationStep = additionalField.registrationStep;
        this.isEmailVerified = additionalField.isEmailVerified;
        this.isUserVerified = additionalField.isUserVerified;
        this.skinType = additionalField.skinType;
        this.isSensitiveSkin = additionalField.isSensitiveSkin;
        this.isSelfAssesmentQuizCompleted = additionalField.isSelfAssesmentQuizCompleted;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly userId: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(SexTypes) })
    readonly sex: number;

    @ApiProperty({ type: () => String, required: true })
    readonly dateOfBirth: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(EthnicityTypes) })
    readonly ethnicity: number;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(OtherFeatureTypes) })
    readonly otherFeature: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(RegistrationSteps) })
    readonly registrationStep: number;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isEmailVerified: boolean;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isUserVerified: boolean;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(SkinTypes) })
    readonly skinType: number;

    @ApiProperty({ type: () => Boolean, required: false })
    readonly isSensitiveSkin: boolean;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isSelfAssesmentQuizCompleted: boolean;
}