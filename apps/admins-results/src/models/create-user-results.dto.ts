import { ArrayNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateUserResultDto } from './create-user-result.dto';
import { ArrayPropertyCombinationDistinct } from '../../../common/src/resources/common/array-property-combination-distinct.decorator';

export class CreateUserResultsDto {
    @ApiProperty({ type: () => [CreateUserResultDto], required: true })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayPropertyCombinationDistinct(['date', 'biomarkerId'])
    @ValidateNested()
    @Type(() => CreateUserResultDto)
    readonly results: CreateUserResultDto[];
}