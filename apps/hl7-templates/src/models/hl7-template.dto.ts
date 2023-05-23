import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../common/src/base/base.dto';
import { DateFilterTypes } from '../../../common/src/resources/hl7-templates/date-filter-types';
import { Hl7ObjectStatuses } from '../../../common/src/resources/hl7/hl7-object-statuses';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { Hl7Template } from './hl7-template.entity';

export class Hl7TemplateDto extends BaseDto<Hl7Template> {
    constructor(entity: Hl7Template) {
        super(entity);
        this.userId = entity.userId;
        this.isPrivate = entity.isPrivate;
        this.name = entity.name;
        this.dateOfBirthStart = entity.dateOfBirthStart;
        this.dateOfBirthEnd = entity.dateOfBirthEnd;
        this.activatedAtStartDate = entity.activatedAtStartDate;
        this.activatedAtEndDate = entity.activatedAtEndDate;
        this.activatedAtFilterType = entity.activatedAtFilterType;
        this.sampleAtStartDate = entity.sampleAtStartDate;
        this.sampleAtEndDate = entity.sampleAtEndDate;
        this.sampleAtFilterType = entity.sampleAtFilterType;
        this.labReceivedAtStartDate = entity.labReceivedAtStartDate;
        this.labReceivedAtEndDate = entity.labReceivedAtEndDate;
        this.labReceivedAtFilterType = entity.labReceivedAtFilterType;
        this.resultAtStartDate = entity.resultAtStartDate;
        this.resultAtEndDate = entity.resultAtEndDate;
        this.resultAtFilterType = entity.resultAtFilterType;
        this.statuses = entity.statuses && entity.statuses.length
            ? entity.statuses.map(templateStatus => templateStatus.status)
            : undefined;
        this.searchString = entity.searchString;
        this.isFavourite = entity.isFavourite;
        this.activatedAtDaysCount = entity.activatedAtDaysCount;
        this.sampleAtDaysCount = entity.sampleAtDaysCount;
        this.labReceivedAtDaysCount = entity.labReceivedAtDaysCount;
        this.resultAtDaysCount = entity.resultAtDaysCount;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly userId: number;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isPrivate: boolean;

    @ApiProperty({ type: () => String, required: true })
    readonly name: string;

    @ApiProperty({ type: () => String, required: false })
    readonly dateOfBirthStart: string;

    @ApiProperty({ type: () => String, required: false })
    readonly dateOfBirthEnd: string;

    @ApiProperty({ type: () => String, required: false })
    readonly activatedAtStartDate: string;

    @ApiProperty({ type: () => String, required: false })
    readonly activatedAtEndDate: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(DateFilterTypes) })
    readonly activatedAtFilterType: DateFilterTypes;

    @ApiProperty({ type: () => String, required: false })
    readonly sampleAtStartDate: string;

    @ApiProperty({ type: () => String, required: false })
    readonly sampleAtEndDate: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(DateFilterTypes) })
    readonly sampleAtFilterType: DateFilterTypes;

    @ApiProperty({ type: () => String, required: false })
    readonly labReceivedAtStartDate: string;

    @ApiProperty({ type: () => String, required: false })
    readonly labReceivedAtEndDate: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(DateFilterTypes) })
    readonly labReceivedAtFilterType: DateFilterTypes;

    @ApiProperty({ type: () => String, required: false })
    readonly resultAtStartDate: string;

    @ApiProperty({ type: () => String, required: false })
    readonly resultAtEndDate: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(DateFilterTypes) })
    readonly resultAtFilterType: DateFilterTypes;

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(Hl7ObjectStatuses) })
    readonly statuses: Hl7ObjectStatuses[];

    @ApiProperty({ type: () => String, required: false })
    readonly searchString: string;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isFavourite: boolean;

    @ApiProperty({ type: () => Number, required: false })
    readonly activatedAtDaysCount: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly sampleAtDaysCount: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly labReceivedAtDaysCount: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly resultAtDaysCount: number;
}