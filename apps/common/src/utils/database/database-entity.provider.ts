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
import { FilterGroup } from '../../../../biomarkers/src/models/filterGroups/filter-group.entity';
import { FilterSummary } from '../../../../biomarkers/src/models/filterSummaries/filter-summary.entity';
import { FilterBulletList } from '../../../../biomarkers/src/models/filterBulletLists/filter-bullet-list.entity';
import { StudyLink } from '../../../../biomarkers/src/models/filterBulletLists/study-link.entity';
import { UserAdditionalField } from '../../../../users/src/models/user-additional-field.entity';
import { UserRecommendation } from '../../../../biomarkers/src/models/userRecommendations/user-recommendation.entity';
import { ImpactStudyLink } from '../../../../biomarkers/src/models/recommendationImpacts/impact-study-link.entity';
import { RecommendationReaction } from '../../../../biomarkers/src/models/recommendationReactions/recommendation-reaction.entity';
import { FilterSkinType } from '../../../../biomarkers/src/models/filterSkinTypes/filter-skin-type.entity';
import { FilterContradiction } from '../../../../biomarkers/src/models/filterContradictions/filter-contradiction.entity';
import { UserHautAiField } from '../../../../haut-ai/src/models/user-haut-ai-field.entity';
import { RecommendationSkinType } from '../../../../biomarkers/src/models/recommendationSkinTypes/recommendation-skin-type.entity';
import { RecommendationContradiction } from '../../../../biomarkers/src/models/recommendationContradictions/recommendation-contradiction.entity';
import { SkinUserResult } from '../../../../haut-ai/src/models/skin-user-result.entity';
import { UserSkinDiary } from '../../../../haut-ai/src/models/user-skin-diary.entity';
import { Sample } from '../../../../samples/src/models/sample.entity';
import { UserQuiz } from '../../../../typeform/src/models/user-quiz.entity';
import { UserQuizAnswer } from '../../../../typeform/src/models/user-quiz-answer.entity';
import { UserSample } from '../../../../samples/src/models/user-sample.entity';
import { UserDevice } from '../../../../users-devices/src/models/user-device.entity';

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
    FilterGroup,
    FilterSummary,
    FilterBulletList,
    StudyLink,
    UserAdditionalField,
    UserRecommendation,
    ImpactStudyLink,
    RecommendationReaction,
    FilterSkinType,
    FilterContradiction,
    UserHautAiField,
    RecommendationSkinType,
    RecommendationContradiction,
    SkinUserResult,
    UserSkinDiary,
    Sample,
    UserQuiz,
    UserQuizAnswer,
    UserSample,
    UserDevice,
];