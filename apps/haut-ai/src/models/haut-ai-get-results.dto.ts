import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class HautAiGetResultsDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    readonly subjectId: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    readonly batchId: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    readonly uploadedFileId: string;
}