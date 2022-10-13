import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ConnectionRedirectDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly connection: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly error: string;
}