import { ArrayNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateUserResultDto } from './create-user-result.dto';

export class CreateUserResultsDto {
    @ApiProperty({ type: () => [CreateUserResultDto], required: true })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested()
    @Type(() => CreateUserResultDto)
    readonly results: CreateUserResultDto[];
}