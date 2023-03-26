import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'apps/common/src/base/base.dto';
import { UserCode } from './user-code.entity';

export class UserCodeDto extends BaseDto<UserCode> {
    constructor(userCode: UserCode) {
        super(userCode);
        this.userId = userCode.userId;
        this.code = userCode.code;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly userId: number;

    @ApiProperty({ type: () => String, required: true })
    readonly code: string;
}