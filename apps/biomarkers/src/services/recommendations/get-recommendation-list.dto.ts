import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { RecommendationCategoryTypes } from '../../../../common/src/resources/recommendations/recommendation-category-types';

export class GetRecommendationListDto {
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

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(RecommendationCategoryTypes) })
    @IsInt()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    readonly category: string;
}