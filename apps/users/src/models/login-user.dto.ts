import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly lifeTime: number;
}
