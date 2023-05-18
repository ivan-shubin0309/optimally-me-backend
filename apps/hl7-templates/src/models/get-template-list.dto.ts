import { ApiProperty } from '@nestjs/swagger';
import { ParseBoolean } from '../../../common/src/resources/common/parse-boolean.decorator';
import { sortingFieldNames } from '../../../common/src/resources/hl7-templates/sorting-field-names';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { orderTypes } from '../../../common/src/resources/common/order-types';

export class GetTemplateListDto {
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

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly search: string;

    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    @ParseBoolean()
    readonly isFavourite: boolean;

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
}