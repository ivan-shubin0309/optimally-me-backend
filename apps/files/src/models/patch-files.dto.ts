import { rules } from '../../../common/src/resources/files/files-validation-rules';
import { ArrayMaxSize, ArrayNotEmpty, ArrayUnique, IsArray, IsInt, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PatchFilesDto {
    @ApiProperty({ type: () => [Number] })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMaxSize(rules.maxUploadFiles)
    @IsNumber({}, { each: true })
    @IsPositive({ each: true })
    @IsInt({ each: true })
    @ArrayUnique()
    fileIds: number[];
}