import { rules } from '../../../common/src/resources/files/files-validation-rules';
import { ArrayMaxSize, ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { FileContentTypeDto } from './file-content-type.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilesContentTypesDto {
    @ApiProperty({ type: () => [FileContentTypeDto] })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMaxSize(rules.maxUploadFiles)
    @ValidateNested()
    @Type(() => FileContentTypeDto)
    files: FileContentTypeDto[];
}