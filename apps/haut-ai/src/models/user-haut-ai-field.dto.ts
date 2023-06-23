import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../common/src/base/base.dto';
import { UserHautAiField } from './user-haut-ai-field.entity';

export class UserHautAiFieldDto extends BaseDto<UserHautAiField> {
    constructor(entity: UserHautAiField) {
        super(entity);

        this.userId = entity.userId;
        this.hautAiSubjectId = entity.hautAiSubjectId;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly userId: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly hautAiSubjectId: string;
}