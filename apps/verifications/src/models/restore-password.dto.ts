import { ApiProperty } from '@nestjs/swagger';
import { Xor } from 'apps/common/src/resources/common/xor.decorator';
import { IsBoolean, IsEmail, IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class RestorePasswordDto {
    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsEmail()
    @Xor('token')
    readonly email: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly token: string;

    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    readonly isDesktop: boolean;

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