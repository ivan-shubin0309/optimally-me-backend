import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Put, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResultsDto } from '../../admins-results/src/models/user-results.dto';
import { FilterDto } from '../../biomarkers/src/models/filters/filter.dto';
import { FiltersService } from '../../biomarkers/src/services/filters/filters.service';
import { EntityByIdDto } from '../../common/src/models/entity-by-id.dto';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { UsersResultsService } from './users-results.service';
import { SessionDataDto } from '../../sessions/src/models';
import { TranslatorService } from 'nestjs-translator';
import { RecommendationsWithoutPaginationDto } from './models/user-recommendations-without-pagination.dto';
import { GetUserResultsDto } from './models/get-user-results-list.dto';
import { PutReactRecommendationDto } from './models/put-react-recommendation.dto';
import { DeleteReactRecommendationDto } from './models/delete-react-recommendation.dto';
import { FilterWithBiomarkerDto } from '../../biomarkers/src/models/filters/filter-with-biomarker.dto';
import { GetUserResultAveragesDto } from './models/get-user-result-averages.dto';
import { UserResultAveragesDto } from './models/user-result-averages.dto';
import { UsersRecommendationsService } from '../../users-recommendations/src/users-recommendations.service';
import sequelize from 'sequelize';
import { RecommendationTypes } from 'apps/common/src/resources/recommendations/recommendation-types';

@ApiBearerAuth()
@ApiTags('users/biomarkers/results')
@Controller('users/biomarkers')
export class UsersResultsController {
    constructor(
        private readonly usersResultsService: UsersResultsService,
        private readonly filtersService: FiltersService,
        private readonly translator: TranslatorService,
        private readonly userRecommendationsService: UsersRecommendationsService,
    ) { }

    @ApiResponse({ type: () => UserResultsDto })
    @ApiOperation({ summary: 'Get user results by biomarker id' })
    @Roles(UserRoles.user)
    @Get('/:id/results')
    async getResultsList(@Query() query: GetUserResultsDto, @Param() param: EntityByIdDto, @Request() req: Request & { user: SessionDataDto }): Promise<UserResultsDto> {
        const { limit, offset } = query;

        let userResultsList = [];
        const scopes: any[] = [
            { method: ['byBiomarkerId', param.id] },
            { method: ['byUserId', req.user.userId] }
        ];

        if (query.startDate || query.endDate) {
            scopes.push({ method: ['byDate', query.startDate, query.endDate] });
        }

        const count = await this.usersResultsService.getCount(scopes);

        if (count) {
            scopes.push(
                { method: ['pagination', { limit, offset }] },
                { method: ['orderBy', [['date', 'desc']]] },
                'withUnit',
                'withBiomarker',
                'withHl7Object',
            );
            userResultsList = await this.usersResultsService.getList(scopes);
        }

        return new UserResultsDto(userResultsList, PaginationHelper.buildPagination({ limit, offset }, count));
    }

    @ApiResponse({ type: () => UserResultAveragesDto })
    @ApiOperation({ summary: 'Get user results averages by biomarker id' })
    @HttpCode(HttpStatus.OK)
    @Roles(UserRoles.user)
    @Get('/results/averages')
    async getResultsAvarages(@Query() query: GetUserResultAveragesDto, @Request() req: Request & { user: SessionDataDto }): Promise<UserResultAveragesDto> {
        let averagesList = [];
        const scopes: any[] = [
            { method: ['byBiomarkerId', query.biomarkerIds] },
            { method: ['byUserId', req.user.userId] },
            { method: ['averages'] }
        ];

        if (query.startDate || query.endDate) {
            scopes.push({ method: ['byDate', query.startDate, query.endDate] });
        }

        averagesList = await this.usersResultsService.getList(scopes);

        return new UserResultAveragesDto(averagesList);
    }

