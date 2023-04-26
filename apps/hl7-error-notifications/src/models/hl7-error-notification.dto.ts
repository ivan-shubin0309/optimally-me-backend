import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../common/src/base/base.dto';
import { Hl7ErrorNotification } from './hl7-error-notification.entity';

export class Hl7ErrorNotificationDto extends BaseDto<Hl7ErrorNotification> {
    constructor(entity: Hl7ErrorNotification) {
        super(entity);

        this.hl7ObjectId = entity.hl7ObjectId;
        this.message = entity.message;
        this.isResolved = entity.get('isResolved');
        this.sampleCode = entity.hl7Object
            ? entity.hl7Object.sampleCode
            : undefined;
        this.isMultipleError = entity.get('isMultipleError');
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly hl7ObjectId: number;

    @ApiProperty({ type: () => String, required: true })
    readonly message: string;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isResolved: boolean;

    @ApiProperty({ type: () => String, required: false })
    readonly sampleCode: string;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isMultipleError: boolean;
}