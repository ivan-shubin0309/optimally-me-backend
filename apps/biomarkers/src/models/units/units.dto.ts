import { ApiProperty } from '@nestjs/swagger';
import { UnitDto } from './unit.dto';
import { Unit } from './unit.entity';
import { PaginationDto } from '../pagination.dto';

export class UnitsDto {
    @ApiProperty({ type: () => [UnitDto] })
    readonly units: UnitDto[];

    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(units: Unit[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.units = units.map(unit => new UnitDto(unit));
    }
}