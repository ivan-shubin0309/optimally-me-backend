import { ApiProperty } from '@nestjs/swagger';
import { Unit } from './unit.entity';

export class UnitDto {
    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => String, required: true })
    readonly unit: string;

    constructor(entity: Unit) {
        this.id = entity.id;
        this.unit = entity.unit;
    }
}