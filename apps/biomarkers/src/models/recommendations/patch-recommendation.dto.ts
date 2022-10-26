import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PatchRecommendationDto {
    @ApiProperty({ type: () => Boolean })
    @IsNotEmpty()
    @IsBoolean()
    readonly isArchived: boolean;
}