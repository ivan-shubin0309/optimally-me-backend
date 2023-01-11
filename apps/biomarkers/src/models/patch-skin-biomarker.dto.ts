import { IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PatchSkinBiomarkerDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsBoolean()
    readonly isActive: string;
}