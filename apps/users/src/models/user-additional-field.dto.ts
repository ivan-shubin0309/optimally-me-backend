import { ApiProperty } from '@nestjs/swagger';
import { AgeTypes } from '../../../common/src/resources/filters/age-types';
import { EthnicityTypes } from '../../../common/src/resources/filters/ethnicity-types';
import { OtherFeatureTypes } from '../../../common/src/resources/filters/other-feature-types';
import { RegistrationSteps } from '../../../common/src/resources/users/registration-steps';
import { SexTypes } from '../../../common/src/resources/filters/sex-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { UserAdditionalField } from './user-additional-field.entity';

export class UserAdditionalFieldDto {
    constructor(additionalField: UserAdditionalField) {
        this.userId = additionalField.userId;
        this.sex = additionalField.sex;
        this.dateOfBirth = additionalField.dateOfBirth;
        this.ethnicity = additionalField.ethnicity;
        this.otherFeature = additionalField.otherFeature;
        this.registrationStep = additionalField.registrationStep;
        this.isEmailVerified = additionalField.isEmailVerified;
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
}