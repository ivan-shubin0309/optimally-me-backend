import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WefitterDailySummaryDto } from './wefitter-daily-summary.dto';

export class WefitterUserDailySummaryDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly profile: string;

    @ApiProperty({ type: () => WefitterDailySummaryDto, required: true })
    @IsNotEmpty()
    @Type(() => WefitterDailySummaryDto)
    readonly data: WefitterDailySummaryDto;
}
