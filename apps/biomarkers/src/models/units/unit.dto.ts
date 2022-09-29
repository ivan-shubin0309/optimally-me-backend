import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'apps/common/src/base/base.dto';
import { Unit } from './unit.entity';

export class UnitDto extends BaseDto<Unit> {
    @ApiProperty({ type: () => String, required: true })
    readonly unit: string;

    constructor(entity: Unit) {
        super(entity);
        this.unit = entity.unit;
    }
}