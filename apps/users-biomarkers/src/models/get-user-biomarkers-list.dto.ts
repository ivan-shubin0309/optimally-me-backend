import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class GetUserBiomarkersListDto {
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
    @IsPositive()
    @Min(0)
    @Transform(({ value }) => Number(value))
    readonly categoryId: number;
}