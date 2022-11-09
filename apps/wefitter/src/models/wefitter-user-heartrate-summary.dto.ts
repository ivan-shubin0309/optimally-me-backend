import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WefitterHeartRateDto } from './wefitter-heart-rate.dto';

export class WefitterUserHeartrateSummaryDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly profile: string;

    @ApiProperty({ type: () => WefitterHeartRateDto, required: true })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => WefitterHeartRateDto)
    readonly data: WefitterHeartRateDto;
}
