import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { StudyLink } from './study-link.entity';

export class StudyLinkDto extends BaseDto<StudyLink> {
    constructor(entity: StudyLink) {
        super(entity);
        this.filterBulletListId = entity.filterBulletListId;
        this.content = entity.content;
    }

    @ApiProperty({ type: () => Number, required: true })
    filterBulletListId: number;

    @ApiProperty({ type: () => String, required: true })
    content: string;
}