import { ApiProperty } from '@nestjs/swagger';
import { UserResult } from '../../../admins-results/src/models/user-result.entity';

export class UserResultAvarageDto {
    constructor(entity: UserResult) {
        this.biomarkerId = entity.get('biomarkerId');
        this.avg = entity.get('avg') as number;
        this.min = entity.get('min') as number;
        this.max = entity.get('max') as number;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly biomarkerId: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly avg: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly min: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly max: number;
}