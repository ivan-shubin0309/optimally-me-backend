import { IsNotEmpty, MinLength, IsArray, ArrayMinSize, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateFilterDto } from '../filters/create-filter.dto';
import { CreateInteractionDto } from '../interactions/create-interaction.dto';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateRuleDto {

    @ApiProperty({ type: () => String, required: false })
    @MaxLength(100)
    readonly name: string;

    @ApiProperty({ type: () => [CreateFilterDto], required: true })
    @ArrayMinSize(1)
    @IsArray()
    @IsNotEmpty()
    readonly filters: CreateFilterDto[];

    @ApiProperty({ type: () => String, required: true })
    @MinLength(1)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    readonly summary: string;

    @ApiProperty({ type: () => String, required: false })
    readonly whatIsIt: string;

    @ApiProperty({ type: () => String, required: false })
    readonly whatAreTheRisks: string;

    @ApiProperty({ type: () => String, required: false })
    readonly whatAreTheCauses: string;

    @ApiProperty({ type: () => String, required: false })
    readonly whatCanYouDo: string;

    @ApiProperty({ type: () => Boolean, required: true })
    @IsBoolean()
    @IsNotEmpty()
    readonly interactionsIsOn: boolean;

    @ApiProperty({ type: () => [CreateInteractionDto], required: false })
    readonly interactions: CreateInteractionDto[];
}