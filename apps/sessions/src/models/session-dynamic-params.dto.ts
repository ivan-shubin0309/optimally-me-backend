import { ApiProperty } from '@nestjs/swagger';

export class SessionDynamicParamsDto {
    @ApiProperty({ type: () => Boolean, required: true })
    readonly isDeviceVerified: boolean;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isAdditionalAuthenticationDeclined: boolean;

    constructor(data: any) {
        this.isDeviceVerified = data.isDeviceVerified;
        this.isAdditionalAuthenticationDeclined = data.isAdditionalAuthenticationDeclined;
    }
}