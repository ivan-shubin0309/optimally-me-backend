import { IsNotEmpty, IsEnum, IsBoolean, ArrayNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RangesDto } from '../ranges/ranges.dto';
import { RecommendationsDto } from '../recommendations/recommendations.dto';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { SexTypes } from '../../services/filterSexes/sex-types';
import { AgeTypes } from '../../services/filterAges/age-types';
import { EthnicityTypes } from '../../services/filterEthnicity/ethnicity-types';
import { OtherFeatureTypes } from '../../services/filterOtherFeatures/other-feature-types';

export class CreateFilterDto {

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ type: () => Array<number>, description: EnumHelper.toDescription(SexTypes) })
    @ArrayNotEmpty()
    @IsNotEmpty()
    @IsEnum(SexTypes, {
        each: true,
    })
    readonly sexFilters: number[];

    @ApiProperty({ type: () => Array<number>, description: EnumHelper.toDescription(AgeTypes) })
    @ArrayNotEmpty()
    @IsNotEmpty()
    @IsEnum(AgeTypes, {
        each: true,
    })
    readonly ageFilters: number[];

    @ApiProperty({ type: () => Array<number>, description: EnumHelper.toDescription(EthnicityTypes) })
    @ArrayNotEmpty()
    @IsNotEmpty()
    @IsEnum(EthnicityTypes, {
        each: true,
    })
    readonly ethnicityFilters: number[];

    @ApiProperty({ type: () => Array<number>, description: EnumHelper.toDescription(OtherFeatureTypes) })
    @IsArray()
    @IsNotEmpty()
    @IsEnum(OtherFeatureTypes, {
        each: true,
    })
    readonly otherFeatures: number[];

    @ApiProperty({ type: () => RangesDto, required: true })
    @IsNotEmpty()
    readonly ranges: RangesDto;

    @ApiProperty({ type: () => Boolean, required: true })
    @IsBoolean()
    @IsNotEmpty()
    readonly recommendationsIsOn: boolean;

    @ApiProperty({ type: () => RecommendationsDto, required: true })
    @IsNotEmpty()
    readonly recommendations: RecommendationsDto;
}