import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../../users/src/users.service';
import { EntityByIdDto } from '../../common/src/models/entity-by-id.dto';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { AdminsResultsService } from './admins-results.service';
import { CreateUserResultDto } from './models/create-user-result.dto';
import { UserResultDto } from './models/user-result.dto';
import { TranslatorService } from 'nestjs-translator';
import { BiomarkersService } from '../../biomarkers/src/biomarkers.service';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { GetListDto } from '../../common/src/models/get-list.dto';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { UserResultsDto } from './models/user-results.dto';

@ApiTags('admins/users/results')
@Controller('admins/users')
export class AdminsResultsController {
  constructor(
    private readonly adminsResultsService: AdminsResultsService,
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
    private readonly biomarkersService: BiomarkersService,
  ) { }

  @ApiCreatedResponse({ type: () => UserResultDto })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Get list of users' })
  @Roles(UserRoles.superAdmin)
  @Post('/:id/results')
  async createResult(@Param() param: EntityByIdDto, @Body() body: CreateUserResultDto): Promise<UserResultDto> {
    const user = await this.usersService.getOne([
      { method: ['byId', param.id] },
      { method: ['byRoles', UserRoles.user] }
    ]);

    if (!user) {
      throw new NotFoundException({
        message: this.translator.translate('USER_NOT_FOUND'),
        errorCode: 'USER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    const biomarker = await this.biomarkersService.getOne([
      { method: ['byId', body.biomarkerId] },
      { method: ['byType', BiomarkerTypes.biomarker] }
    ]);

    if (!biomarker) {
      throw new NotFoundException({
        message: this.translator.translate('BIOMARKER_NOT_FOUND'),
        errorCode: 'BIOMARKER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    const userResultToCreate = Object.assign({ userId: param.id }, body);

    const userResult = await this.adminsResultsService.create(userResultToCreate);

    return new UserResultDto(userResult);
  }

  @ApiResponse({ type: () => UserResultsDto })
  @ApiOperation({ summary: 'Get list of user results' })
  @Roles(UserRoles.superAdmin)
  @Get('/:id/results')
  async getResultsList(@Param() param: EntityByIdDto, @Query() query: GetListDto): Promise<UserResultsDto> {
    const limit = parseInt(query.limit);
    const offset = parseInt(query.offset);

    let resultsList = [];
    const scopes: any[] = [{ method: ['byUserId', param.id] }];

    const user = await this.usersService.getOne([
      { method: ['byId', param.id] },
      { method: ['byRoles', UserRoles.user] }
    ]);

    if (!user) {
      throw new NotFoundException({
        message: this.translator.translate('USER_NOT_FOUND'),
        errorCode: 'USER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    const count = await this.adminsResultsService.getCount(scopes);

    if (count) {
      scopes.push({ method: ['pagination', { limit, offset }] });
      resultsList = await this.adminsResultsService.getList(scopes);
    }

    return new UserResultsDto(resultsList, PaginationHelper.buildPagination({ limit, offset }, count));
  }
}
