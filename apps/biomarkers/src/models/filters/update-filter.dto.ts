import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { CreateFilterDto } from './create-filter.dto';

export class UpdateFilterDto extends CreateFilterDto {
    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @IsPositive()
    readonly id: number;
}