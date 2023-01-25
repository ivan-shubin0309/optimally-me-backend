import { MAX_USER_RESULT_AVARAGES } from '../../../common/src/resources/userResults/constants';
import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayNotEmpty, ArrayUnique, IsArray, IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOnlyDate } from '../../../common/src/resources/common/is-only-date.decorator';

export class GetUserResultAveragesDto {
    @ApiProperty({ type: () => [Number], required: true })
    @IsNotEmpty()
    @ArrayNotEmpty()
    @IsArray()
    @ArrayUnique()
    @ArrayMaxSize(MAX_USER_RESULT_AVARAGES)
    @IsPositive({ each: true })
    @IsInt({ each: true })
    @Type(() => Number)
    @Transform(({ value }) => typeof value === 'number' ? [value] : value)
    readonly biomarkerIds: number[];

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly startDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly endDate: string;
}