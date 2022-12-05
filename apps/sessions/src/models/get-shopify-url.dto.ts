import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GetShopifyUrl {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly redirectUrl: string;
}