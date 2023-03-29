import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetRecommendationTagListDto {
    @ApiProperty({ type: () => Number, required: true, default: '100' })
    @IsNotEmpty()
    @IsInt()
    @Max(100)
    @Min(1)
    @Type(() => Number)
    @Transform(({ value }) => Number(value))
    readonly limit: number = 100;

    @ApiProperty({ type: () => Number, required: true, default: '0' })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @Transform(({ value }) => Number(value))
    readonly offset: number = 0;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly search: string;
}