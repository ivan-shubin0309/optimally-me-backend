import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';


export class DeleteReactRecommendationDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    readonly userResultId: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    readonly recommendationId: number;
}