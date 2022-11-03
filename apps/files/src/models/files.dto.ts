import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from './file.dto';
import { File } from './file.entity';

export class FilesDto {
    constructor(files: File[]) {
        this.files = files.map(file => new FileDto(file));
    }

    @ApiProperty({ type: () => [FileDto], required: true })
    readonly files: FileDto[];
}