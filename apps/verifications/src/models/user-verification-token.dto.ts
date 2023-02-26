import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UserVerificationTokenDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly token: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly queryString: string;
}