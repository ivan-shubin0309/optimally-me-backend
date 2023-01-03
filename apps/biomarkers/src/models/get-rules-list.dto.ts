import { ApiProperty } from '@nestjs/swagger';
import { BiomarkerTypes, ruleTypes } from '../../../common/src/resources/biomarkers/biomarker-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, Max, Min } from 'class-validator';

export class GetRulesListDto {
    @ApiProperty({ type: () => Number, required: true, default: 100 })
    @IsInt()
    @Max(100)
    @Min(1)
    @Transform(({ value }) => Number(value))
    readonly limit: number = 100;

    @ApiProperty({ type: () => Number, required: true, default: 0 })
    @IsInt()
    @Min(0)
    @Transform(({ value }) => Number(value))
    readonly offset: number = 0;

    @ApiProperty({
        type: () => Number,
        required: false,
        default: BiomarkerTypes.bloodRule,
        description: EnumHelper
            .toCollection(BiomarkerTypes)
            .filter(biomarkerType => ruleTypes.includes(biomarkerType.value))
            .map(biomarkerType => `${biomarkerType.key} - ${biomarkerType.value}`)
            .join(', ')
    })
    @IsInt()
    @IsEnum(ruleTypes)
    @Transform(({ value }) => Number(value))
    readonly ruleType: number = BiomarkerTypes.bloodRule;
}