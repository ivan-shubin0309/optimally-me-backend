import { ApiProperty } from '@nestjs/swagger';
import { orderTypes } from '../../../common/src/resources/common/order-types';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { userRecommendationsSortingFieldNames } from '../../../common/src/resources/recommendations/user-recommendations-field-names';
import { BiomarkerTypes } from 'apps/common/src/resources/biomarkers/biomarker-types';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';

export class GetUserRecommendationsDto {
    @ApiProperty({ type: () => Number, required: true, default: 100 })
    @IsInt()
    @Max(100)
    @Min(1)
    @Transform(({ value }) => Number(value))
    readonly limit: number = 100;

    @ApiProperty({ type: () => Number, required: true, default: 0 })
    @IsInt()
    @Min(0)
    @Transform(({ value }) => Number(value))
    readonly offset: number = 0;

    @ApiProperty({ type: () => String, required: false, default: 'priority', description: userRecommendationsSortingFieldNames.join(', ') })
    @IsOptional()
    @IsString()
    @IsEnum(userRecommendationsSortingFieldNames)
    readonly orderBy: string = 'priority';

    @ApiProperty({ type: () => String, required: false, default: 'desc', description: orderTypes.join(', ') })
    @IsOptional()
    @IsString()
    @IsEnum(orderTypes)
    readonly orderType: string = 'desc';

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(BiomarkerTypes) })
    @IsOptional()
    @IsNumber()
    @IsEnum([BiomarkerTypes.blood, BiomarkerTypes.skin])
    @Transform(({ value }) => Number(value))
    readonly biomarkerType: BiomarkerTypes;
}