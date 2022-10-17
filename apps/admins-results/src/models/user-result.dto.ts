import { ApiProperty } from '@nestjs/swagger';
import { UnitDto } from 'apps/biomarkers/src/models/units/unit.dto';
import { BaseDto } from 'apps/common/src/base/base.dto';
import { UserResult } from './user-result.entity';

export class UserResultDto extends BaseDto<UserResult> {
    constructor(data: UserResult) {
        super(data);
        this.biomarkerId = data.biomarkerId;
        this.userId = data.userId;
        this.name = data.name;
        this.value = data.value;
        this.date = data.date;
        this.unitId = data.unitId;
        this.unit = data.unit && new UnitDto(data.unit);
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly userId: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly biomarkerId: number;

    @ApiProperty({ type: () => String, required: true })
    readonly name: string;

    @ApiProperty({ type: () => Number, required: true })
    readonly value: number;

    @ApiProperty({ type: () => String, required: true })
    readonly date: string;

    @ApiProperty({ type: () => Number, required: true })
    readonly unitId: number;

    @ApiProperty({ type: () => UnitDto, required: true })
    readonly unit: UnitDto;
}