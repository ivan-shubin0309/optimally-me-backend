import { ApiProperty } from '@nestjs/swagger';
import { FilterValidationRules } from '../../../../common/src/resources/filters/validation-rules';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateFilterSummaryDto {
    @ApiProperty({ type: () => String, required: false })
    @IsString()
    @MaxLength(FilterValidationRules.summaryMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    readonly criticalLow: string;

    @ApiProperty({ type: () => String, required: false })
    @IsString()
    @MaxLength(FilterValidationRules.summaryMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    readonly low: string;

    @ApiProperty({ type: () => String, required: false })
    @IsString()
    @MaxLength(FilterValidationRules.summaryMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    readonly subOptimal: string;

    @ApiProperty({ type: () => String, required: false })
    @IsString()
    @MaxLength(FilterValidationRules.summaryMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    readonly optimal: string;

    @ApiProperty({ type: () => String, required: false })
    @IsString()
    @MaxLength(FilterValidationRules.summaryMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    readonly supraOptimal: string;

    @ApiProperty({ type: () => String, required: false })
    @IsString()
    @MaxLength(FilterValidationRules.summaryMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    readonly high: string;

    @ApiProperty({ type: () => String, required: false })
    @IsString()
    @MaxLength(FilterValidationRules.summaryMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    readonly criticalHigh: string;
}