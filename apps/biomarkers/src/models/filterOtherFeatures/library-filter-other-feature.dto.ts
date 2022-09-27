import { ApiProperty } from '@nestjs/swagger';
import { LibraryFilterOtherFeature } from './library-filter-other-feature.entity';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { OtherFeatureTypes } from '../../services/filterOtherFeatures/other-feature-types';


export class LibraryFilterOtherFeatureDto {
    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => Number, description: EnumHelper.toDescription(OtherFeatureTypes) })
    readonly otherFeature: number;

    constructor(entity: LibraryFilterOtherFeature) {
        this.id = entity.id;
        this.otherFeature = entity.otherFeature;
    }
}