import { ApiProperty } from '@nestjs/swagger';
import { OtherFeatureTypes } from '../../../common/src/resources/filters/other-feature-types';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { allowedFeatureTypes } from '../../../common/src/resources/samples/allowed-feature-types';

export class ActivateSampleBodyDto {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(OtherFeatureTypes) })
    @IsOptional()
    @IsNumber()
    @IsEnum(allowedFeatureTypes)
    readonly otherFeature: number;
}