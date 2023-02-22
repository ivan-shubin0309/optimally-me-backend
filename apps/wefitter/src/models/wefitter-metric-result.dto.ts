import { ApiProperty } from '@nestjs/swagger';
import { WefitterMetricResultType } from './wefitter-metric-result.type';

export class WefitterMetricResultDto {
    constructor(entity: WefitterMetricResultType) {
        this.value = entity.get('value') as number;
        this.date = entity.get('date') as string;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly value: number;

    @ApiProperty({ type: () => String, required: true })
    readonly date: string;
}