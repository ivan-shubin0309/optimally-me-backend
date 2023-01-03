import { ApiProperty } from '@nestjs/swagger';
import { MaxFieldValueRepeatCount } from '../../../../common/src/resources/common/max-field-value-repeat-count.decorator';
import { FilterValidationRules } from '../../../../common/src/resources/filters/validation-rules';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { CreateFilterBulletListDto } from '../filterBulletLists/create-filter-bullet-list.dto';
import { CheckAllowedTypes } from '../../../../common/src/resources/filterBulletLists/check-allowed-types.decorator';
import { ICreateWhatAreTheRisks } from '../create-biomarker.interface';

export class CreateWhatAreTheRisksDto implements ICreateWhatAreTheRisks {
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
    @ValidateNested()
    @Type(() => CreateFilterBulletListDto)
    readonly bulletList: CreateFilterBulletListDto[];
}