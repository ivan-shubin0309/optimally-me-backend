import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/src/models/pagination.dto';
import { BiomarkerDto } from './biomarker.dto';
import { Biomarker } from './biomarker.entity';

export class BiomarkersDto {
    @ApiProperty({ type: () => [BiomarkerDto] })
    readonly data: BiomarkerDto[];
    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(biomarkers: Biomarker[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = biomarkers.map(biomarker => new BiomarkerDto(biomarker));
    }
}
