import { Interaction } from '../../../../biomarkers/src/models/interactions/interaction.entity';
import { AlternativeName } from '../../../../biomarkers/src/models/alternativeNames/alternative-name.entity';
import { Biomarker } from '../../../../biomarkers/src/models/biomarker.entity';
import { Category } from '../../../../biomarkers/src/models/categories/category.entity';
import { FilterEthnicity } from '../../../../biomarkers/src/models/filterEthnicity/filter-ethnicity.entity';
import { FilterOtherFeature } from '../../../../biomarkers/src/models/filterOtherFeatures/filter-other-feature.entity';
import { Filter } from '../../../../biomarkers/src/models/filters/filter.entity';
import { FilterAge } from '../../../../biomarkers/src/models/filtersAge/filter-age.entity';
import { FilterSex } from '../../../../biomarkers/src/models/filtersSex/filter-sex.entity';
import { FilterRecommendation } from '../../../../biomarkers/src/models/recommendations/filter-recommendation.entity';
import { Recommendation } from '../../../../biomarkers/src/models/recommendations/recommendation.entity';
import { Unit } from '../../../../biomarkers/src/models/units/unit.entity';
import { User } from '../../../../users/src/models';
import { VerificationToken } from '../../../../verifications/src/models/verification-token.entity';
import { UserWefitter } from '../../../../wefitter/src/models/user-wefitter.entity';
import { UserResult } from '../../../../admins-results/src/models/user-result.entity';
import { File } from '../../../../files/src/models/file.entity';
import { RecommendationFile } from '../../../../biomarkers/src/models/recommendations/recommendation-file.entity';
import { RecommendationImpact } from '../../../../biomarkers/src/models/recommendationImpacts/recommendation-impact.entity';
import { UserWefitterDailySummary } from '../../../../wefitter/src/models/wefitter-daily-summary.entity';
import { UserWefitterHeartrateSummary } from '../../../../wefitter/src/models/wefitter-heartrate-summary.entity';
import { UserWefitterSleepSummary } from '../../../../wefitter/src/models/wefitter-sleep-summary.entity';
import { UserWefitterStressSummary } from '../../../../wefitter/src/models/wefitter-stress-summary.entity';
import { FilterGroup } from '../../../../biomarkers/src/models/filterGroups/filter-group.entity';
import { FilterSummary } from '../../../../biomarkers/src/models/filterSummaries/filter-summary.entity';
import { FilterBulletList } from '../../../../biomarkers/src/models/filterBulletLists/filter-bullet-list.entity';
import { StudyLink } from '../../../../biomarkers/src/models/filterBulletLists/study-link.entity';

export const entities = [
    User,
    VerificationToken,
    Biomarker,
    Category,
    Unit,
    AlternativeName,
    Recommendation,
    Filter,
    FilterRecommendation,
    FilterAge,
    FilterSex,
    FilterEthnicity,
    FilterOtherFeature,
    Interaction,
    UserWefitter,
    UserWefitterDailySummary,
    UserResult,
    File,
    RecommendationFile,
    RecommendationImpact,
    UserWefitterHeartrateSummary,
    UserWefitterSleepSummary,
    UserWefitterStressSummary,
    FilterGroup,
    FilterSummary,
    FilterBulletList,
    StudyLink,
];