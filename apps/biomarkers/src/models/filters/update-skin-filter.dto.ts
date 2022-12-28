import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { CreateBloodFilterDto } from './create-blood-filter.dto';

export class UpdateSkinFilterDto extends CreateBloodFilterDto {
    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @IsPositive()
    readonly id: number;
}