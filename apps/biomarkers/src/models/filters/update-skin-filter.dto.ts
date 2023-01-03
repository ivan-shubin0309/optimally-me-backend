import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { CreateSkinFilterDto } from './create-skin-filter.dto';

export class UpdateSkinFilterDto extends CreateSkinFilterDto {
    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @IsPositive()
    readonly id: number;
}