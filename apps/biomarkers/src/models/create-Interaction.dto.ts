import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInteractionDto {

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    readonly type: number;

    @ApiProperty({ type: () => String, required: false })
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ type: () => String, required: false })
    @IsNotEmpty()
    readonly alsoKnowAs: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsNotEmpty()
    readonly impact: number;

    @ApiProperty({ type: () => String, required: false })
    @IsNotEmpty()
    readonly effects: string;
}