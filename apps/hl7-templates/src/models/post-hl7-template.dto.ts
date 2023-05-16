import { ApiProperty } from '@nestjs/swagger';
import { hl7TemplatesValidationRules } from '../../../common/src/resources/hl7-templates/hl7-templates-validation-rules';
import { Hl7ObjectStatuses } from '../../../common/src/resources/hl7/hl7-object-statuses';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { DateFilterTypes } from '../../../common/src/resources/hl7-templates/date-filter-types';
import { IsOnlyDate } from '../../../common/src/resources/common/is-only-date.decorator';

export class PostHl7TemplateDto {
    @ApiProperty({ type: () => Boolean, required: true })
    @IsNotEmpty()
    @IsBoolean()
    readonly isPrivate: boolean;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(hl7TemplatesValidationRules.nameMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly name: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly dateOfBirthStart: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly dateOfBirthEnd: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly activatedAtStartDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly activatedAtEndDate: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(DateFilterTypes) })
    @IsOptional()
    @IsNumber()
    @IsEnum(DateFilterTypes)
    readonly activatedAtFilterType: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly sampleAtStartDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly sampleAtEndDate: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(DateFilterTypes) })
    @IsOptional()
    @IsNumber()
    @IsEnum(DateFilterTypes)
    readonly sampleAtFilterType: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly labReceivedAtStartDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly labReceivedAtEndDate: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(DateFilterTypes) })
    @IsOptional()
    @IsNumber()
    @IsEnum(DateFilterTypes)
    readonly labReceivedAtFilterType: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly resultAtStartDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly resultAtEndDate: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(DateFilterTypes) })
    @IsOptional()
    @IsNumber()
    @IsEnum(DateFilterTypes)
    readonly resultAtFilterType: number;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(Hl7ObjectStatuses) })
    @IsOptional()
    @IsNumber()
    @IsEnum(Hl7ObjectStatuses)
    readonly status: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(hl7TemplatesValidationRules.searchStringMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly searchString: string;
}