import { ApiProperty } from '@nestjs/swagger';
import { SAMPLE_CODE_LENGTH } from '../../../common/src/resources/samples/constants';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ActivateSampleDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(SAMPLE_CODE_LENGTH)
    @Type(() => String)
    readonly sampleId: string;
}