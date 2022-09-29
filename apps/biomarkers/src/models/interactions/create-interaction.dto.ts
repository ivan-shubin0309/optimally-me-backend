import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateInteractionDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsOptional()
    type: number;

    @ApiProperty({ type: () => String, required: true })
    @IsOptional()
    name: string;

    @ApiProperty({ type: () => String, required: true })
    @IsOptional()
    alsoKnowAs: string;

    @ApiProperty({ type: () => Number, required: true })
    @IsOptional()
    impact: number;

    @ApiProperty({ type: () => String, required: true })
    @IsOptional()
    effects: string;
}