import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../common/src/base/base.dto';
import { DnaAgeResult } from '../../../dna-age/src/models/dna-age-result.entity';

export class DnaAgeResultDto extends BaseDto<DnaAgeResult> {
    constructor(entity: DnaAgeResult) {
        super(entity);

        this.DNAmGrimAge2 = entity.DNAmGrimAge2;
        this.DNAmGrimAge2_percentile = entity.DNAmGrimAge2_percentile;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly DNAmGrimAge2: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly DNAmGrimAge2_percentile: number;
}