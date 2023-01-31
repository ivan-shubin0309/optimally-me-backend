import { ApiProperty } from '@nestjs/swagger';
import { hautAiSkinTypes, SkinTypes } from '../../../common/src/resources/filters/skin-types';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { FeelingTypes } from '../../../common/src/resources/haut-ai/feeling-types';
import { Transform, TransformFnParams } from 'class-transformer';
import { NOTES_MAX_LENGTH } from '../../../common/src/resources/haut-ai/constants';

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

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(FeelingTypes) })
    @IsOptional()
    @IsNumber()
    @IsEnum(FeelingTypes)
    readonly feelingType: number;

    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    readonly isWearingMakeUp: boolean;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(NOTES_MAX_LENGTH)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly notes: string;
}