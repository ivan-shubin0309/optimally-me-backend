import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { AlternativeName } from './alternative-name.entity';

export class AlternativeNameDto extends BaseDto<AlternativeName> {
    constructor(entity: AlternativeName) {
        super(entity);
        this.name = entity.name;
        this.biomarkerId = entity.biomarkerId;
    }

    @ApiProperty({ type: () => String, required: true })
    readonly name: string;

    @ApiProperty({ type: () => String, required: true })
    readonly biomarkerId: number;
}