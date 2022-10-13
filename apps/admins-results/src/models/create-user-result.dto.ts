import { IsNotEmpty, MaxLength, IsNumber, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResultDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    readonly biomarkerId: number;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @MaxLength(255)
    readonly name: string;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsNumber()
    readonly value: number;
}
