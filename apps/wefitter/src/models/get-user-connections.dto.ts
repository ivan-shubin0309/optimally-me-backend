import { ApiProperty } from '@nestjs/swagger';
import { ParseBoolean } from '../../../common/src/resources/common/parse-boolean.decorator';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetUserConnectionsDto {
    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly redirect: string;

    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    @ParseBoolean()
    readonly redirectOnError: boolean;
}