import { ApiProperty } from '@nestjs/swagger';
import { orderTypes } from '../../../common/src/resources/common/order-types';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { dnaAgeResultsOrderTypes } from '../../../common/src/resources/dna-age/dna-age-results-order-types';

export class GetResultsByDnaAgeIdDto {
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

    @ApiProperty({ type: () => String, required: false, default: 'name', description: dnaAgeResultsOrderTypes.join(', ') })
    @IsOptional()
    @IsEnum(dnaAgeResultsOrderTypes)
    readonly orderBy: string = 'name';

    @ApiProperty({ type: () => String, required: false, default: 'desc', description: orderTypes.join(', ') })
    @IsOptional()
    @IsString()
    @IsEnum(orderTypes)
    readonly orderType: string = 'desc';
}