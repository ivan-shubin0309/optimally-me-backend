import { ApiProperty } from '@nestjs/swagger';
import { BulletListTypes } from '../../../../common/src/resources/filterBulletLists/bullet-list-types';
import { FilterValidationRules } from '../../../../common/src/resources/filters/validation-rules';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { Transform, TransformFnParams } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFilterBulletListDto {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(BulletListTypes) })
    @IsNumber()
    @IsEnum(BulletListTypes)
    @IsNotEmpty()
    readonly type: number;

    @ApiProperty({ type: () => String, required: true })
    @IsString()
    @MaxLength(FilterValidationRules.bulletListContentMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    readonly content: string;

    @ApiProperty({ type: () => [String], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMaxSize(FilterValidationRules.studyLinksMaxCount)
    @MaxLength(FilterValidationRules.studyLinkMaxLength, { each: true })
    @MinLength(FilterValidationRules.studyLinkMinLength, { each: true })
    readonly studyLinks: string[];
}