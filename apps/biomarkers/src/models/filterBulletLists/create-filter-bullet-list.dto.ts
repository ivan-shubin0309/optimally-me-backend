import { ApiProperty } from '@nestjs/swagger';
import { BulletListTypes } from '../../../../common/src/resources/filterBulletLists/bullet-list-types';
import { FilterValidationRules } from '../../../../common/src/resources/filters/validation-rules';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

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
}