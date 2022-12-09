import { Controller, Get, HttpStatus, NotFoundException, Param, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResultsDto } from '../../admins-results/src/models/user-results.dto';
import { FilterDto } from '../../biomarkers/src/models/filters/filter.dto';
import { FiltersService } from '../../biomarkers/src/services/filters/filters.service';
import { EntityByIdDto } from '../../common/src/models/entity-by-id.dto';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { GetListDto } from '../../common/src/models/get-list.dto';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { UsersResultsService } from './users-results.service';
import { SessionDataDto } from '../../sessions/src/models';
import { TranslatorService } from 'nestjs-translator';
import { UserRecommendationsService } from '../../biomarkers/src/services/userRecommendations/user-recommendations.service';
import { RecommendationsWithoutPaginationDto } from './models/user-recommendations-without-pagination.dto';

@ApiBearerAuth()
@ApiTags('users/biomarkers/results')
@Controller('users/biomarkers')
export class UsersResultsController {
    constructor(
        private readonly usersResultsService: UsersResultsService,
        private readonly filtersService: FiltersService,
        private readonly translator: TranslatorService,
        private readonly userRecommendationsService: UserRecommendationsService,
    ) { }

    @ApiResponse({ type: () => UserResultsDto })
    @ApiOperation({ summary: 'Get user results by biomarker id' })
    @Roles(UserRoles.user)
    @Get('/:id/results')
    async getResultsList(@Query() query: GetListDto, @Param() param: EntityByIdDto, @Request() req: Request & { user: SessionDataDto }): Promise<UserResultsDto> {
        const { limit, offset } = query;

        let userResultsList = [];
        const scopes: any[] = [
            { method: ['byBiomarkerId', param.id] },
            { method: ['byUserId', req.user.userId] }
        ];

        const count = await this.usersResultsService.getCount(scopes);

        if (count) {
            scopes.push(
                { method: ['pagination', { limit, offset }] },
                { method: ['orderBy', [['date', 'desc']]] }
            );
            userResultsList = await this.usersResultsService.getList(scopes);
        }

        return new UserResultsDto(userResultsList, PaginationHelper.buildPagination({ limit, offset }, count));
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
            { method: ['byUserId', req.user.userId] }
        ]);

        if (!userResult) {
            throw new NotFoundException({
                message: this.translator.translate('USER_RESULT_NOT_FOUND'),
                errorCode: 'USER_RESULT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        const recommendations = await this.userRecommendationsService.getRecommendationList(userResult);

        return new RecommendationsWithoutPaginationDto(recommendations);
    }
}
