import { ApiProperty } from '@nestjs/swagger';
import { sortingFieldNames } from '../../../common/src/resources/biomarkers/sorting-field-names';
import { orderTypes } from '../../../common/src/resources/common/order-types';
import { Transform, Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class GetBiomarkerListDto {
    @ApiProperty({ type: () => Number, required: true, default: '100' })
    @IsNotEmpty()
    @IsInt()
    @Max(100)
    @Min(1)
    @Type(() => Number)
    readonly limit: string = '100';

    @ApiProperty({ type: () => Number, required: true, default: '0' })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    readonly offset: string = '0';

    @ApiProperty({ type: () => String, required: false, default: 'createdAt', description: sortingFieldNames.join(', ') })
    @IsOptional()
    @IsString()
    @IsEnum(sortingFieldNames)
    readonly orderBy: string = 'createdAt';

    @ApiProperty({ type: () => String, required: false, default: 'desc', description: orderTypes.join(', ') })
    @IsOptional()
    @IsString()
    @IsEnum(orderTypes)
    readonly orderType: string = 'desc';

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly search: string;

    @ApiProperty({ type: () => [Number], required: false })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsPositive({ each: true })
    @IsInt({ each: true })
    @Type(() => Number)
    @Transform(({ value }) => typeof value === 'number' ? [value] : value)
    readonly categoryIds: number[];
}