import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/src/models/pagination.dto';
import { SampleDto } from './sample.dto';
import { Sample } from './sample.entity';

export class SamplesDto {
    @ApiProperty({ type: () => [SampleDto] })
    readonly data: SampleDto[];

    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(samples: Sample[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = samples.map(sample => new SampleDto(sample));
    }
}
