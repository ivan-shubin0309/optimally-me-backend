import { ApiProperty } from '@nestjs/swagger';
import { FilterValidationRules } from '../../../../common/src/resources/filters/validation-rules';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { CreateFilterBulletListDto } from '../filterBulletLists/create-filter-bullet-list.dto';
import { MaxFieldValueRepeatCount } from '../../../../common/src/resources/common/max-field-value-repeat-count.decorator';
import { CheckAllowedTypes } from '../../../../common/src/resources/filterBulletLists/check-allowed-types.decorator';

export class CreateWhatAreTheCausesDto {
    @ApiProperty({ type: () => String, required: false })
    @IsString()
    @MaxLength(FilterValidationRules.whatAreTheCausesMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    readonly low: string;

    @ApiProperty({ type: () => String, required: false })
    @IsString()
    @MaxLength(FilterValidationRules.whatAreTheCausesMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    readonly high: string;

    @ApiProperty({ type: () => [CreateFilterBulletListDto], required: false })
    @IsArray()
    @MaxFieldValueRepeatCount('type', FilterValidationRules.bulletListMaxLength)
    @CheckAllowedTypes({ each: true })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateFilterBulletListDto)
    readonly bulletList: CreateFilterBulletListDto[];
}