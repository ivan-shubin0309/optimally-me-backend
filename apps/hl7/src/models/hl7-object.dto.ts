import { ApiProperty } from '@nestjs/swagger';
import { SexTypes } from '../../../common/src/resources/filters/sex-types';
import { Hl7ObjectStatuses } from '../../../common/src/resources/hl7/hl7-object-statuses';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { BaseDto } from '../../../common/src/base/base.dto';
import { Hl7Object } from './hl7-object.entity';
import { FileDto } from 'apps/files/src/models/file.dto';

export class Hl7ObjectDto extends BaseDto<Hl7Object> {
    constructor(data: Hl7Object) {
        super(data);
        this.userId = data.userId;
        this.lab = data.lab;
        this.orderId = data.orderId;
        this.testProductName = data.testProductName;
        this.sampleCode = data.sampleCode;
        this.status = data.status;
        this.email = data.email;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.dateOfBirth = data.dateOfBirth;
        this.sex = data.sex;
        this.activatedAt = data.activatedAt;
        this.sampleAt = data.sampleAt;
        this.labReceivedAt = data.labReceivedAt;
        this.resultAt = data.resultAt;
        this.isQuizCompleted = data.isQuizCompleted;
        this.labId = data.labId;
        this.abnormalResults = data.abnormalResults;
        this.failedTests = data.failedTests;
        this.toFollow = data.toFollow;
        this.file = data.file
            ? new FileDto(data.file)
            : undefined;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly userId: number;

    @ApiProperty({ type: () => String, required: false })
    readonly lab: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly orderId: number;

    @ApiProperty({ type: () => String, required: false })
    readonly testProductName: string;

    @ApiProperty({ type: () => String, required: false })
    readonly sampleCode: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(Hl7ObjectStatuses) })
    readonly status: number;

    @ApiProperty({ type: () => String, required: false })
    readonly email: string;

    @ApiProperty({ type: () => String, required: false })
    readonly firstName: string;

    @ApiProperty({ type: () => String, required: false })
    readonly lastName: string;

    @ApiProperty({ type: () => String, required: false })
    readonly dateOfBirth: string;

    @ApiProperty({ type: () => String, required: false, description: EnumHelper.toDescription(SexTypes) })
    readonly sex: number;

    @ApiProperty({ type: () => String, required: false })
    readonly activatedAt: string;

    @ApiProperty({ type: () => String, required: false })
    readonly sampleAt: string;

    @ApiProperty({ type: () => String, required: false })
    readonly labReceivedAt: string;

    @ApiProperty({ type: () => String, required: false })
    readonly resultAt: string;

    @ApiProperty({ type: () => Boolean, required: false })
    readonly isQuizCompleted: boolean;

    @ApiProperty({ type: () => String, required: false })
    readonly labId: string;

    @ApiProperty({ type: () => String, required: false })
    readonly abnormalResults: string;

    @ApiProperty({ type: () => String, required: false })
    readonly failedTests: string;

    @ApiProperty({ type: () => String, required: false })
    readonly toFollow: string;

    @ApiProperty({ type: () => File, required: false })
    readonly file: FileDto;
}