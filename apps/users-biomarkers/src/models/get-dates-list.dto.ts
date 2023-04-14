import { ApiProperty } from '@nestjs/swagger';
import { BiomarkerTypes } from '../../../common/src/resources/biomarkers/biomarker-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { Transform, Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetDatesListDto {
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

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Transform(({ value }) => Number(value))
    readonly biomarkerId: number;

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(BiomarkerTypes), default: [BiomarkerTypes.blood] })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsEnum([BiomarkerTypes.blood, BiomarkerTypes.skin], { each: true })
    @Type(() => Number)
    @Transform(({ value }) => typeof value === 'number' ? [value] : value)
    readonly biomarkerType: number[] = [BiomarkerTypes.blood];
}