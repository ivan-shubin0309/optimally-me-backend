import { ApiProperty } from '@nestjs/swagger';
import { RecommendationTypes } from '../../../../common/src/resources/recommendations/recommendation-types';
import { ArrayNotEmpty, ArrayUnique, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { FilterGroupTypes } from '../../../../common/src/resources/filterGroups/filter-group-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { ValidateGroupRecommendationTypes } from '../../../../common/src/resources/filterGroups/validate-group-recommendation-types.decorator';
import { ICreateFilterGroup } from '../create-biomarker.interface';

export class CreateFilterGroupDto implements ICreateFilterGroup {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(FilterGroupTypes) })
    @IsNumber()
    @IsEnum(FilterGroupTypes)
    @IsNotEmpty()
    readonly type: number;

    @ApiProperty({ type: () => [Number], required: true, description: EnumHelper.toDescription(RecommendationTypes) })
    @ArrayNotEmpty()
    @ArrayUnique()
    @ValidateGroupRecommendationTypes({ each: true })
    readonly recommendationTypes: number[];
}