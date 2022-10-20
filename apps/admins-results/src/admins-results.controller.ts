import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../../users/src/users.service';
import { EntityByIdDto } from '../../common/src/models/entity-by-id.dto';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { AdminsResultsService } from './admins-results.service';
import { TranslatorService } from 'nestjs-translator';
import { BiomarkersService } from '../../biomarkers/src/biomarkers.service';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { GetListDto } from '../../common/src/models/get-list.dto';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { UserResultsDto } from './models/user-results.dto';
import { CreateUserResultsDto } from './models/create-user-results.dto';
import { UnitsService } from '../../biomarkers/src/services/units/units.service';

@ApiBearerAuth()
@ApiTags('admins/users/results')
@Controller('admins/users')
export class AdminsResultsController {
  constructor(
    private readonly adminsResultsService: AdminsResultsService,
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
    private readonly biomarkersService: BiomarkersService,
    private readonly unitsService: UnitsService,
  ) { }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Create user results' })
  @Roles(UserRoles.superAdmin)
  @Post('/:id/results')
  async createResult(@Param() param: EntityByIdDto, @Body() body: CreateUserResultsDto): Promise<void> {
    const biomarkerIdsMap = {}, unitIdsMap = {};

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

    body.results.forEach(
      (result) => {
        biomarkerIdsMap[result.biomarkerId] = true;
        unitIdsMap[result.unitId] = true;
      }
    );

    const biomarkerIdsCount = Object.keys(biomarkerIdsMap).length;
    const biomarkersCount = await this.biomarkersService.getCount([
      { method: ['byId', body.results.map(result => result.biomarkerId)] },
      { method: ['byType', BiomarkerTypes.biomarker] }
    ]);
    if (biomarkersCount !== biomarkerIdsCount) {
      throw new NotFoundException({
        message: this.translator.translate('BIOMARKER_NOT_FOUND'),
        errorCode: 'BIOMARKER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    const unitIdsCount = Object.keys(unitIdsMap).length;
    const unitsCount = await this.unitsService.getCount([{ method: ['byId', body.results.map(result => result.unitId)] }]);
    if (unitIdsCount !== unitsCount) {
      throw new NotFoundException({
        message: this.translator.translate('UNIT_NOT_FOUND'),
        errorCode: 'UNIT_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    const resultsCount = await this.adminsResultsService.getCount([
      {
        method: [
          'byDateAndBiomarkerId',
          body.results.map(result => ({ biomarkerId: result.biomarkerId, date: result.date, userId: param.id }))
        ]
      }
    ]);

    if (resultsCount) {
      throw new BadRequestException({
        message: this.translator.translate('RESULT_ALREADY_EXIST'),
        errorCode: 'RESULT_ALREADY_EXIST',
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    const userResultsToCreate = body.results.map(result => Object.assign({ userId: param.id }, result));

    await this.adminsResultsService.bulkCreate(userResultsToCreate);
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
      scopes.push(
        { method: ['pagination', { limit, offset }] },
        'withUnit',
        'withBiomarker'
      );
      resultsList = await this.adminsResultsService.getList(scopes);
    }

    return new UserResultsDto(resultsList, PaginationHelper.buildPagination({ limit, offset }, count));
  }
}
