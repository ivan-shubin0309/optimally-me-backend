import { ApiProperty } from '@nestjs/swagger';
import { userBiomarkersOrderTypes } from '../../../common/src/resources/usersBiomarkers/order-types';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { IsOnlyDate } from '../../../common/src/resources/common/is-only-date.decorator';
import { orderTypes } from '../../../common/src/resources/common/order-types';

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
    @IsOnlyDate()
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
}