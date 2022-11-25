import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetListDto } from '../../common/src/models/get-list.dto';
import { BiomarkersDto } from '../../biomarkers/src/models/biomarkers.dto';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { SessionDataDto } from '../../sessions/src/models';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { UsersBiomarkersService } from './users-biomarkers.service';
import { NUMBER_OF_LAST_USER_RESULTS } from '../../common/src/resources/usersBiomarkers/constants';
import { UserBiomarkersDto } from './models/user-biomarkers.dto';

@ApiBearerAuth()
@ApiTags('users/biomarkers')
@Controller('users/biomarkers')
@Controller()
export class UsersBiomarkersController {
  constructor(
    private readonly usersBiomarkersService: UsersBiomarkersService,
  ) { }

  @ApiResponse({ type: () => UserBiomarkersDto })
  @ApiOperation({ summary: 'Get list of user biomarkers' })
  @Roles(UserRoles.user)
  @Get()
  async getBiomarkersList(@Query() query: GetListDto, @Request() req: Request & { user: SessionDataDto }): Promise<UserBiomarkersDto> {
    const { limit, offset } = query;
    let biomarkersList = [], rangeCounters;

    const scopes: any[] = [
      { method: ['byType', BiomarkerTypes.biomarker] },
    ];

    const count = await this.usersBiomarkersService.getCount(scopes);

    if (count) {
      scopes.push(
        { method: ['withLastResults', req.user.userId, NUMBER_OF_LAST_USER_RESULTS] },
        'withUnit',
        { method: ['withCategory', false] },
        { method: ['pagination', { limit, offset }] },
        { method: ['orderBy', [['createdAt', 'desc']]] }
      );
      biomarkersList = await this.usersBiomarkersService.getList(scopes);

      rangeCounters = await this.usersBiomarkersService.getBiomarkerRangeCounters(req.user.userId);

      await this.usersBiomarkersService.includeUserBiomarkerCounters(biomarkersList, req.user.userId);
    }

    return new UserBiomarkersDto(biomarkersList, rangeCounters, PaginationHelper.buildPagination({ limit, offset }, count));
  }
}
