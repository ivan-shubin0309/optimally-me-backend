import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../common/src/base/base.dto';
import { UserWefitter } from './user-wefitter.entity';

export class UserWefitterDto extends BaseDto<UserWefitter> {
    constructor(data: UserWefitter) {
        super(data);

        this.bearer = data.bearer;
        this.isAppleHealthConnected = data.isAppleHealthConnected;
        this.isSamsungHealthConnected = data.isSamsungHealthConnected;
        this.isAndroidSdkConnected = data.isAndroidSdkConnected;
    }

    @ApiProperty({ type: () => String, required: true })
    readonly bearer: string;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isAppleHealthConnected: boolean;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isSamsungHealthConnected: boolean;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isAndroidSdkConnected: boolean;
}