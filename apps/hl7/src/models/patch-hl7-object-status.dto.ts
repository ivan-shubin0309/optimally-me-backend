import { ApiProperty } from '@nestjs/swagger';
import { Hl7ObjectStatuses } from '../../../common/src/resources/hl7/hl7-object-statuses';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { hl7ValidationRules } from '../../../common/src/resources/hl7/hl7-validation-rules';
import { RequiredIf } from '../../../common/src/resources/common/required-if.decorator';

export class PatchHl7ObjectStatusDto {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(Hl7ObjectStatuses) })
    @IsNotEmpty()
    @IsNumber()
    @IsEnum([Hl7ObjectStatuses.verified, Hl7ObjectStatuses.canceled])
    readonly status: number;

    @ApiProperty({ type: () => String, required: false })
    @RequiredIf('status', Hl7ObjectStatuses.canceled)
    @IsOptional()
    @IsString()
    @MaxLength(hl7ValidationRules.cancellationReasonMaxLength)
    @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : value?.toString()?.trim())
    readonly cancellationReason: string;
}