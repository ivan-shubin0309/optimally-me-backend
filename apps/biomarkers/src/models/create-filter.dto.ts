import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RangesDto } from './ranges.dto';
import { RecommendationsDto } from './recommendations.dto';

export class CreateFilterDto {

    @ApiProperty({ type: () => String, required: false })
    @IsNotEmpty()
    readonly filterName: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsNotEmpty()
    readonly sex: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsNotEmpty()
    readonly age: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsNotEmpty()
    readonly ethnicity: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsNotEmpty()
    readonly otherFilters: number;

    @ApiProperty({ type: () => RangesDto, required: false })
    @IsNotEmpty()
    readonly ranges: RangesDto;

    @ApiProperty({ type: () => RecommendationsDto, required: false })
    @IsNotEmpty()
    readonly recommendations: RecommendationsDto;
}