    @ApiResponse({ type: () => FilterDto })
    @ApiOperation({ summary: 'Get active filter by result id' })
    @Roles(UserRoles.user)
    @Get('/results/:id/filters')
    async getFilterByResultId(@Param() param: EntityByIdDto, @Request() req: Request & { user: SessionDataDto }): Promise<FilterDto> {
        const userResult = await this.usersResultsService.getOne([
            { method: ['byId', param.id] },
            { method: ['byUserId', req.user.userId] }
        ]);

        if (!userResult) {
            throw new NotFoundException({
                message: this.translator.translate('USER_RESULT_NOT_FOUND'),
                errorCode: 'USER_RESULT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        const filter = await this.filtersService.getOne([
            { method: ['byId', userResult.filterId] },
            'includeAll'
        ]);

        if (!filter) {
            throw new NotFoundException({
                message: this.translator.translate('FILTER_NOT_FOUND'),
                errorCode: 'FILTER_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        await this.filtersService.joinBulletList(filter);

        return new FilterDto(filter);
    }

    @ApiResponse({ type: () => RecommendationsWithoutPaginationDto })
    @ApiOperation({ summary: 'Get recommendations by result id' })
    @Roles(UserRoles.user)
    @Get('/results/:id/recommendations')
    async getRecommendationsByResultId(@Param() param: EntityByIdDto, @Request() req: Request & { user: SessionDataDto }): Promise<RecommendationsWithoutPaginationDto> {
        const userResult = await this.usersResultsService.getOne([
            { method: ['byId', param.id] },
            { method: ['byUserId', req.user.userId] },
            { method: ['withFilter'] }
        ]);

        if (!userResult) {
            throw new NotFoundException({
                message: this.translator.translate('USER_RESULT_NOT_FOUND'),
                errorCode: 'USER_RESULT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        const recommendations = await this.userRecommendationsService.getRecommendationListByUserResult(
            userResult,
            {
                biomarkerId: userResult?.filter?.biomarkerId || userResult?.filter?.removedFromBiomarkerId,
                additionalScopes: [
                    { method: ['withFilterRecommendation', userResult.filterId, userResult.skinUserResultId ? RecommendationTypes.optimal : userResult.recommendationRange] },
                    { method: ['orderBy', [[sequelize.literal('`filterRecommendation.order`'), 'asc']]] }
                ],
                isExcluded: false,
            }
        );

        return new RecommendationsWithoutPaginationDto(recommendations);
    }

    @ApiOperation({ summary: 'Like or dislike recommendation' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(UserRoles.user)
    @Put('/results/recommendations/reactions')
    async reactToRecommendation(
        @Request() req: Request & { user: SessionDataDto },
        @Body() body: PutReactRecommendationDto
    ): Promise<void> {
        const userRecommendation = await this.userRecommendationsService.getOne([
            { method: ['byUserId', req.user.userId] },
            { method: ['byUserResultId', body.userResultId] },
            { method: ['byRecommendationId', body.recommendationId] }
        ]);

        if (!userRecommendation) {
            throw new NotFoundException({
                message: this.translator.translate('USER_RECOMMENDATION_NOT_FOUND'),
                errorCode: 'USER_RECOMMENDATION_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        await this.userRecommendationsService.reactToRecommendation(body, req.user.userId, body.recommendationId);
    }

    @ApiOperation({ summary: 'Remove reaction from recommendation' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(UserRoles.user)
    @Delete('/results/recommendations/reactions')
    async removeReactionFromRecommendation(
        @Body() body: DeleteReactRecommendationDto,
        @Request() req: Request & { user: SessionDataDto }
    ): Promise<void> {
        const userRecommendation = await this.userRecommendationsService.getOne([
            { method: ['byUserId', req.user.userId] },
            { method: ['byUserResultId', body.userResultId] },
            { method: ['byRecommendationId', body.recommendationId] }
        ]);

        if (!userRecommendation) {
            throw new NotFoundException({
                message: this.translator.translate('USER_RECOMMENDATION_NOT_FOUND'),
                errorCode: 'USER_RECOMMENDATION_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        await this.userRecommendationsService.removeReaction(req.user.userId, body.recommendationId);
    }

    @ApiResponse({ type: () => FilterWithBiomarkerDto })
    @ApiOperation({ summary: 'Get filter all by biomarker id' })
    @Roles(UserRoles.user)
    @Get('/:id/filters')
    async getFilterByBiomarkerId(@Param() param: EntityByIdDto): Promise<FilterWithBiomarkerDto> {
        let filter = await this.filtersService.getOne([
            { method: ['byBiomarkerIdAndAllFilter', [param.id]] }
        ]);

        if (!filter) {
            filter = await this.filtersService.getOne([
                { method: ['byBiomarkerId', param.id] }
            ]);
        }

        if (!filter) {
            throw new NotFoundException({
                message: this.translator.translate('FILTER_NOT_FOUND'),
                errorCode: 'FILTER_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        filter = await this.filtersService.getOne(
            [
                { method: ['byId', filter.id] },
                'withBiomarker'
            ],
            null,
            { isIncludeAll: true }
        );

        return new FilterWithBiomarkerDto(filter);
    }
}
