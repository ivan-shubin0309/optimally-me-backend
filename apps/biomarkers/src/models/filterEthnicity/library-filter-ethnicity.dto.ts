import { ApiProperty } from '@nestjs/swagger';
import { LibraryFilterEthnicity } from './library-filter-ethnicity.entity';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { EthnicityTypes } from '../../services/filterEthnicity/ethnicity-types';


export class LibraryFilterEthnicityDto {
    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => Number, description: EnumHelper.toDescription(EthnicityTypes) })
    readonly ethnicity: number;

    constructor(entity: LibraryFilterEthnicity) {
        this.id = entity.id;
        this.ethnicity = entity.ethnicity;
    }
}