import { ApiProperty } from '@nestjs/swagger';

export class WefitterHeartRateDto {

    @ApiProperty({ type: () => Number, required: false })
    readonly min: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly max: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly average: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly resting: number;
}
