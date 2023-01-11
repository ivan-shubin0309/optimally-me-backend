import { ApiProperty } from '@nestjs/swagger';
import { recommendationImpactsValidationRules } from '../../../../common/src/resources/recommendation-impacts/recommendation-impacts-validation-rules';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateImpactStudyLinkDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(recommendationImpactsValidationRules.studyLinkMaxLength)
    @MinLength(recommendationImpactsValidationRules.studyLinkMinLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly content: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(recommendationImpactsValidationRules.studyLinkTitleMaxLength)
    @MinLength(recommendationImpactsValidationRules.studyLinkTitleMinLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly title: string;
}