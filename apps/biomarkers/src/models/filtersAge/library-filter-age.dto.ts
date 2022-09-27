import { ApiProperty } from '@nestjs/swagger';
import { LibraryFilterAge } from './library-filter-age.entity';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { AgeTypes } from '../../services/filterAges/age-types';


export class LibraryFilterAgeDto {
    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => Number, description: EnumHelper.toDescription(AgeTypes) })
    readonly age: number;

    constructor(entity: LibraryFilterAge) {
        this.id = entity.id;
        this.age = entity.age;
    }
}