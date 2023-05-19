import { ApiProperty } from '@nestjs/swagger';
import { hl7TemplatesValidationRules } from '../../../common/src/resources/hl7-templates/hl7-templates-validation-rules';
import { Hl7ObjectStatuses } from '../../../common/src/resources/hl7/hl7-object-statuses';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
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
    readonly dateOfBirthStart: string = null;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly dateOfBirthEnd: string = null;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly activatedAtStartDate: string = null;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly activatedAtEndDate: string = null;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(DateFilterTypes) })
    @IsOptional()
    @IsNumber()
    @IsEnum(DateFilterTypes)
    readonly activatedAtFilterType: number = null;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly sampleAtStartDate: string = null;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly sampleAtEndDate: string = null;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(DateFilterTypes) })
    @IsOptional()
    @IsNumber()
    @IsEnum(DateFilterTypes)
    readonly sampleAtFilterType: number = null;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly labReceivedAtStartDate: string = null;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly labReceivedAtEndDate: string = null;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(DateFilterTypes) })
    @IsOptional()
    @IsNumber()
    @IsEnum(DateFilterTypes)
    readonly labReceivedAtFilterType: number = null;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly resultAtStartDate: string = null;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsDateString()
    readonly resultAtEndDate: string = null;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(DateFilterTypes) })
    @IsOptional()
    @IsNumber()
    @IsEnum(DateFilterTypes)
    readonly resultAtFilterType: number = null;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(Hl7ObjectStatuses) })
    @IsOptional()
    @IsNumber()
    @IsEnum(Hl7ObjectStatuses)
    readonly status: number = null;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(hl7TemplatesValidationRules.searchStringMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly searchString: string = null;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @IsPositive()
    readonly activatedAtDaysCount: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @IsPositive()
    readonly sampleAtDaysCount: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @IsPositive()
    readonly labReceivedAtDaysCount: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @IsPositive()
    readonly resultAtDaysCount: number;
}