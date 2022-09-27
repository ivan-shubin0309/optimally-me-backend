import { ApiProperty } from '@nestjs/swagger';
import { LibraryFilterSex } from './library-filter-sex.entity';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { SexTypes } from '../../services/filterSexes/sex-types';


export class LibraryFilterSexDto {
    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => Number, description: EnumHelper.toDescription(SexTypes) })
    readonly sex: number;

    constructor(entity: LibraryFilterSex) {
        this.id = entity.id;
        this.sex = entity.sex;
    }
}