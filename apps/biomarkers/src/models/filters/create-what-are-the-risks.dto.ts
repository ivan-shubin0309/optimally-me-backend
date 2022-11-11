import { ApiProperty } from '@nestjs/swagger';
import { MaxFieldValueRepeatCount } from '../../../../common/src/resources/common/max-field-value-repeat-count.decorator';
import { FilterValidationRules } from '../../../../common/src/resources/filters/validation-rules';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateFilterBulletListDto } from '../filterBulletLists/create-filter-bullet-list.dto';
import { CheckAllowedTypes } from '../../../../common/src/resources/filterBulletLists/check-allowed-types.decorator';

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

    @ApiProperty({ type: () => [CreateFilterBulletListDto], required: false })
    @IsArray()
    @MaxFieldValueRepeatCount('type', FilterValidationRules.bulletListMaxLength)
    @CheckAllowedTypes({ each: true })
    @IsOptional()
    readonly bulletList: CreateFilterBulletListDto[];
}