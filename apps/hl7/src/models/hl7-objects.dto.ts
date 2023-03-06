import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/src/models/pagination.dto';
import { Hl7ObjectDto } from './hl7-object.dto';
import { Hl7Object } from './hl7-object.entity';

export class Hl7ObjectsDto {
    @ApiProperty({ type: () => [Hl7ObjectDto] })
    readonly data: Hl7ObjectDto[];

    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(hl7Objects: Hl7Object[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = hl7Objects.map(hl7Object => new Hl7ObjectDto(hl7Object));
    }
}
