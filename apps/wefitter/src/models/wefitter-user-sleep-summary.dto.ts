import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WefitterSleepDto } from './wefitter-sleep.dto';

export class WefitterUserSleepSummaryDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly profile: string;

    @ApiProperty({ type: () => WefitterSleepDto, required: true })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => WefitterSleepDto)
    readonly data: WefitterSleepDto;
}
