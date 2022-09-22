import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class GetListDto {
    @ApiProperty({ type: () => Number, required: true, default: '100' })
    @IsInt()
    @Max(100)
    @Min(1)
    @Type(() => Number)
    readonly limit: string = '100';

    @ApiProperty({ type: () => Number, required: true, default: '0' })
    @IsInt()
    @Min(0)
    @Type(() => Number)
    readonly offset: string = '0';
}