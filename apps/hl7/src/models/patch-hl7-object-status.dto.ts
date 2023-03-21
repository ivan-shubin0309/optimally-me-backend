import { ApiProperty } from '@nestjs/swagger';
import { Hl7ObjectStatuses } from 'apps/common/src/resources/hl7/hl7-object-statuses';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class PatchHl7ObjectStatusDto {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(Hl7ObjectStatuses) })
    @IsNotEmpty()
    @IsNumber()
    @IsEnum([Hl7ObjectStatuses.verified])
    readonly status: number;
}