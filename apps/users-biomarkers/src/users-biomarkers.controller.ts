import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { SessionDataDto } from '../../sessions/src/models';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { UsersBiomarkersService } from './users-biomarkers.service';
import { UserBiomarkersDto } from './models/user-biomarkers.dto';
import { GetUserBiomarkersListDto } from './models/get-user-biomarkers-list.dto';
import { UsersResultsService } from '../../users-results/src/users-results.service';
import { DatesListDto } from './models/dates-list.dto';
import { UsersService } from '../../users/src/users.service';
import { BiomarkerSexTypes } from '../../common/src/resources/biomarkers/biomarker-sex-types';
import { userBiomarkerOrderScope } from '../../common/src/resources/usersBiomarkers/order-types';
import { GetDatesListDto } from './models/get-dates-list.dto';

@ApiBearerAuth()
@ApiTags('users/biomarkers')
@Controller('users/biomarkers')
export class UsersBiomarkersController {
  constructor(
    private readonly usersBiomarkersService: UsersBiomarkersService,
    private readonly userResultsService: UsersResultsService,
    private readonly usersService: UsersService,
  ) { }

  @ApiResponse({ type: () => UserBiomarkersDto })
  @ApiOperation({ summary: 'Get list of user biomarkers' })
  @Roles(UserRoles.user)
  @Get()
  async getBiomarkersList(@Query() query: GetUserBiomarkersListDto, @Request() req: Request & { user: SessionDataDto }): Promise<UserBiomarkersDto> {
    const { limit, offset } = query;
    let biomarkersList = [], rangeCounters;

    const lastResultIds = await this.usersBiomarkersService.getLastResultIdsByDate(
      req.user.userId,
      { afterDate: query.afterDate, beforeDate: query.beforeDate },
      1
    );

    const scopes: any[] = [
      { method: ['byType', query.biomarkerType] },
      { method: ['withLastResult', lastResultIds, query.isOnlyTested] },
      'onlyActive'
    ];

    const user = await this.usersService.getOne([
      { method: ['byId', req.user.userId] },
      { method: ['byRoles', UserRoles.user] },
      'withAdditionalField'
    ]);

    if (user.additionalField) {
      scopes.push({ method: ['bySex', [BiomarkerSexTypes.all, user.additionalField.sex]] });
    }

    if (query.categoryId) {
      scopes.push({ method: ['byCategoryId', query.categoryId] });
    }

    if (query.search) {
      scopes.push({ method: ['searchByNames', query.search] });
    }

    if (query.status && query.status.length) {
      scopes.push({ method: ['byRecommendationRange', query.status] });
    }

    if (query.searchByResult) {
      scopes.push({ method: ['searchByResult', query.searchByResult] });
    }

    const count = await this.usersBiomarkersService.getCount(scopes);

    if (count) {
      const scopesForOrdering = scopes.concat([
        { method: ['withLastResult', lastResultIds, query.isOnlyTested, ['withFilter']] },
        { method: ['withCategory', true] },
        { method: ['pagination', { limit, offset }] }
      ]);
      scopesForOrdering.push(userBiomarkerOrderScope[query.orderBy](query));

      const orderedList = await this.usersBiomarkersService.getList(scopesForOrdering);
      const biomarkerIds = orderedList.map(biomarker => biomarker.get('id'));

      rangeCounters = await this.usersBiomarkersService.getBiomarkerRangeCounters(lastResultIds, scopes);

      const lastResultsIds = await this.usersBiomarkersService.getLastResultIdsByDate(
        req.user.userId,
        { afterDate: query.afterDate, beforeDate: query.beforeDate },
        query.maxResultsReturned
      );

      scopes.push(
        { method: ['withLastResults', lastResultsIds, true, false, ['withFilter']] },
        { method: ['withCategory', true] },
        'withUnit',
        { method: ['byId', biomarkerIds] },
        { method: ['orderByLiteral', '`Biomarker`.`id`', biomarkerIds] }
      );

      biomarkersList = await this.usersBiomarkersService.getList(scopes);

      await this.usersBiomarkersService.includeUserBiomarkerCounters(biomarkersList, req.user.userId, query.beforeDate);
    }

    return new UserBiomarkersDto(biomarkersList, rangeCounters, PaginationHelper.buildPagination({ limit, offset }, count));
  }

  @ApiResponse({ type: () => DatesListDto })
  @ApiOperation({ summary: 'Get list of user result dates' })
  @Roles(UserRoles.user)
  @Get('/result-dates')
  async getResultDates(@Query() query: GetDatesListDto, @Request() req: Request & { user: SessionDataDto }): Promise<DatesListDto> {
    const { limit, offset } = query;
    let datesList = [];

    const scopes: any[] = [
      { method: ['byBiomarkerType', query.biomarkerType] },
      { method: ['byUserId', req.user.userId] },
    ];

    if (query.biomarkerId) {
      scopes.push({ method: ['byBiomarkerId', query.biomarkerId] });
    }

    const result = await this.userResultsService.getOne(scopes.concat(['distinctDatesCount']));
    const count = result ? result.get('counter') as number : 0;

    if (count) {
      scopes.push(
        'distinctDates',
        { method: ['pagination', { limit, offset }] },
        { method: ['orderBy', [['date', 'desc']]] }
      );

      datesList = await this.userResultsService.getList(scopes);
    }

    return new DatesListDto(datesList, PaginationHelper.buildPagination({ limit, offset }, count));
  }
}
