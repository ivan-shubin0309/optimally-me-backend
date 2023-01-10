import { ApiProperty } from '@nestjs/swagger';
import { ImpactStudyLinkTypes } from '../../../../common/src/resources/recommendation-impacts/impact-study-link-types';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { ImpactStudyLink } from './impact-study-link.entity';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';


export class ImpactStudyLinkDto extends BaseDto<ImpactStudyLink>{
    constructor(entity: ImpactStudyLink) {
        super(entity);

        this.recommendationImpactId = entity.recommendationImpactId;
        this.content = entity.content;
        this.type = entity.type;
        this.title = entity.title;
    }

    @ApiProperty({ type: () => Number, required: true })
    recommendationImpactId: number;

    @ApiProperty({ type: () => String, required: false })
    content: string;

    @ApiProperty({ type: () => String, required: false, description: EnumHelper.toDescription(ImpactStudyLinkTypes) })
    type: ImpactStudyLinkTypes;

    @ApiProperty({ type: () => String, required: false })
    title: string;
}