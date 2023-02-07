import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRoles } from 'apps/common/src/resources/users';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { GenerateSamplesDto } from './models/generate-samples.dto';
import { SamplesService } from './samples.service';

@ApiBearerAuth()
@ApiTags('samples')
@Controller('samples')
export class SamplesController {
  constructor(
    private readonly samplesService: SamplesService
  ) { }

  @Post()
  @Roles(UserRoles.superAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Generate samples' })
  async generateSamples(@Body() body: GenerateSamplesDto): Promise<void> {
    await this.samplesService.generateSamples(body);
  }
}
