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
    UserResult,
];