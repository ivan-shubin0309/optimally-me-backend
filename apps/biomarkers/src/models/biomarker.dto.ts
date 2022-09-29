import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../common/src/base/base.dto';
import { BiomarkerTypes } from '../../../common/src/resources/biomarkers/biomarker-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { AlternativeNameDto } from './alternativeNames/alternative-name.dto';
import { Biomarker } from './biomarker.entity';
import { FilterDto } from './filters/filter.dto';

export class BiomarkerDto extends BaseDto<Biomarker> {
    constructor(entity: Biomarker) {
        super(entity);

        this.name = entity.name;
        this.type = entity.type;
        this.categoryId = entity.categoryId;
        this.unitId = entity.unitId;
        this.summary = entity.summary;
        this.whatIsIt = entity.whatIsIt;
        this.whatAreTheCauses = entity.whatAreTheCauses;
        this.whatAreTheRisks = entity.whatAreTheRisks;
        this.whatCanYouDo = entity.whatCanYouDo;
        this.isDeleted = entity.isDeleted;
        this.alternativeNames = entity.alternativeNames && entity.alternativeNames.length
            ? entity.alternativeNames.map(alternativeName => new AlternativeNameDto(alternativeName))
            : undefined;
        this.filters = entity.filters && entity.filters.length
            ? entity.filters.map(filter => new FilterDto(filter))
            : undefined;
    }

    @ApiProperty({ type: () => Number, required: true })
    name: string;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(BiomarkerTypes) })
    type: number;

    @ApiProperty({ type: () => Number, required: true })
    categoryId: number;

    @ApiProperty({ type: () => Number, required: true })
    unitId: number;

    @ApiProperty({ type: () => String, required: false })
    summary: string;

    @ApiProperty({ type: () => String, required: false })
    whatIsIt: string;

    @ApiProperty({ type: () => String, required: false })
    whatAreTheCauses: string;

    @ApiProperty({ type: () => String, required: false })
    whatAreTheRisks: string;

    @ApiProperty({ type: () => String, required: false })
    whatCanYouDo: string;

    @ApiProperty({ type: () => Boolean, required: true })
    isDeleted: boolean;

    @ApiProperty({ type: () => [AlternativeNameDto], required: false })
    alternativeNames: AlternativeNameDto[];

    @ApiProperty({ type: () => [FilterDto], required: false })
    filters: FilterDto[];
}