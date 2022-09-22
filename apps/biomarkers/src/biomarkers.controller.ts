import {
  Get,
  Post,
  Body,
  Controller,
  Request
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { CreateBiomarkerDto } from './models';
import { SessionDto } from '../../sessions/src/models';
import { UserRoles } from '../../common/src/resources/users';
import { BiomarkersService } from './biomarkers.service';
import { CategoriesDto } from './models';
import { TranslatorService } from 'nestjs-translator';

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
  async getListCategories(): Promise<CategoriesDto> {
    const categoriesList = { categories: [] };
    categoriesList.categories = await this.biomarkersService.getListCategories();

    return categoriesList;
  }
}
