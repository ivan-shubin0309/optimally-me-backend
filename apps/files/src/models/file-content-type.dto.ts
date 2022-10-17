import { ApiProperty } from '@nestjs/swagger';
import { rules } from '../../../common/src/resources/files/files-validation-rules';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { FileTypes } from '../../../common/src/resources/files/file-types';

const fileContentTypes: string[] = Object
    .keys(rules.filesContentTypes)
    .reduce(
        (contentTypesArray, contentType) => contentTypesArray.concat(...rules.filesContentTypes[contentType].contentTypes),
        []
    );


export class FileContentTypeDto {
    @ApiProperty({ type: () => String, required: true, description: EnumHelper.toDescription(fileContentTypes) })
    @IsNotEmpty()
    @IsEnum(fileContentTypes)
    contentType: string;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(FileTypes) })
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(FileTypes)
    type: number;
}