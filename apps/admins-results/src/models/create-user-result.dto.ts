import { IsNotEmpty, IsNumber, IsInt, IsPositive, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOnlyDate } from '../../../common/src/resources/common/is-only-date.decorator';
import { IsDateInPast } from '../../../common/src/resources/common/is-date-in-past.decorator';
import { resultsValidationRules } from '../../../common/src/resources/results/results-validation-rules';
import { NumberMaxCharacters } from '../../../common/src/resources/common/number-max-characters';

export class CreateUserResultDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    readonly biomarkerId: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsNumber()
    @NumberMaxCharacters(resultsValidationRules.maxValue)
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
