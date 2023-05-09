import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PutAuthCodeDto {
    @ApiProperty({ type: () => String, required: true })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly code: string;
}
