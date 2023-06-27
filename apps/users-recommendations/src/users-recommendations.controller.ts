import { Controller, Get, HttpCode, HttpStatus, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionDataDto } from '../../sessions/src/models';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { GetUserRecommendationsDto } from './models/get-user-recommendations.dto';
import { UsersRecommendationsService } from './users-recommendations.service';
import { UsersBiomarkersService } from '../../users-biomarkers/src/users-biomarkers.service';
import { UserRecommendationsListDto } from './models/user-recommendations-list.dto';
import { userRecommendationsSortingServerValues } from '../../common/src/resources/recommendations/user-recommendations-field-names';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { RecommendationCategoryTypes } from '../../common/src/resources/recommendations/recommendation-category-types';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { TopTenRecommendationsDto } from './models/top-ten-recommendations.dto';

@ApiBearerAuth()
@ApiTags('users/recommendations')
@Controller('users/recommendations')
export class UsersRecommendationsController {
    constructor(
        private readonly usersRecommendationsService: UsersRecommendationsService,
        private readonly usersBiomarkersService: UsersBiomarkersService,
    ) { }

    @ApiResponse({ type: () => UserRecommendationsListDto })
    @ApiOperation({ summary: 'Get user recommendations list' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Get()
    async getRecommendationsList(@Query() query: GetUserRecommendationsDto, @Request() req: Request & { user: SessionDataDto }): Promise<UserRecommendationsListDto> {
        let recommendationsList = [];

        let lastResultIds = await this.usersBiomarkersService.getLastResultIdsByDate(req.user.userId, null, 1);

        if (query.biomarkerType === BiomarkerTypes.blood) {
            const results = await this.usersBiomarkersService.getResultsList([
                { method: ['byId', lastResultIds] },
                { method: ['byBiomarkerType', BiomarkerTypes.blood] }
            ]);

            lastResultIds = results.map(result => result.id);
        }

        if (query.biomarkerType === BiomarkerTypes.skin) {
            const results = await this.usersBiomarkersService.getResultsList([
                { method: ['byId', lastResultIds] },
                { method: ['byBiomarkerType', BiomarkerTypes.skin] }
            ]);

            lastResultIds = results.map(result => result.id);
        }

        const userRecommendations = await this.usersRecommendationsService.getList([
            { method: ['byUserResultId', lastResultIds] },
            { method: ['byIsExcluded', false] }
        ]);

        const orderScope = userRecommendationsSortingServerValues[query.orderBy](query.orderType, lastResultIds);

        const recommendationIds = userRecommendations.map(userRecommendation => userRecommendation.recommendationId);

        const scopes: any[] = [
            { method: ['byId', recommendationIds] },
            { method: ['withUserReaction', req.user.userId, true] }
        ];

        const count = await this.usersRecommendationsService.getRecommendationCount(scopes);

        if (count) {
            const orderedRecommendations = await this.usersRecommendationsService.getRecommendationList(scopes.concat([orderScope]));

            scopes.push(
                { method: ['withFiles'] },
                { method: ['withUserReaction', req.user.userId, true] },
                { method: ['withUserRecommendation', lastResultIds] },
                { method: ['orderByLiteral', 'id', orderedRecommendations.map(recommendation => recommendation.id)] },
            );
            recommendationsList = await this.usersRecommendationsService.getRecommendationList(scopes);

            await this.usersRecommendationsService.attachBiomarkersToRecommendations(lastResultIds, recommendationsList, req.user.userId);
        }

        return new UserRecommendationsListDto(recommendationsList, PaginationHelper.buildPagination({ limit: query.limit, offset: query.offset }, count));
    }

    @ApiResponse({ type: () => TopTenRecommendationsDto })
    @ApiOperation({ summary: 'Get top ten recommendations list' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Get('top-ten')
    async getTopTenRecommendationsList(@Request() req: Request & { user: SessionDataDto }): Promise<TopTenRecommendationsDto> {
        let userBloodRecommendations, userSkinRecommendations, doctorRecommendations, bloodRecommendations, skinRecommendations;
        let recommendationsList = [];

        const lastResultIds = await this.usersBiomarkersService.getLastResultIdsByDate(req.user.userId, null, 1);

        const [
            resultsWithBloodBiomarker,
            resultsWithSkinBiomarker
        ] = await Promise.all([
            this.usersBiomarkersService.getResultsList([
                { method: ['byId', lastResultIds] },
                { method: ['byBiomarkerType', BiomarkerTypes.blood] }
            ]),
            this.usersBiomarkersService.getResultsList([
                { method: ['byId', lastResultIds] },
                { method: ['byBiomarkerType', BiomarkerTypes.skin] }
            ])
        ]);

        const userRecommendationsWithDoctorCategory = await this.usersRecommendationsService.getList([
            { method: ['byUserResultId', lastResultIds] },
            { method: ['byIsExcluded', false] },
            { method: ['byCategory', RecommendationCategoryTypes.doctor] }
        ]);

        if (resultsWithBloodBiomarker.length) {
            userBloodRecommendations = await this.usersRecommendationsService.getList([
                { method: ['byUserResultId', resultsWithBloodBiomarker.map(result => result.id)] },
                { method: ['byIsExcluded', false] },
                {
                    method: [
                        'byCategory',
                        EnumHelper
                            .toCollection(RecommendationCategoryTypes)
                            .filter(categoryType => categoryType.value !== RecommendationCategoryTypes.doctor)
                            .map(categoryType => categoryType.value)
                    ]
                }
            ]);
        }

        if (resultsWithSkinBiomarker.length) {
            userSkinRecommendations = await this.usersRecommendationsService.getList([
                { method: ['byUserResultId', resultsWithSkinBiomarker.map(result => result.id)] },
                { method: ['byIsExcluded', false] },
                {
                    method: [
                        'byCategory',
                        EnumHelper
                            .toCollection(RecommendationCategoryTypes)
                            .filter(categoryType => categoryType.value !== RecommendationCategoryTypes.doctor)
                            .map(categoryType => categoryType.value)
                    ]
                }
            ]);
        }

        if (userRecommendationsWithDoctorCategory?.length) {
            doctorRecommendations = await this.usersRecommendationsService.getRecommendationList([
                { method: ['byId', userRecommendationsWithDoctorCategory.map(userRecommendation => userRecommendation.recommendationId)] },
                { method: ['withUserReaction', req.user.userId, true] },
                { method: ['orderByPriority', 'desc', lastResultIds] }
            ]);
        }

        if (userBloodRecommendations?.length) {
            bloodRecommendations = await this.usersRecommendationsService.getRecommendationList([
                { method: ['byId', userBloodRecommendations.map(userRecommendation => userRecommendation.recommendationId)] },
                { method: ['withUserReaction', req.user.userId, true] },
                { method: ['orderByPriority', 'desc', resultsWithBloodBiomarker.map(result => result.id)] }
            ]);
        }

        if (userSkinRecommendations?.length) {
            skinRecommendations = await this.usersRecommendationsService.getRecommendationList([
                { method: ['byId', userSkinRecommendations.map(userRecommendation => userRecommendation.recommendationId)] },
                { method: ['withUserReaction', req.user.userId, true] },
                { method: ['orderByPriority', 'desc', resultsWithSkinBiomarker.map(result => result.id)] }
            ]);
        }

        const topTenRecommendationIds = [];

        if (doctorRecommendations?.length) {
            const recommendation = doctorRecommendations.shift();
            topTenRecommendationIds.push(recommendation.id);
        }

        if (bloodRecommendations?.length) {
            const numberOfBlood = 9 - topTenRecommendationIds.length;
            const recommendations = bloodRecommendations.splice(0, numberOfBlood);
            topTenRecommendationIds.push(...recommendations.map(recommendation => recommendation.id));
        }

        if (skinRecommendations?.length) {
            const numberOfSkin = 10 - topTenRecommendationIds.length;
            const recommendations = skinRecommendations.splice(0, numberOfSkin);
            topTenRecommendationIds.push(...recommendations.map(recommendation => recommendation.id));
        } else if (bloodRecommendations?.length) {
            const recommendation = bloodRecommendations.shift();
            topTenRecommendationIds.push(recommendation.id);
        }

        if (topTenRecommendationIds.length) {
            const scopes: any[] = [
                { method: ['byId', topTenRecommendationIds] },
                { method: ['withUserReaction', req.user.userId, true] },
                { method: ['withFiles'] },
                { method: ['withUserReaction', req.user.userId, true] },
                { method: ['withUserRecommendation', lastResultIds] },
                { method: ['orderByLiteral', 'id', topTenRecommendationIds] },
            ];

            recommendationsList = await this.usersRecommendationsService.getRecommendationList(scopes);

            await this.usersRecommendationsService.attachBiomarkersToRecommendations(lastResultIds, recommendationsList, req.user.userId);
        }

        return new TopTenRecommendationsDto(recommendationsList);
    }
}
