import { ApiProperty } from '@nestjs/swagger';
import { IsOnlyDate } from '../../../common/src/resources/common/is-only-date.decorator';
import { Transform, Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Hl7ObjectStatuses } from '../../../common/src/resources/hl7/hl7-object-statuses';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { orderTypes } from '../../../common/src/resources/common/order-types';
import { sortingFieldNames } from '../../../common/src/resources/hl7/sorting-field-names';

export class GetHl7ObjectListDto {
    @ApiProperty({ type: () => Number, required: true, default: 100 })
    @IsInt()
    @Max(100)
    @Min(1)
    @Transform(({ value }) => Number(value))
    readonly limit: number = 100;

    @ApiProperty({ type: () => Number, required: true, default: 0 })
    @IsInt()
    @Min(0)
    @Transform(({ value }) => Number(value))
    readonly offset: number = 0;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly search: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly activatedAtStartDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly activatedAtEndDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly sampleAtStartDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly sampleAtEndDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly labReceivedAtStartDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly labReceivedAtEndDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly resultAtStartDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly resultAtEndDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly dateOfBirthStartDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly dateOfBirthEndDate: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(Hl7ObjectStatuses) })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsNumber({}, { each: true })
    @IsEnum(Hl7ObjectStatuses)
    @Type(() => Number)
    @Transform(({ value }) => typeof value === 'number' ? [value] : value)
    readonly status: number;

    @ApiProperty({ type: () => String, required: false, default: 'createdAt', description: sortingFieldNames.join(', ') })
    @IsOptional()
    @IsString()
    @IsEnum(sortingFieldNames)
    readonly orderBy: string = 'createdAt';

    @ApiProperty({ type: () => String, required: false, default: 'desc', description: orderTypes.join(', ') })
    @IsOptional()
    @IsString()
    @IsEnum(orderTypes)
    readonly orderType: string = 'desc';
}