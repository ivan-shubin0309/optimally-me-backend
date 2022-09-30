import {
  Get,
  Post,
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Request,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { TranslatorService } from 'nestjs-translator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { BiomarkersService } from './biomarkers.service';
import { CategoriesService } from './services/categories/categories.service';
import { FilterCharacteristicsService } from './services/filterCharacteristicsService/filter-characteristics.service';
import { UnitsService } from './services/units/units.service';
import { GetListDto } from '../../common/src/models/get-list.dto';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { RecommendationsService } from './services/recommendations/recommendations.service';
import { BiomarkerTypes } from 'apps/common/src/resources/biomarkers/biomarker-types';
import { CreateBiomarkerDto } from './models/create-biomarker.dto';
import { CategoriesDto } from './models/categories/categories.dto';
import { UnitsDto } from './models/units/units.dto';
import { FilterCharacteristicsDto } from './models/filters/filter-characteristics.dto';
import { BiomarkersDto } from './models/biomarkers.dto';
import { RecommendationsDto } from './models/recommendations/recommendations.dto';
import { GetRecommendationListDto } from './services/recommendations/get-recommendation-list.dto';
import { BiomarkerDto } from './models/biomarker.dto';




@ApiBearerAuth()
@ApiTags('biomarkers')
@Controller('biomarkers')
export class BiomarkersController {
  constructor(
    private readonly biomarkersService: BiomarkersService,
    private readonly categoriesService: CategoriesService,
    private readonly unitsService: UnitsService,
    private readonly translator: TranslatorService,
    private readonly recommendationsService: RecommendationsService,
    private readonly filterCharacteristicsService: FilterCharacteristicsService,
    @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,

  ) {}

  @ApiCreatedResponse({ type: () => BiomarkerDto })
  @ApiOperation({ summary: 'Create biomarker' })
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRoles.superAdmin)
  @Post('')
  async createBiomarker(@Body() body: CreateBiomarkerDto): Promise<BiomarkerDto> {
    let biomarker = await this.biomarkersService.getOne([
      { method: ['byName', body.name] },
      { method: ['byType', BiomarkerTypes.biomarker] }
    ]);

    if (biomarker) {
      throw new BadRequestException({
        message: this.translator.translate('BIOMARKER_ALREADY_EXIST'),
        errorCode: 'BIOMARKER_ALREADY_EXIST',
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    biomarker = await this.biomarkersService.create(body);

    return new BiomarkerDto(biomarker);
  }

  @ApiCreatedResponse({ type: () => CategoriesDto })
  @ApiOperation({ summary: 'Get list categories' })
  @Roles(UserRoles.superAdmin)
  @Get('categories')
  async getListCategories(@Query() query: GetListDto): Promise<CategoriesDto> {
    const limit = parseInt(query.limit);
    const offset = parseInt(query.offset);

    let categoriesList = [];
    const scopes: any[] = [];

    const count = await this.categoriesService.getCount(scopes);

    if (count) {
      scopes.push({ method: ['pagination', { limit, offset }] });
      categoriesList = await this.categoriesService.getList(scopes);
    }

    return new CategoriesDto(categoriesList, PaginationHelper.buildPagination({ limit, offset }, count));
  }

  @ApiCreatedResponse({ type: () => UnitsDto })
  @ApiOperation({ summary: 'Get list units' })
  @Roles(UserRoles.superAdmin)
  @Get('units')
  async getListUnits(@Query() query: GetListDto): Promise<UnitsDto> {
    const limit = parseInt(query.limit);
    const offset = parseInt(query.offset);

    let unitsList = [];
    const scopes: any[] = [];

    const count = await this.unitsService.getCount(scopes);

    if (count) {
      scopes.push({ method: ['pagination', { limit, offset }] });
      unitsList = await this.unitsService.getList(scopes);
    }

    return new UnitsDto(unitsList, PaginationHelper.buildPagination({ limit, offset }, count));
  }

  @ApiCreatedResponse({ type: () => BiomarkersDto })
  @ApiOperation({ summary: 'Get list rules' })
  @Roles(UserRoles.superAdmin)
  @Get('rules')
  async getListRules(@Query() query: GetListDto): Promise<BiomarkersDto> {
    const limit = parseInt(query.limit);
    const offset = parseInt(query.offset);

    let rulesList = [];
    const scopes: any[] = [
      { method: ['byType', BiomarkerTypes.rule] },
      'includeAll'
    ];

    const count = await this.biomarkersService.getCount(scopes);

    if (count) {
      scopes.push({ method: ['pagination', { limit, offset }] });
      rulesList = await this.biomarkersService.getList(scopes);
    }

    return new BiomarkersDto(rulesList, PaginationHelper.buildPagination({ limit, offset }, count));
  }

  @ApiOperation({ summary: 'Delete rule' })
  @ApiParam({ name: 'id' })
  @Roles(UserRoles.superAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('rules/:id')
  async deleteRule(@Param('id') id: number): Promise<void> {
    const biomarker = await this.biomarkersService.getOne([
      { method: ['byId', id] },
      { method: ['byType', BiomarkerTypes.rule] },
      { method: ['byIsDeleted', false] }
    ]);

    if (!biomarker) {
      throw new NotFoundException({
        message: this.translator.translate('BIOMARKER_NOT_FOUND'),
        errorCode: 'BIOMARKER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    await this.dbConnection.transaction(async transaction => {
      await Promise.all(
        biomarker.filters.map(filter => filter.destroy({ transaction }))
      );
      await biomarker.update({ isDeleted: true }, { transaction });
    });
  }

  @ApiResponse({ type: () => RecommendationsDto })
  @ApiOperation({ summary: 'Get list recommendations' })
  @Roles(UserRoles.superAdmin)
  @Get('recommendations')
  async getListRecommendations(@Query() query: GetRecommendationListDto): Promise<RecommendationsDto> {
    const limit = parseInt(query.limit);
    const offset = parseInt(query.offset);

    let recommendationsList = [];
    const scopes: any[] = [];

    if (query.category) {
      scopes.push({ method: ['byCategory', query.category] });
    }

    if (query.search) {
      scopes.push({ method: ['search', query.search] });
    }

    const count = await this.recommendationsService.getCount(scopes);

    if (count) {
      scopes.push({ method: ['pagination', { limit, offset }] });
      recommendationsList = await this.recommendationsService.getList(scopes);
    }

    return new RecommendationsDto(recommendationsList, PaginationHelper.buildPagination({ limit, offset }, count));
  }

  @ApiCreatedResponse({ type: () => FilterCharacteristicsDto })
  @ApiOperation({ summary: 'Get filter characteristics' })
  @Roles(UserRoles.superAdmin)
  @Get('filters/characteristics')
  getFilterCharacteristics(): FilterCharacteristicsDto {
    return this.filterCharacteristicsService.getFilterCharacteristics();
  }
}
