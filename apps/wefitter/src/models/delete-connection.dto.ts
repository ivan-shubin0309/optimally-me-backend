import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class DeleteConnectionDto {
    @ApiProperty({ type: () => String, required: true })
    @Type(() => String)
    @IsNotEmpty()
    readonly connectionSlug: string;

    @ApiProperty({ type: () => Boolean, required: true, default: false })
    @IsNotEmpty()
    @Type(() => Boolean)
    readonly deleteData: boolean;
}