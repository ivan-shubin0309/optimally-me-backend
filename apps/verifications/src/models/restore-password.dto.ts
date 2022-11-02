import { ApiProperty } from '@nestjs/swagger';
import { Xor } from 'apps/common/src/resources/common/xor.decorator';
import { IsEmail, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class RestorePasswordDto {
    @ApiProperty({ type: () => String, required: true })
    @IsOptional()
    @IsEmail()
    @Xor('token')
    readonly email: string;

    @IsOptional()
    @IsString()
    readonly token: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    @IsPositive()
    readonly tokenLifeTime: number;
}