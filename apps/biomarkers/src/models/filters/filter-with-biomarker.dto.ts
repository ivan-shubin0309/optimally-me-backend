import { ApiProperty } from '@nestjs/swagger';
import { BiomarkerDto } from '../biomarker.dto';
import { FilterDto } from './filter.dto';
import { Filter } from './filter.entity';

export class FilterWithBiomarkerDto extends FilterDto {
    constructor(entity: Filter) {
        super(entity);

        this.biomarker = entity.biomarker && new BiomarkerDto(entity.biomarker);
    }

    @ApiProperty({ type: () => BiomarkerDto, required: false })
    readonly biomarker: BiomarkerDto;
}