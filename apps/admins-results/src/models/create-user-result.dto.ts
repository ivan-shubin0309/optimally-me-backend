import { IsNotEmpty, MaxLength, IsNumber, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOnlyDate } from '../../../common/src/resources/common/is-only-date.decorator';
import { IsDateInPast } from '../../../common/src/resources/common/is-date-in-past.decorator';

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

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsOnlyDate()
    @IsDateInPast()
    readonly date: string;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    readonly unitId: number;
}
