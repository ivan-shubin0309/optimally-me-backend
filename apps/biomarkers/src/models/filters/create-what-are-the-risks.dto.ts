import { ApiProperty } from '@nestjs/swagger';
import { FilterValidationRules } from 'apps/common/src/resources/filters/validation-rules';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateWhatAreTheRisksDto {
    @ApiProperty({ type: () => String, required: false })
    @IsString()
    @MaxLength(FilterValidationRules.whatAreTheRisksMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    readonly low: string;

    @ApiProperty({ type: () => String, required: false })
    @IsString()
    @MaxLength(FilterValidationRules.whatAreTheRisksMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    readonly high: string;
}