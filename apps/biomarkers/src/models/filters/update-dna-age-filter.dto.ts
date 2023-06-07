import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { CreateDnaAgeFilterDto } from './create-dna-age-filter.dto';

export class UpdateDnaAgeFilterDto extends CreateDnaAgeFilterDto {
    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @IsPositive()
    readonly id: number;
}