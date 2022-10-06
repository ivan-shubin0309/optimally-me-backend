import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class RestorePasswordDto {

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    @IsPositive()
    readonly tokenLifeTime: number;
}