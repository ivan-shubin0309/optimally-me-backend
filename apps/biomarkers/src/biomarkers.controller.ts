import { Get, Controller, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { BiomarkersService } from './biomarkers.service';
import { CategoriesDto } from './models';
import { GetListDto } from '../../common/src/models/get-list.dto';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';

@ApiBearerAuth()
@ApiTags('biomarkers')
@Controller('biomarkers')
export class BiomarkersController {
  constructor(
    private readonly biomarkersService: BiomarkersService,
  ) {}

  @ApiCreatedResponse({ type: () => CategoriesDto })
  @ApiOperation({ summary: 'Get list categories' })
  @Roles(UserRoles.superAdmin)
  @Get('categories')
  async getListCategories(@Query() query: GetListDto): Promise<CategoriesDto> {
    const limit = parseInt(query.limit);
    const offset = parseInt(query.offset);

    let categoriesList = [];
    const scopes: any[] = [];

    const count = await this.biomarkersService.getCategoriesCount();

    if (count) {
      scopes.push({ method: ['pagination', { limit, offset }] });
      categoriesList = await this.biomarkersService.getListCategories(scopes);
    }

    return new CategoriesDto(categoriesList, PaginationHelper.buildPagination({ limit, offset }, count));
  }
}
