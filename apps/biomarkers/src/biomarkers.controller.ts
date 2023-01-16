import {
  Get,
  Post,
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  Put,
  Patch,
  Request
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
import { BiomarkerTypes, ruleTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { CreateBloodBiomarkerDto } from './models/create-blood-biomarker.dto';
import { CategoriesDto } from './models/categories/categories.dto';
import { UnitsDto } from './models/units/units.dto';
import { FilterCharacteristicsDto } from './models/filters/filter-characteristics.dto';
import { BiomarkersDto } from './models/biomarkers.dto';
import { RecommendationsDto } from './models/recommendations/recommendations.dto';
import { GetRecommendationListDto } from './services/recommendations/get-recommendation-list.dto';
import { BiomarkerDto } from './models/biomarker.dto';
import { EntityByIdDto } from '../../common/src/models/entity-by-id.dto';
import { GetBiomarkerListDto } from './models/get-biomarker-list.dto';
import { sortingServerValues as biomarkerSortingServerValues } from 'apps/common/src/resources/biomarkers/sorting-field-names';
import { sortingServerValues as recommendationSortingServerValues } from 'apps/common/src/resources/recommendations/sorting-field-names';
import { AlternativeNamesService } from './services/alternative-names/alternative-names.service';
import { FiltersService } from './services/filters/filters.service';
import { RecommendationDto } from './models/recommendations/recommendation.dto';
import { CreateRecommendationDto } from './models/recommendations/create-recommendation.dto';
import { FilesService } from '../../files/src/files.service';
import { FileTypes } from '../../common/src/resources/files/file-types';
import { RecommendationFilesService } from './services/recommendations/recommendation-files.service';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { RecommendationImpactsService } from './services/recommendation-impacts/recommendation-impacts.service';
import { CacheService } from '../../common/src/resources/cache/cache.service';
import { PatchRecommendationDto } from './models/recommendations/patch-recommendation.dto';
import { SessionDataDto } from '../../sessions/src/models';
import { UpdateBloodBiomarkerDto } from './models/update-blood-biomarker.dto';
import { CreateSkinBiomarkerDto } from './models/create-skin-biomarker.dto';
import { UpdateSkinBiomarkerDto } from './models/update-skin-biomarker.dto';
import { GetRulesListDto } from './models/get-rules-list.dto';
import { PatchSkinBiomarkerDto } from './models/patch-skin-biomarker.dto';

const RULE_PREFIX = 'rule';

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
    private readonly alternativeNamesService: AlternativeNamesService,
    private readonly filtersService: FiltersService,
    private readonly filesService: FilesService,
    private readonly recommendationFilesService: RecommendationFilesService,
    private readonly configService: ConfigService,
    private readonly recommendationImpactsService: RecommendationImpactsService,
    private readonly cacheService: CacheService,
  ) {}

  @ApiCreatedResponse({ type: () => BiomarkerDto })
  @ApiOperation({ summary: 'Create biomarker' })
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRoles.superAdmin)
  @Post('/blood')
  async createBiomarker(@Body() body: CreateBloodBiomarkerDto): Promise<BiomarkerDto> {
    let biomarker = await this.biomarkersService.getOne([
      { method: ['byName', body.name] },
      { method: ['byType', BiomarkerTypes.blood] }
    ]);

    if (biomarker) {
      throw new BadRequestException({
        message: this.translator.translate('BIOMARKER_ALREADY_EXIST'),
        errorCode: 'BIOMARKER_ALREADY_EXIST',
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    await this.biomarkersService.validateBody(body, BiomarkerTypes.bloodRule);

    biomarker = await this.biomarkersService.createBloodBiomarker(body);

    return new BiomarkerDto(biomarker);
  }

  @ApiCreatedResponse({ type: () => CategoriesDto })
  @ApiOperation({ summary: 'Get list categories' })
  @Roles(UserRoles.superAdmin, UserRoles.admin, UserRoles.user)
  @Get('categories')
  async getListCategories(@Query() query: GetListDto): Promise<CategoriesDto> {
    const { limit, offset } = query;

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
  @Roles(UserRoles.superAdmin, UserRoles.admin, UserRoles.user)
  @Get('units')
  async getListUnits(@Query() query: GetListDto): Promise<UnitsDto> {
    const { limit, offset } = query;

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
  async getListRules(@Query() query: GetRulesListDto): Promise<BiomarkersDto> {
    const { limit, offset } = query;

    let rulesList = [];
    const scopes: any[] = [
      { method: ['byType', query.ruleType] },
      { method: ['byIsDeleted', false] },
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
  async deleteRule(@Param() param: EntityByIdDto): Promise<void> {
    const biomarker = await this.biomarkersService.getOne([
      { method: ['byId', param.id] },
      { method: ['byType', ruleTypes] },
      { method: ['byIsDeleted', false] }
    ]);

    if (!biomarker) {
      throw new NotFoundException({
        message: this.translator.translate('BIOMARKER_NOT_FOUND'),
        errorCode: 'BIOMARKER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    await this.cacheService.del(RULE_PREFIX, param.id);

    await this.dbConnection.transaction(async transaction => {
      await Promise.all([
        this.alternativeNamesService.removeByBiomarkerId(biomarker.id, transaction),
        this.filtersService.removeByBiomarkerId(biomarker.id, transaction)
      ]);
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
    const orderBy = recommendationSortingServerValues[query.orderBy];

    let recommendationsList = [];
    const scopes: any[] = [];

    if (query.category && query.category.length) {
      scopes.push({ method: ['byCategory', query.category] });
    }

    if (query.search) {
      scopes.push({ method: ['search', query.search] });
    }

    if (typeof query.isArchived === 'boolean') {
      scopes.push({ method: ['byIsArchived', query.isArchived] });
    }

    const count = await this.recommendationsService.getCount(scopes);

    if (count) {
      if (orderBy !== 'createdAt') {
        scopes.push({ method: ['orderBy', [[orderBy, query.orderType], ['createdAt', 'desc']]] });
      } else {
        scopes.push({ method: ['orderBy', [['createdAt', query.orderType]]] });
      }  

      scopes.push(
        { method: ['pagination', { limit, offset }] },
      );
      recommendationsList = await this.recommendationsService.getList(scopes, null, { isIncludeAll: true });
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

  @ApiResponse({ type: () => UpdateBloodBiomarkerDto })
  @ApiOperation({ summary: 'Update biomarker' })
  @Roles(UserRoles.superAdmin)
  @Put('/blood/:id')
  async updateBiomarker(@Param() param: EntityByIdDto, @Body() body: UpdateBloodBiomarkerDto): Promise<BiomarkerDto> {
    let biomarker = await this.biomarkersService.getOne(
      [
        { method: ['byId', param.id] },
        { method: ['byType', BiomarkerTypes.blood] },
        'withFilters'
      ],
      null,
      { filters: { isIncludeAll: true } }
    );

    if (!biomarker) {
      throw new NotFoundException({
        message: this.translator.translate('BIOMARKER_NOT_FOUND'),
        errorCode: 'BIOMARKER_NOT_FOUND',
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    const biomarkerWithName = await this.biomarkersService.getOne([
      { method: ['byName', body.name] },
      { method: ['byType', BiomarkerTypes.blood] },
    ]);

    if (biomarkerWithName && biomarkerWithName.id !== biomarker.id) {
      throw new BadRequestException({
        message: this.translator.translate('BIOMARKER_ALREADY_EXIST'),
        errorCode: 'BIOMARKER_ALREADY_EXIST',
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    await this.biomarkersService.validateBody(body, BiomarkerTypes.bloodRule, biomarker);

    biomarker = await this.biomarkersService.updateBloodBiomarker(biomarker, body);

    return new BiomarkerDto(biomarker);
  }

  @ApiResponse({ type: () => BiomarkersDto })
  @ApiOperation({ summary: 'Get list of biomarkers' })
  @Roles(UserRoles.superAdmin)
  @Get()
  async getBiomarkersList(@Query() query: GetBiomarkerListDto): Promise<BiomarkersDto> {
    const limit = parseInt(query.limit);
    const offset = parseInt(query.offset);
    const orderBy = biomarkerSortingServerValues[query.orderBy];

    let biomarkersList = [];
    const scopes: any[] = [
      { method: ['byType', [BiomarkerTypes.blood, BiomarkerTypes.skin]] },
      { method: ['withCategory', true] },
      'withUnit'
    ];

    if (query.search) {
      scopes.push({ method: ['search', query.search] });
    }

    if (query.categoryIds && query.categoryIds.length) {
      scopes.push({ method: ['byCategoryId', query.categoryIds] });
    }

    const count = await this.biomarkersService.getCount(scopes);

    if (count) {
      if (orderBy !== 'createdAt') {
        scopes.push({ method: ['orderBy', [[orderBy, query.orderType], ['createdAt', 'desc']]] });
      } else {
        scopes.push({ method: ['orderBy', [['createdAt', query.orderType]]] });
      }  

      scopes.push(
        { method: ['pagination', { limit, offset }] },
        'withFilters',
        'withAlternativeNames'
      );
      biomarkersList = await this.biomarkersService.getList(scopes);
    }

    return new BiomarkersDto(biomarkersList, PaginationHelper.buildPagination({ limit, offset }, count));
  }

  @ApiResponse({ type: () => BiomarkerDto })
  @ApiOperation({ summary: 'Get biomarker by id' })
  @ApiParam({ name: 'id' })
  @Roles(UserRoles.superAdmin)
  @Get('/:id')
  async getBiomarkerById(@Param('id') id: number): Promise<BiomarkerDto> {
    const biomarker = await this.biomarkersService.getOne(
      [
        { method: ['byId', id] },
        { method: ['byType', [BiomarkerTypes.blood, BiomarkerTypes.skin]] },
        'withCategory',
        'withUnit',
        'withAlternativeNames',
        'withRule',
      ],
      null,
      { filters: { isIncludeAll: true } }
    );

    if (!biomarker) {
      throw new NotFoundException({
        message: this.translator.translate('BIOMARKER_NOT_FOUND'),
        errorCode: 'BIOMARKER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    return new BiomarkerDto(biomarker);
  }

  @ApiOperation({ summary: 'Delete biomarker by id' })
  @ApiParam({ name: 'id' })
  @Roles(UserRoles.superAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async removeBiomarker(@Param() param: EntityByIdDto): Promise<void> {
    const biomarker = await this.biomarkersService.getOne([
      { method: ['byId', param.id] },
      { method: ['byType', [BiomarkerTypes.blood, BiomarkerTypes.skin]] }
    ]);

    if (!biomarker) {
      throw new NotFoundException({
        message: this.translator.translate('BIOMARKER_NOT_FOUND'),
        errorCode: 'BIOMARKER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    await biomarker.destroy();
  }

  @ApiCreatedResponse({ type: () => RecommendationDto })
  @ApiOperation({ summary: 'Create recommendation' })
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRoles.superAdmin)
  @Post('recommendations')
  async createRecommendation(@Body() body: CreateRecommendationDto, @Request() req: Request & { user: SessionDataDto }): Promise<RecommendationDto> {
    if (body.impacts && body.impacts.length) {
      const biomarkerIdsMap = body.impacts.reduce(
        (idsMap, impact) => {
          idsMap[impact.biomarkerId] = true;
          return idsMap;
        },
        {}
      );
      const biomarkerIdsCount = Object.keys(biomarkerIdsMap).length;
      const biomarkersCount = await this.biomarkersService.getCount([
        { method: ['byId', body.impacts.map(impact => impact.biomarkerId)] },
        { method: ['byType', [BiomarkerTypes.blood, BiomarkerTypes.skin]] },
        { method: ['byIsDeleted', false] }
      ]);
      if (biomarkersCount !== biomarkerIdsCount) {
        throw new NotFoundException({
          message: this.translator.translate('BIOMARKER_NOT_FOUND'),
          errorCode: 'BIOMARKER_NOT_FOUND',
          statusCode: HttpStatus.NOT_FOUND
        });
      }
    }

    const createdRecommendation = await this.recommendationsService.create(body, req.user);

    return new RecommendationDto(createdRecommendation);
  }

  @ApiResponse({ type: () => BiomarkerDto })
  @ApiOperation({ summary: 'Get rule by id' })
  @ApiParam({ name: 'id' })
  @Roles(UserRoles.superAdmin)
  @Get('rules/:id')
  async getRuleById(@Param() param: EntityByIdDto): Promise<BiomarkerDto> {
    let biomarkerDto = await this.cacheService.get(RULE_PREFIX, param.id);

    if (biomarkerDto) {
      return biomarkerDto;
    }

    const biomarker = await this.biomarkersService.getOne(
      [
        { method: ['byId', param.id] },
        { method: ['byType', ruleTypes] },
        { method: ['byIsDeleted', false] },
      ],
      null,
      { filters: { isIncludeAll: true } }
    );

    if (!biomarker) {
      throw new NotFoundException({
        message: this.translator.translate('BIOMARKER_NOT_FOUND'),
        errorCode: 'BIOMARKER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    biomarkerDto = new BiomarkerDto(biomarker);

    await this.cacheService.set(RULE_PREFIX, param.id, biomarkerDto);

    return biomarkerDto;
  }

  @ApiCreatedResponse({ type: () => RecommendationDto })
  @ApiOperation({ summary: 'Archive recommendation' })
  @Roles(UserRoles.superAdmin)
  @Patch('recommendations/:id')
  async patchRecommendation(@Body() body: PatchRecommendationDto, @Param() params: EntityByIdDto): Promise<RecommendationDto> {
    let recommendation = await this.recommendationsService.getOne([
      { method: ['byId', params.id] },
      'withFiles',
    ], null, { isIncludeAll: true });

    if (!recommendation) {
      throw new NotFoundException({
        message: this.translator.translate('RECOMMENDATION_NOT_FOUND'),
        errorCode: 'RECOMMENDATION_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    recommendation = await recommendation.update({ isArchived: body.isArchived });

    return new RecommendationDto(recommendation);
  }

  @ApiCreatedResponse({ type: () => RecommendationDto })
  @ApiOperation({ summary: 'Get recommendation by id' })
  @Roles(UserRoles.superAdmin)
  @Get('recommendations/:id')
  async getRecommendationById(@Param() params: EntityByIdDto): Promise<RecommendationDto> {
    const recommendation = await this.recommendationsService.getOne([
      { method: ['byId', params.id] },
      'withFiles'
    ], null, { isIncludeAll: true });

    if (!recommendation) {
      throw new NotFoundException({
        message: this.translator.translate('RECOMMENDATION_NOT_FOUND'),
        errorCode: 'RECOMMENDATION_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    return new RecommendationDto(recommendation);
  }

  @ApiCreatedResponse({ type: () => RecommendationDto })
  @ApiOperation({ summary: 'Update recommendation' })
  @Roles(UserRoles.superAdmin)
  @Put('recommendations/:id')
  async updateRecommendation(@Body() body: CreateRecommendationDto, @Param() params: EntityByIdDto): Promise<RecommendationDto> {
    let recommendation = await this.recommendationsService.getOne([
      { method: ['byId', params.id] },
      'withFiles',
    ], null, { isIncludeAll: true });

    if (!recommendation) {
      throw new NotFoundException({
        message: this.translator.translate('RECOMMENDATION_NOT_FOUND'),
        errorCode: 'RECOMMENDATION_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    if (
      !recommendation.files.length
      || (recommendation.files.length && recommendation.files[0].id !== body.fileId)
    ) {
      await this.filesService.checkCanUse(body.fileId, FileTypes.recommendation, null, true);
    }

    if (body.impacts && body.impacts.length) {
      const biomarkerIdsMap = body.impacts.reduce(
        (idsMap, impact) => {
          idsMap[impact.biomarkerId] = true;
          return idsMap;
        },
        {}
      );
      const biomarkerIdsCount = Object.keys(biomarkerIdsMap).length;
      const biomarkersCount = await this.biomarkersService.getCount([
        { method: ['byId', body.impacts.map(impact => impact.biomarkerId)] },
        { method: ['byType', [BiomarkerTypes.blood, BiomarkerTypes.skin]] },
        { method: ['byIsDeleted', false] }
      ]);
      if (biomarkersCount !== biomarkerIdsCount) {
        throw new NotFoundException({
          message: this.translator.translate('BIOMARKER_NOT_FOUND'),
          errorCode: 'BIOMARKER_NOT_FOUND',
          statusCode: HttpStatus.NOT_FOUND
        });
      }
    }

    await this.recommendationsService.update(recommendation, body);

    recommendation = await this.recommendationsService.getOne(
      [
        { method: ['byId', params.id] },
        'withFiles',
      ],
      null,
      { isIncludeAll: true }
    );

    return new RecommendationDto(recommendation);
  }

  @ApiOperation({ summary: 'Delete recommendation by id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRoles.superAdmin)
  @Delete('recommendations/:id')
  async deleteRecommendationById(@Param() params: EntityByIdDto): Promise<void> {
    const recommendation = await this.recommendationsService.getOne([
      { method: ['byId', params.id] },
    ]);

    if (!recommendation) {
      throw new NotFoundException({
        message: this.translator.translate('RECOMMENDATION_NOT_FOUND'),
        errorCode: 'RECOMMENDATION_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    await recommendation.destroy();
  }

  @ApiOperation({ summary: 'Copy recommendation' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRoles.superAdmin)
  @Patch('recommendations/:id/copy')
  async copyRecommendation(@Param() params: EntityByIdDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
    const recommendation = await this.recommendationsService.getOne([
      { method: ['byId', params.id] },
      'withFiles'
    ], null, { isIncludeAll: true });

    if (!recommendation) {
      throw new NotFoundException({
        message: this.translator.translate('RECOMMENDATION_NOT_FOUND'),
        errorCode: 'RECOMMENDATION_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    await this.recommendationsService.copy(recommendation, req.user);
  }

  @ApiCreatedResponse({ type: () => BiomarkerDto })
  @ApiOperation({ summary: 'Create skin biomarker' })
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRoles.superAdmin)
  @Post('/skin')
  async createSkinBiomarker(@Body() body: CreateSkinBiomarkerDto): Promise<BiomarkerDto> {
    let biomarker = await this.biomarkersService.getOne([
      { method: ['byName', body.name] },
      { method: ['byType', BiomarkerTypes.skin] }
    ]);

    if (biomarker) {
      throw new BadRequestException({
        message: this.translator.translate('BIOMARKER_ALREADY_EXIST'),
        errorCode: 'BIOMARKER_ALREADY_EXIST',
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    await this.biomarkersService.validateBody(body, BiomarkerTypes.skinRule);

    biomarker = await this.biomarkersService.createSkinBiomarker(body);

    return new BiomarkerDto(biomarker);
  }

  @ApiResponse({ type: () => BiomarkerDto })
  @ApiOperation({ summary: 'Update skin biomarker' })
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.superAdmin)
  @Put('/skin/:id')
  async updateSkinBiomarker(@Param() param: EntityByIdDto, @Body() body: UpdateSkinBiomarkerDto): Promise<BiomarkerDto> {
    let biomarker = await this.biomarkersService.getOne(
      [
        { method: ['byId', param.id] },
        { method: ['byType', BiomarkerTypes.skin] },
        'withFilters'
      ],
      null,
      { filters: { isIncludeAll: true } }
    );

    if (!biomarker) {
      throw new NotFoundException({
        message: this.translator.translate('BIOMARKER_NOT_FOUND'),
        errorCode: 'BIOMARKER_NOT_FOUND',
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    const biomarkerWithName = await this.biomarkersService.getOne([
      { method: ['byName', body.name] },
      { method: ['byType', BiomarkerTypes.skin] },
    ]);

    if (biomarkerWithName && biomarkerWithName.id !== biomarker.id) {
      throw new BadRequestException({
        message: this.translator.translate('BIOMARKER_ALREADY_EXIST'),
        errorCode: 'BIOMARKER_ALREADY_EXIST',
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    await this.biomarkersService.validateBody(body, BiomarkerTypes.skinRule, biomarker);

    biomarker = await this.biomarkersService.updateSkinBiomarker(biomarker, body);

    return new BiomarkerDto(biomarker);
  }

  @ApiOperation({ summary: 'Patch skin biomarker' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRoles.superAdmin)
  @Patch('/skin/:id')
  async patchSkinBiomarker(@Param() param: EntityByIdDto, @Body() body: PatchSkinBiomarkerDto): Promise<void> {
    const biomarker = await this.biomarkersService.getOne(
      [
        { method: ['byId', param.id] },
        { method: ['byType', BiomarkerTypes.skin] }
      ]
    );

    if (!biomarker) {
      throw new NotFoundException({
        message: this.translator.translate('BIOMARKER_NOT_FOUND'),
        errorCode: 'BIOMARKER_NOT_FOUND',
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    await biomarker.update({ isActive: body.isActive });
  }
}
