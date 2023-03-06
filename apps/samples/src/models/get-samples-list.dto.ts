import { ApiProperty } from '@nestjs/swagger';
import { ParseBoolean } from '../../../common/src/resources/common/parse-boolean.decorator';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetSamplesListDto {
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

    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    @ParseBoolean()
    readonly isActivated: boolean;
}