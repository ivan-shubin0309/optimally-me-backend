import { ApiProperty } from '@nestjs/swagger';

export class HautAiUploadedPhotoDto {
    @ApiProperty({ type: () => String, required: true })
    readonly subjectId: string;

    @ApiProperty({ type: () => String, required: true })
    readonly batchId: string;

    @ApiProperty({ type: () => String, required: true })
    readonly uploadedFileId: string;

    @ApiProperty({ type: () => Number, required: true })
    skinResultId?: number;
}