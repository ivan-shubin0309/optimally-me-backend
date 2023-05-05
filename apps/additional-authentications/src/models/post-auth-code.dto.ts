import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostAuthCodeDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    readonly code: string;
}
