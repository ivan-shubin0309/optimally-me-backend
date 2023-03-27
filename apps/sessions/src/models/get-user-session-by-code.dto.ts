import { ApiProperty } from '@nestjs/swagger';
import { USER_CODE_LENGTH } from 'apps/common/src/resources/user-codes/constants';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GetUserSessionByCodeDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(USER_CODE_LENGTH)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly code: string;
}