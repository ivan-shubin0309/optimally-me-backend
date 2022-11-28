import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from '../../../biomarkers/src/models/categories/category.dto';
import { UnitDto } from '../../../biomarkers/src/models/units/unit.dto';
import { UserResultDto } from '../../../admins-results/src/models/user-result.dto';
import { Biomarker } from '../../../biomarkers/src/models/biomarker.entity';
import { BaseDto } from '../../../common/src/base/base.dto';

export class UserBiomarkerDto extends BaseDto<Biomarker> {
    constructor(entity: Biomarker) {
        super(entity);

        this.name = entity.name;
        this.label = entity.label;
        this.shortName = entity.shortName;
        this.categoryId = entity.categoryId;
        this.unitId = entity.unitId;
        this.resultsCount = entity.resultsCount;
        this.userResults = entity.userResults && entity.userResults.length
            ? entity.userResults.map(userResult => new UserResultDto(userResult))
            : undefined;
        this.unit = entity.unit
            ? new UnitDto(entity.unit)
            : undefined;
        this.category = entity.category
            ? new CategoryDto(entity.category)
            : undefined;
    }

    @ApiProperty({ type: () => String, required: true })
    readonly name: string;

    @ApiProperty({ type: () => String, required: true })
    readonly label: string;

    @ApiProperty({ type: () => String, required: true })
    readonly shortName: string;

    @ApiProperty({ type: () => Number, required: true })
    readonly categoryId: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly unitId: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly resultsCount: number;

    @ApiProperty({ type: () => [UserResultDto], required: false })
    readonly userResults: UserResultDto[];

    @ApiProperty({ type: () => UnitDto, required: false })
    readonly unit: UnitDto;

    @ApiProperty({ type: () => CategoryDto, required: false })
    readonly category: CategoryDto;
}