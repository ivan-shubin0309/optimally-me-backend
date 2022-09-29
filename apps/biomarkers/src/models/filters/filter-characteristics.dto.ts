import { ApiProperty } from '@nestjs/swagger';
import { CollectionDto } from 'apps/common/src/models/enum-collecction.dto';

export class FilterCharacteristicsDto {
    @ApiProperty({ type: () => [CollectionDto] })
    readonly allSexTypes: CollectionDto[];

    @ApiProperty({ type: () => [CollectionDto] })
    readonly allAgeTypes: CollectionDto[];

    @ApiProperty({ type: () => [CollectionDto] })
    readonly allEthnicityTypes: CollectionDto[];

    @ApiProperty({ type: () => [CollectionDto] })
    readonly allOtherFeatureTypes: CollectionDto[];

    constructor(allSexTypes: CollectionDto[], allAgeTypes: CollectionDto[], allEthnicityTypes: CollectionDto[], allOtherFeatureTypes: CollectionDto[]) {
        this.allSexTypes = allSexTypes;
        this.allAgeTypes = allAgeTypes;
        this.allEthnicityTypes = allEthnicityTypes;
        this.allOtherFeatureTypes = allOtherFeatureTypes;
    }
}