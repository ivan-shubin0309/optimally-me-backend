import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, ValidateIf } from 'class-validator';
import { Xor } from '../../../common/src/resources/common/xor.decorator';

export class ResendEmailVerificationDto {
    @ApiProperty({ type: () => String, required: false })
    @Xor('token')
    @ValidateIf(obj => !obj.token)
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ type: () => String, required: false })
    @Xor('email')
    @ValidateIf(obj => !obj.email)
    @IsNotEmpty()
    readonly token: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    @IsPositive()
    readonly tokenLifeTime: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly queryString: string;
}
