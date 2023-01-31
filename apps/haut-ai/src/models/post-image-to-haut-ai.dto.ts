import { ApiProperty } from '@nestjs/swagger';
import { hautAiSkinTypes, SkinTypes } from '../../../common/src/resources/filters/skin-types';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';

export class PostImageToHautAiDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    readonly fileId: number;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(SkinTypes) })
    @IsOptional()
    @IsNumber()
    @IsEnum(hautAiSkinTypes)
    readonly skinType: number;
}