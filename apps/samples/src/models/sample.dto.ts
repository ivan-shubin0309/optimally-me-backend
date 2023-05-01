import { ApiProperty } from '@nestjs/swagger';
import { TestKitTypes } from '../../../common/src/resources/hl7/test-kit-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { BaseDto } from '../../../common/src/base/base.dto';
import { Sample } from './sample.entity';

export class SampleDto extends BaseDto<Sample> {
    constructor(data: Sample, options?: { isFemaleLifecycleRequired: boolean }) {
        super(data);
        this.sampleId = data.sampleId;
        this.isActivated = data.isActivated;
        if (data.testKitType) {
            this.testKitTypes = data.testKitType;
        } else {
            this.testKitTypes = options?.isFemaleLifecycleRequired
                ? TestKitTypes.femaleHormones
                : TestKitTypes.default;
        }
    }

    @ApiProperty({ type: () => String, required: true })
    readonly sampleId: string;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isActivated: boolean;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(TestKitTypes) })
    readonly testKitTypes: number;
}