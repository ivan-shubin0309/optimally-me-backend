import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class PatchResultFileDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    @IsPositive()
    readonly resultFileId: number;
}