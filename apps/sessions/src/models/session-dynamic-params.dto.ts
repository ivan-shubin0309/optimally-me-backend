import { ApiProperty } from '@nestjs/swagger';

export class SessionDynamicParamsDto {
    @ApiProperty({ type: () => Boolean, required: true })
    readonly isDeviceVerified: boolean;

    constructor(data: any) {
        this.isDeviceVerified = data.isDeviceVerified;
    }
}