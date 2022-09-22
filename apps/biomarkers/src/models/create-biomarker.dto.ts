import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRuleDto } from './create-rule.dto';

export class CreateBiomarkerDto {
    @ApiProperty({ type: () => String, required: false })
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ type: () => Array, required: true })
    @IsNotEmpty()
    readonly alternativeNames: string[];

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    readonly category: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    readonly unit: number;

    @ApiProperty({ type: () => CreateRuleDto, required: false })
    @IsNotEmpty()
    readonly rule: CreateRuleDto;
}