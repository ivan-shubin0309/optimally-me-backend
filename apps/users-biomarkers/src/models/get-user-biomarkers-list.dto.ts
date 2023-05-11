import { ApiProperty } from '@nestjs/swagger';
import { userBiomarkersOrderTypes } from '../../../common/src/resources/usersBiomarkers/order-types';
import { Transform, Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsBoolean, IsDate, IsDateString, IsEnum, IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { IsOnlyDate } from '../../../common/src/resources/common/is-only-date.decorator';
import { orderTypes } from '../../../common/src/resources/common/order-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { RecommendationTypes } from '../../../common/src/resources/recommendations/recommendation-types';
import { ParseBoolean } from '../../../common/src/resources/common/parse-boolean.decorator';
import { NUMBER_OF_LAST_USER_RESULTS } from '../../../common/src/resources/usersBiomarkers/constants';
import { BiomarkerTypes } from 'apps/common/src/resources/biomarkers/biomarker-types';

export class GetUserBiomarkersListDto {
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

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Min(0)
    @Transform(({ value }) => Number(value))
    readonly categoryId: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsDateString()
    readonly afterDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsDateString()
    readonly beforeDate: string;

    @ApiProperty({ type: () => String, required: false, default: 'deviation', description: userBiomarkersOrderTypes.join(', ') })
    @IsOptional()
    @IsEnum(userBiomarkersOrderTypes)
    readonly orderBy: string = 'deviation';

    @ApiProperty({ type: () => String, required: false, default: 'desc', description: orderTypes.join(', ') })
    @IsOptional()
    @IsString()
    @IsEnum(orderTypes)
    readonly orderType: string = 'desc';

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly search: string;

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(RecommendationTypes) })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsEnum(RecommendationTypes, { each: true })
    @Type(() => Number)
    @Transform(({ value }) => typeof value === 'number' ? [value] : value)
    readonly status: number[];

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly searchByResult: string;

    @ApiProperty({ type: () => Boolean, required: false, default: false })
    @IsOptional()
    @IsBoolean()
    @ParseBoolean()
    readonly isOnlyTested: boolean = false;

    @ApiProperty({ type: () => Number, required: false, default: NUMBER_OF_LAST_USER_RESULTS })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Min(1)
    @Transform(({ value }) => Number(value))
    readonly maxResultsReturned: number = NUMBER_OF_LAST_USER_RESULTS;

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(BiomarkerTypes), default: [BiomarkerTypes.blood] })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsEnum([BiomarkerTypes.blood, BiomarkerTypes.skin], { each: true })
    @Type(() => Number)
    @Transform(({ value }) => typeof value === 'number' ? [value] : value)
    readonly biomarkerType: number[] = [BiomarkerTypes.blood];
}