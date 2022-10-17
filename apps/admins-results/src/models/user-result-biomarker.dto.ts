import { ApiProperty } from '@nestjs/swagger';
import { Biomarker } from '../../../biomarkers/src/models/biomarker.entity';
import { BaseDto } from '../../../common/src/base/base.dto';
import { BiomarkerTypes } from '../../../common/src/resources/biomarkers/biomarker-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';

export class UserResultBiomarkerDto extends BaseDto<Biomarker> {
    constructor(entity: Biomarker) {
        super(entity);
        this.name = entity.name;
        this.type = entity.type;
        this.categoryId = entity.categoryId;
        this.unitId = entity.unitId;
        this.isDeleted = entity.isDeleted;
        this.ruleId = entity.templateId;
    }

    @ApiProperty({ type: () => Number, required: true })
    name: string;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(BiomarkerTypes) })
    type: number;

    @ApiProperty({ type: () => Number, required: true })
    categoryId: number;

    @ApiProperty({ type: () => Number, required: true })
    unitId: number;

    @ApiProperty({ type: () => Boolean, required: true })
    isDeleted: boolean;

    @ApiProperty({ type: () => Number, required: false })
    ruleId: number;
}