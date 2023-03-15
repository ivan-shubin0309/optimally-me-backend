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
import { userRecommendationsSortingServerValues } from 'apps/common/src/resources/recommendations/user-recommendations-field-names';

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
        const orderScope = userRecommendationsSortingServerValues[query.orderBy](query.orderType);

        const lastResultIds = await this.usersBiomarkersService.getLastResultIdsByDate(req.user.userId, null, 1);
        const userRecommendations = await this.usersRecommendationsService.getList([
            { method: ['byUserResultId', lastResultIds] },
            { method: ['byIsExcluded', false] }
        ]);

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
}
