import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateFilterDto } from './create-filter.dto';
import { CreateInteractionDto } from './create-Interaction.dto';

export class CreateRuleDto {

    @ApiProperty({ type: () => String, required: false })
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ type: () => CreateFilterDto, required: true })
    @IsNotEmpty()
    readonly filters: CreateFilterDto[];

    @ApiProperty({ type: () => String, required: false })
    @IsNotEmpty()
    readonly summary: string;

    @ApiProperty({ type: () => String, required: false })
    @IsNotEmpty()
    readonly whatIsIt: string;

    @ApiProperty({ type: () => String, required: false })
    @IsNotEmpty()
    readonly risks: string;

    @ApiProperty({ type: () => String, required: false })
    @IsNotEmpty()
    readonly causes: string;

    @ApiProperty({ type: () => String, required: false })
    @IsNotEmpty()
    readonly whatCanDo: string;

    @ApiProperty({ type: () => Boolean, required: true })
    @IsNotEmpty()
    readonly interactionsIsOn: boolean;

    @ApiProperty({ type: () => CreateInteractionDto, required: false })
    @IsNotEmpty()
    readonly interactions: CreateInteractionDto[];
}