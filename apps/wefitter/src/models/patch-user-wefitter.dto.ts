import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class PatchUserWefitterDto {
    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    readonly isAppleHealthConnected: boolean;

    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    readonly isSamsungHealthConnected: boolean;

    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    readonly isAndroidSdkConnected: boolean;
}