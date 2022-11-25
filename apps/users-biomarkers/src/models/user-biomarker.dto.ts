import { ApiProperty } from '@nestjs/swagger';
import { UserResultDto } from '../../../admins-results/src/models/user-result.dto';
import { Biomarker } from '../../../biomarkers/src/models/biomarker.entity';
import { BaseDto } from '../../../common/src/base/base.dto';

export class UserBiomarkerDto extends BaseDto<Biomarker> {
    constructor(entity: Biomarker) {
        super(entity);

        this.name = entity.name;
        this.label = entity.label;
        this.shortName = entity.shortName;
        this.resultsCount = entity.resultsCount;
        this.userResults = entity.userResults && entity.userResults.length
            ? entity.userResults.map(userResult => new UserResultDto(userResult))
            : undefined;
    }

    @ApiProperty({ type: () => String, required: true })
    readonly name: string;

    @ApiProperty({ type: () => String, required: true })
    readonly label: string;

    @ApiProperty({ type: () => String, required: true })
    readonly shortName: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly resultsCount: number;

    @ApiProperty({ type: () => [UserResultDto], required: false })
    readonly userResults: UserResultDto[];
}