import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { IsOnlyDate } from '../../../common/src/resources/common/is-only-date.decorator';

export class GetUserResultsDto {
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
    @IsOnlyDate()
    readonly startDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly endDate: string;
}