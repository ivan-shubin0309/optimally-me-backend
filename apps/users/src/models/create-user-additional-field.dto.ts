import { IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SexTypes } from '../../../common/src/resources/filters/sex-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { AgeTypes } from '../../../common/src/resources/filters/age-types';
import { EthnicityTypes } from '../../../common/src/resources/filters/ethnicity-types';
import { OtherFeatureTypes } from '../../../common/src/resources/filters/other-feature-types';

export class CreateUserAdditionalFieldDto {
    @ApiProperty({ type: () => String, required: false, description: EnumHelper.toDescription(SexTypes) })
    @IsNumber()
    @IsEnum(SexTypes)
    readonly sex: number;

    @ApiProperty({ type: () => String, required: false, description: EnumHelper.toDescription(AgeTypes) })
    @IsNumber()
    @IsEnum(AgeTypes)
    readonly age: number;

    @ApiProperty({ type: () => String, required: false, description: EnumHelper.toDescription(EthnicityTypes) })
    @IsNumber()
    @IsEnum(EthnicityTypes)
    readonly ethnicity: number;

    @ApiProperty({ type: () => String, required: false, description: EnumHelper.toDescription(OtherFeatureTypes) })
    @IsNumber()
    @IsEnum(OtherFeatureTypes)
    readonly otherFeature: number;
}
