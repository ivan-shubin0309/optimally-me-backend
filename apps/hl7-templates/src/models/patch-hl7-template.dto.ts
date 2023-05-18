import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PatchHl7TemplateDto {
    @ApiProperty({ type: () => Boolean, required: true })
    @IsNotEmpty()
    @IsBoolean()
    readonly isFavourite: boolean;
}