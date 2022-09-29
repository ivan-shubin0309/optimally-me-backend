import { ApiProperty } from '@nestjs/swagger';
import { AgeTypes } from '../../../../common/src/resources/filters/age-types';
import { EthnicityTypes } from '../../../../common/src/resources/filters/ethnicity-types';
import { OtherFeatureTypes } from '../../../../common/src/resources/filters/other-feature-types';
import { SexTypes } from '../../../../common/src/resources/filters/sex-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateInteractionDto } from '../interactions/create-interaction.dto';
import { CreateRecommendationDto } from '../recommendations/create-recommendation.dto';

export class CreateFilterDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly criticalLow: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly lowMin: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly lowMax: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly subOptimalMin: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly subOptimalMax: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly optimalMin: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly optimalMax: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly supraOptimalMin: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly supraOptimalMax: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly highMin: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly highMax: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly criticalHigh: number;

    @ApiProperty({ type: () => CreateRecommendationDto, required: false })
    @IsOptional()
    readonly recommendation: CreateRecommendationDto;

    @ApiProperty({ type: () => [CreateInteractionDto], required: false })
    @IsOptional()
    readonly interactions: CreateInteractionDto[];

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(AgeTypes) })
    @IsOptional()
    readonly ages: number[];

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(SexTypes) })
    @IsOptional()
    readonly sexes: number[];

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(EthnicityTypes) })
    @IsOptional()
    readonly ethnicities: number[];

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(OtherFeatureTypes) })
    @IsOptional()
    readonly otherFeatures: number[];
}