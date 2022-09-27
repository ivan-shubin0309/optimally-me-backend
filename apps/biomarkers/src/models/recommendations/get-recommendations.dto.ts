import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { RecommendationCategoryTypes } from '../../services/recommendations/recommendation-category-types';

export class GetListRecommendationsDto {
    @ApiProperty({ type: () => Number, required: true, default: '100' })
    @IsInt()
    @Max(100)
    @Min(1)
    @Type(() => Number)
    readonly limit: string = '100';

    @ApiProperty({ type: () => Number, required: true, default: '0' })
    @IsInt()
    @Min(0)
    @Type(() => Number)
    readonly offset: string = '0';

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly search: string;

    @ApiProperty({ type: () => Number, required: true, default: '0' })
    @IsInt()
    @Max(5)
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    readonly category: string = '0';
}