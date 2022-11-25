import { ApiProperty } from '@nestjs/swagger';
import { Biomarker } from '../../../biomarkers/src/models/biomarker.entity';
import { PaginationDto } from '../../../common/src/models/pagination.dto';
import { UserBiomarkerCounterDto } from './user-biomarker-counter.dto';
import { UserBiomarkerDto } from './user-biomarker.dto';

export class UserBiomarkersDto {
    @ApiProperty({ type: () => [UserBiomarkerDto] })
    readonly data: UserBiomarkerDto[];
    @ApiProperty({ type: () => UserBiomarkerCounterDto })
    readonly counters: UserBiomarkerCounterDto;
    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(biomarkers: Biomarker[], counters: UserBiomarkerCounterDto, pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = biomarkers.map(biomarker => new UserBiomarkerDto(biomarker));
        this.counters = counters;
    }
}
