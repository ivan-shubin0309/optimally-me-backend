import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { BaseDto } from '../../../common/src/base/base.dto';
import { FeelingTypes } from '../../../common/src/resources/haut-ai/feeling-types';
import { UserSkinDiary } from './user-skin-diary.entity';

export class UserSkinDiaryDto extends BaseDto<UserSkinDiary> {
    constructor(entity: UserSkinDiary) {
        super(entity);

        this.userId = entity.userId;
        this.skinUserResultId = entity.skinUserResultId;
        this.feelingType = entity.feelingType;
        this.isWearingMakeUp = entity.isWearingMakeUp;
        this.notes = entity.notes;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly userId: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly skinUserResultId: number;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(FeelingTypes) })
    readonly feelingType: number;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isWearingMakeUp: boolean;

    @ApiProperty({ type: () => String, required: false })
    readonly notes: string;
}