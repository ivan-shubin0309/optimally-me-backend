import { ApiProperty } from '@nestjs/swagger';
import { NOTES_MAX_LENGTH } from '../../../common/src/resources/haut-ai/constants';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PatchSkinDiaryNoteDto {
    @ApiProperty({ type: () => String, required: false })
    @IsNotEmpty()
    @IsString()
    @MaxLength(NOTES_MAX_LENGTH)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly notes: string;
}