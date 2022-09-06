import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ type: () => String, required: false })
    readonly username: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly password: string;
}
