import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../common/src/base/base.dto';
import { Sample } from './sample.entity';

export class SampleDto extends BaseDto<Sample> {
    constructor(data: Sample) {
        super(data);
        this.sampleId = data.sampleId;
        this.isActive = data.isActive;
    }

    @ApiProperty({ type: () => String, required: true })
    readonly sampleId: string;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isActive: boolean;
}