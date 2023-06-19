import { ApiProperty } from '@nestjs/swagger';
import { DnaAgeResult } from '../../../dna-age/src/models/dna-age-result.entity';
import { PaginationDto } from '../../../common/src/models/pagination.dto';
import { DnaAgeResultDto } from './dna-age-result.dto';

export class DnaAgeResultsDto {
    @ApiProperty({ type: () => [DnaAgeResultDto] })
    readonly data: DnaAgeResultDto[];
    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(dnaAgeResults: DnaAgeResult[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = dnaAgeResults.map(dnaAgeResult => new DnaAgeResultDto(dnaAgeResult));
    }
}
