import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRuleDto } from '../../../common/src/models/rules/create-rule.dto';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { UnitTypes } from '../../../common/src/resources/units/units-types';
import { CategoryTypes } from '../../../common/src/resources/category/category-types';

export class CreateBiomarkerDto {
    @ApiProperty({ type: () => String, required: true })
    @MaxLength(200)
    @MinLength(1)
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ type: () => Array, required: true })
    @IsNotEmpty()
    readonly alternativeNames: string[];

    @ApiProperty({ type: () => Number, description: EnumHelper.toDescription(CategoryTypes) })
    @IsNotEmpty()
    readonly category: number;

    @ApiProperty({ type: () => Number, description: EnumHelper.toDescription(UnitTypes) })
    @IsNotEmpty()
    readonly unit: number;

    @ApiProperty({ type: () => CreateRuleDto, required: true })
    @IsNotEmpty()
    readonly rule: CreateRuleDto;
}