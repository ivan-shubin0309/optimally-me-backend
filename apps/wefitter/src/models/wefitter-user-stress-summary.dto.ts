import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WefitterStressSummaryDto } from './wefitter-stress-summary.dto';

export class WefitterUserStressSummaryDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly profile: string;

    @ApiProperty({ type: () => WefitterStressSummaryDto, required: true })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => WefitterStressSummaryDto)
    readonly data: WefitterStressSummaryDto;
}
