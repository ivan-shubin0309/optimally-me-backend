import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { RecommendationCategoryTypes } from '../../../../common/src/resources/recommendations/recommendation-category-types';
import { sortingFieldNames } from '../../../../common/src/resources/recommendations/sorting-field-names';
import { orderTypes } from '../../../../common/src/resources/common/order-types';
import { ParseBoolean } from '../../../../common/src/resources/common/parse-boolean.decorator';

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

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(RecommendationCategoryTypes) })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsNumber({}, { each: true })
    @IsEnum(RecommendationCategoryTypes, { each: true })
    @Type(() => Number)
    @Transform(({ value }) => typeof value === 'number' ? [value] : value)
    readonly category: number[];

    @ApiProperty({ type: () => String, required: false, default: 'createdAt', description: sortingFieldNames.join(', ') })
    @IsOptional()
    @IsString()
    @IsEnum(sortingFieldNames)
    readonly orderBy: string = 'createdAt';

    @ApiProperty({ type: () => String, required: false, default: 'desc', description: orderTypes.join(', ') })
    @IsOptional()
    @IsString()
    @IsEnum(orderTypes)
    readonly orderType: string = 'desc';

    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    @ParseBoolean()
    readonly isArchived: boolean;
}