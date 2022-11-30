import { ApiProperty } from '@nestjs/swagger';
import { recommendationImpactsValidationRules } from '../../../../common/src/resources/recommendation-impacts/recommendation-impacts-validation-rules';
import { ArrayMaxSize, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateRecommendationImpactDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    @IsPositive()
    readonly biomarkerId: number;

    @ApiProperty({ type: () => String, required: true })
    @IsOptional()
    @IsString()
    @MaxLength(recommendationImpactsValidationRules.descriptionMaxLength)
    readonly descriptionHigh: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(recommendationImpactsValidationRules.impactLevelMinValue)
    @Max(recommendationImpactsValidationRules.impactLevelMaxValue)
    readonly impactLevelHigh: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(recommendationImpactsValidationRules.qualityOfEvidenceMinValue)
    @Max(recommendationImpactsValidationRules.qualityOfEvidenceMaxValue)
    readonly qualityOfEvidenceHigh: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(recommendationImpactsValidationRules.strengthOfEvidenceMinValue)
    @Max(recommendationImpactsValidationRules.strengthOfEvidenceMaxValue)
    readonly strengthOfEvidenceHigh: number;

    @ApiProperty({ type: () => String, required: true })
    @IsOptional()
    @IsString()
    @MaxLength(recommendationImpactsValidationRules.descriptionMaxLength)
    readonly descriptionLow: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(recommendationImpactsValidationRules.impactLevelMinValue)
    @Max(recommendationImpactsValidationRules.impactLevelMaxValue)
    readonly impactLevelLow: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(recommendationImpactsValidationRules.qualityOfEvidenceMinValue)
    @Max(recommendationImpactsValidationRules.qualityOfEvidenceMaxValue)
    readonly qualityOfEvidenceLow: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(recommendationImpactsValidationRules.strengthOfEvidenceMinValue)
    @Max(recommendationImpactsValidationRules.strengthOfEvidenceMaxValue)
    readonly strengthOfEvidenceLow: number;

    @ApiProperty({ type: () => [String], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMaxSize(recommendationImpactsValidationRules.studyLinksMaxCount)
    @MaxLength(recommendationImpactsValidationRules.studyLinkMaxLength, { each: true })
    @MinLength(recommendationImpactsValidationRules.studyLinkMinLength, { each: true })
    readonly highStudyLinks: string[];

    @ApiProperty({ type: () => [String], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMaxSize(recommendationImpactsValidationRules.studyLinksMaxCount)
    @MaxLength(recommendationImpactsValidationRules.studyLinkMaxLength, { each: true })
    @MinLength(recommendationImpactsValidationRules.studyLinkMinLength, { each: true })
    readonly lowStudyLinks: string[];
}