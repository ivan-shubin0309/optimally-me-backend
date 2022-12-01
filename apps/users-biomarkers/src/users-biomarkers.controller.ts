import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { SessionDataDto } from '../../sessions/src/models';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { UsersBiomarkersService } from './users-biomarkers.service';
import { NUMBER_OF_LAST_USER_RESULTS } from '../../common/src/resources/usersBiomarkers/constants';
import { UserBiomarkersDto } from './models/user-biomarkers.dto';
import { GetUserBiomarkersListDto } from './models/get-user-biomarkers-list.dto';
import { GetListDto } from '../../common/src/models/get-list.dto';
import { UsersResultsService } from '../../users-results/src/users-results.service';
import { DatesListDto } from './models/dates-list.dto';

@ApiBearerAuth()
@ApiTags('users/biomarkers')
@Controller('users/biomarkers')
@Controller()
export class UsersBiomarkersController {
  constructor(
    private readonly usersBiomarkersService: UsersBiomarkersService,
    private readonly userResultsService: UsersResultsService,
  ) { }

  @ApiResponse({ type: () => UserBiomarkersDto })
  @ApiOperation({ summary: 'Get list of user biomarkers' })
  @Roles(UserRoles.user)
  @Get()
  async getBiomarkersList(@Query() query: GetUserBiomarkersListDto, @Request() req: Request & { user: SessionDataDto }): Promise<UserBiomarkersDto> {
    const { limit, offset } = query;
    let biomarkersList = [], rangeCounters;

    const scopes: any[] = [
      { method: ['byType', BiomarkerTypes.biomarker] },
    ];

    if (query.categoryId) {
      scopes.push({ method: ['byCategoryId', query.categoryId] });
    }

    const count = await this.usersBiomarkersService.getCount(scopes);

    if (count) {
      const scopesForOrdering = scopes.concat([
        { method: ['withCategory', true] },
        { method: ['withLastResult', req.user.userId, query.beforeDate] },
        { method: ['orderByDeviation'] },
        { method: ['pagination', { limit, offset }] }
      ]);

      const orderedList = await this.usersBiomarkersService.getList(scopesForOrdering);
      const biomarkerIds = orderedList.map(biomarker => biomarker.get('id'));

      rangeCounters = await this.usersBiomarkersService.getBiomarkerRangeCounters(req.user.userId, query.beforeDate, scopes);

      scopes.push(
        { method: ['withLastResults', req.user.userId, NUMBER_OF_LAST_USER_RESULTS, true, false, query.beforeDate] },
        { method: ['withCategory', true] },
        'withUnit',
        { method: ['byId', biomarkerIds] },
        { method: ['orderByLiteral', '`Biomarker`.`id`', biomarkerIds] }
      );

      biomarkersList = await this.usersBiomarkersService.getList(scopes);

      await this.usersBiomarkersService.includeUserBiomarkerCounters(biomarkersList, req.user.userId);
    }

    return new UserBiomarkersDto(biomarkersList, rangeCounters, PaginationHelper.buildPagination({ limit, offset }, count));
  }

  @ApiResponse({ type: () => DatesListDto })
  @ApiOperation({ summary: 'Get list of user result dates' })
  @Roles(UserRoles.user)
  @Get('/result-dates')
  async getResultDates(@Query() query: GetListDto, @Request() req: Request & { user: SessionDataDto }): Promise<DatesListDto> {
    const { limit, offset } = query;
    let datesList = [];

    const scopes: any[] = [
      { method: ['byUserId', req.user.userId] },
    ];

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
