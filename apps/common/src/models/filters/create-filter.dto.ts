import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RangesDto } from '../ranges/ranges.dto';
import { RecommendationsDto } from '../recommendations/recommendations.dto';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { SexTypes } from '../../resources/filterSexes/sex-types';
import { AgeTypes } from '../../resources/filterAges/age-types';
import { EthnicityTypes } from '../../resources/filterEthnicity/ethnicity-types';
import { OtherFeatureTypes } from '../../resources/filterOtherFeatures/other-feature-types';

export class CreateFilterDto {

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ type: () => Array<number[]>, description: EnumHelper.toDescription(SexTypes) })
    @IsNotEmpty()
    readonly sexFilters: number[];

    @ApiProperty({ type: () => Array<number[]>, description: EnumHelper.toDescription(AgeTypes) })
    @IsNotEmpty()
    readonly ageFilters: number[];

    @ApiProperty({ type: () => Array<number[]>, description: EnumHelper.toDescription(EthnicityTypes) })
    @IsNotEmpty()
    readonly ethnicityFilters: number[];

    @ApiProperty({ type: () => Array<number[]>, description: EnumHelper.toDescription(OtherFeatureTypes) })
    @IsNotEmpty()
    readonly otherFeatures: number[];

    @ApiProperty({ type: () => RangesDto, required: true })
    @IsNotEmpty()
    readonly ranges: RangesDto;

    @ApiProperty({ type: () => Boolean, required: true })
    @IsNotEmpty()
    readonly recommendationsIsOn: boolean;

    @ApiProperty({ type: () => RecommendationsDto, required: true })
    @IsNotEmpty()
    readonly recommendations: RecommendationsDto;
}