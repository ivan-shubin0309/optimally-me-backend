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
  BadRequestException
} from '@nestjs/common';
import { TranslatorService } from 'nestjs-translator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { BiomarkersService } from './biomarkers.service';
import { CategoriesService } from './services/category/category.service';
import { FilterCharacteristicsService } from './services/filterCharacteristicsService/filter-characteristics.service';
import { UnitsService } from './services/units/units.service';
import { CategoriesDto, UnitsDto, CreateBiomarkerDto } from './models';
import { GetListDto } from '../../common/src/models/get-list.dto';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { RulesDto } from './models/rules/rules.dto';
import { RulesService } from './services/rules/rules.service';
import { RecommendationsService } from './services/recommendations/recommendations.service';
import { ListRecommendationsDto } from './models/recommendations/list-recommendations.dto';
import { GetListRecommendationsDto } from './models/recommendations/get-recommendations.dto';
import { FilterCharacteristicsDto } from './models/filters/filter-characteristics.dto';




@ApiBearerAuth()
@ApiTags('biomarkers')
@Controller('biomarkers')
export class BiomarkersController {
  constructor(
    private readonly biomarkersService: BiomarkersService,
    private readonly categoriesService: CategoriesService,
    private readonly unitsService: UnitsService,
    private readonly rulesService: RulesService,
    private readonly translator: TranslatorService,
    private readonly recommendationsService: RecommendationsService,
    private readonly filterCharacteristicsService: FilterCharacteristicsService,
    @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,

  ) {}

  @ApiOperation({ summary: 'Create biomarker' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRoles.superAdmin)
  @Post('')
  async createBiomarker(@Request() req, @Body() body: CreateBiomarkerDto): Promise<void> {
    const { user } = req;

    const biomarker = await this.biomarkersService.getBiomarkerByName(body.name);

    if (biomarker) {
      throw new BadRequestException({
        message: this.translator.translate('BIOMARKER_ALREADY_EXIST'),
        errorCode: 'BIOMARKER_ALREADY_EXIST',
        statusCode: HttpStatus.BAD_REQUEST
      });
    }
    await this.biomarkersService.createBiomarker(body, user.userId);
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

    const count = await this.categoriesService.getCategoriesCount();

    if (count) {
      scopes.push({ method: ['pagination', { limit, offset }] });
      categoriesList = await this.categoriesService.getListCategories(scopes);
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

    const count = await this.unitsService.getUnitsCount();

    if (count) {
      scopes.push({ method: ['pagination', { limit, offset }] });
      unitsList = await this.unitsService.getListUnits(scopes);
    }

    return new UnitsDto(unitsList, PaginationHelper.buildPagination({ limit, offset }, count));
  }

  @ApiCreatedResponse({ type: () => RulesDto })
  @ApiOperation({ summary: 'Get list rules' })
  @Roles(UserRoles.superAdmin)
  @Get('rules')
  async getListRules(@Query() query: GetListDto): Promise<RulesDto> {
    const limit = parseInt(query.limit);
    const offset = parseInt(query.offset);

    let rulesList = [];
    const scopes: any[] = [
      { method: ['withLibraryFilters'] },
      { method: ['withInteractions'] }
    ];

    const count = await this.rulesService.getLibraryRulesCount();

    if (count) {
      scopes.push({ method: ['pagination', { limit, offset }] });
      rulesList = await this.rulesService.getListLibraryRules(scopes);
    }

    return new RulesDto(rulesList, PaginationHelper.buildPagination({ limit, offset }, count));
  }

  @ApiOperation({ summary: 'Delete rule' })
  @ApiParam({ name: 'id' })
  @Roles(UserRoles.superAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('rules/:id')
  async deleteRule(@Param('id') id: number) {
    await this.rulesService.deleteLibraryRule(id);
  }

  @ApiCreatedResponse({ type: () => ListRecommendationsDto })
  @ApiOperation({ summary: 'Get list recommendations' })
  @Roles(UserRoles.superAdmin)
  @Get('recommendations')
  async getListRecommendations(@Query() query: GetListRecommendationsDto): Promise<ListRecommendationsDto> {
    const limit = parseInt(query.limit);
    const offset = parseInt(query.offset);
    const content = query.search;
    const category = parseInt(query.category);

    let recommendationsList = [];
    const scopes: any[] = [{ method: ['byContent', content] }];

    if (category !== 0) {
      scopes.push({ method: ['byCategory', category] });
    }

    const count = await this.recommendationsService.getRecommendationsCount();

    if (count) {
      scopes.push({ method: ['pagination', { limit, offset }] });
      recommendationsList = await this.recommendationsService.getListRecommendations(scopes);
    }

    return new ListRecommendationsDto(recommendationsList, PaginationHelper.buildPagination({ limit, offset }, count));
  }

  @ApiCreatedResponse({ type: () => FilterCharacteristicsDto })
  @ApiOperation({ summary: 'Get filter characteristics' })
  @Roles(UserRoles.superAdmin)
  @Get('filters/characteristics')
  getFilterCharacteristics(): FilterCharacteristicsDto {
    return this.filterCharacteristicsService.getFilterCharacteristics();
  }
}
