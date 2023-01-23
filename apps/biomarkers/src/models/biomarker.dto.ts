import { ApiProperty } from '@nestjs/swagger';
import { BiomarkerSexTypes } from '../../../common/src/resources/biomarkers/biomarker-sex-types';
import { BaseDto } from '../../../common/src/base/base.dto';
import { BiomarkerTypes } from '../../../common/src/resources/biomarkers/biomarker-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { AlternativeNameDto } from './alternativeNames/alternative-name.dto';
import { Biomarker } from './biomarker.entity';
import { CategoryDto } from './categories/category.dto';
import { FilterDto } from './filters/filter.dto';
import { UnitDto } from './units/unit.dto';
import { HautAiMetricTypes } from '../../../common/src/resources/haut-ai/haut-ai-metric-types';

export class BiomarkerDto extends BaseDto<Biomarker> {
    constructor(entity: Biomarker) {
        super(entity);

        this.name = entity.name;
        this.label = entity.label;
        this.shortName = entity.shortName;
        this.type = entity.type;
        this.categoryId = entity.categoryId;
        this.unitId = entity.unitId;
        this.isDeleted = entity.isDeleted;
        this.sex = entity.sex;
        this.alternativeNames = entity.alternativeNames && entity.alternativeNames.length
            ? entity.alternativeNames.map(alternativeName => new AlternativeNameDto(alternativeName))
            : undefined;
        this.filters = entity.filters && entity.filters.length
            ? entity.filters.map(filter => new FilterDto(filter))
            : undefined;
        this.unit = entity.unit
            ? new UnitDto(entity.unit)
            : undefined;
        this.category = entity.category
            ? new CategoryDto(entity.category)
            : undefined;

        if (entity.rule) {
            this.ruleId = entity.rule.id;
            this.ruleName = entity.rule.name;
        }
        this.isActive = entity.isActive;
        this.hautAiMetricType = entity.hautAiMetricType;
    }

    @ApiProperty({ type: () => String, required: true })
    name: string;

    @ApiProperty({ type: () => String, required: false })
    label: string;

    @ApiProperty({ type: () => String, required: false })
    shortName: string;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(BiomarkerTypes) })
    type: number;

    @ApiProperty({ type: () => Number, required: true })
    categoryId: number;

    @ApiProperty({ type: () => Number, required: true })
    unitId: number;

    @ApiProperty({ type: () => Boolean, required: true })
    isDeleted: boolean;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(BiomarkerSexTypes) })
    sex: number;

    @ApiProperty({ type: () => [AlternativeNameDto], required: false })
    alternativeNames: AlternativeNameDto[];

    @ApiProperty({ type: () => [FilterDto], required: false })
    filters: FilterDto[];

    @ApiProperty({ type: () => UnitDto, required: false })
    unit: UnitDto;

    @ApiProperty({ type: () => CategoryDto, required: false })
    category: CategoryDto;

    @ApiProperty({ type: () => Number, required: false })
    ruleId: number;

    @ApiProperty({ type: () => String, required: false })
    ruleName: string;

    @ApiProperty({ type: () => Boolean, required: true })
    isActive: boolean;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(HautAiMetricTypes) })
    hautAiMetricType: number;
}