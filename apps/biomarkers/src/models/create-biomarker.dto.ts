import { IsNotEmpty, MaxLength, MinLength, IsArray, ArrayMaxSize, IsPositive, IsInt, IsString, ValidateNested, IsOptional, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { biomarkerValidationRules } from '../../../common/src/resources/biomarkers/validation-rules';
import { CreateFilterDto } from './filters/create-filter.dto';

export class CreateBiomarkerDto {
    @ApiProperty({ type: () => String, required: true })
    @MaxLength(biomarkerValidationRules.nameMaxLength)
    @MinLength(biomarkerValidationRules.nameMinLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ type: () => [String], required: false })
    @IsOptional()
    @ArrayMaxSize(biomarkerValidationRules.alternativeNamesMax)
    @IsArray()
    @IsString({ each: true })
    @ArrayUnique()
    readonly alternativeNames: string[];

    @ApiProperty({ type: () => String, required: false })
    @MaxLength(biomarkerValidationRules.nameMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    readonly ruleName: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsInt()
    @IsPositive()
    @IsOptional()
    readonly ruleId: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    readonly categoryId: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    readonly unitId: number;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly summary: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly whatIsIt: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly whatAreTheCauses: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly whatAreTheRisks: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly whatCanYouDo: string;

    @ApiProperty({ type: () => [CreateFilterDto], required: true })
    @ArrayNotEmpty()
    @ArrayMaxSize(biomarkerValidationRules.filtersMaxCount)
    @ValidateNested()
    @Type(() => CreateFilterDto)
    readonly filters: CreateFilterDto[];
}