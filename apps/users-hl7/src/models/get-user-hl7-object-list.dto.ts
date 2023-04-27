import { ApiProperty } from '@nestjs/swagger';
import { Hl7ObjectStatuses } from '../../../common/src/resources/hl7/hl7-object-statuses';
import { Transform, Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';

export class GetUserHl7ObjectListDto {
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

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(Hl7ObjectStatuses) })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsEnum(Hl7ObjectStatuses, { each: true })
    @Type(() => Number)
    @Transform(({ value }) => typeof value === 'number' ? [value] : value)
    readonly status: number[];
}