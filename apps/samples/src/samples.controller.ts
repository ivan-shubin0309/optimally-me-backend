import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRoles } from '../../common/src/resources/users';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { GenerateSamplesDto } from './models/generate-samples.dto';
import { GetSamplesListDto } from './models/get-samples-list.dto';
import { SamplesService } from './samples.service';
import { PaginationHelper } from 'apps/common/src/utils/helpers/pagination.helper';
import { SamplesDto } from './models/samples.dto';

@ApiBearerAuth()
@ApiTags('samples')
@Controller('samples')
export class SamplesController {
    constructor(
        private readonly samplesService: SamplesService
    ) { }

    @Roles(UserRoles.superAdmin)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Generate samples' })
    @Post()
    async generateSamples(@Body() body: GenerateSamplesDto): Promise<void> {
        await this.samplesService.generateSamples(body);
    }

    @Roles(UserRoles.superAdmin)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ type: () => GetSamplesListDto })
    @ApiOperation({ summary: 'Get list of samples' })
    @Get()
    async get(@Query() query: GetSamplesListDto): Promise<SamplesDto> {
        let samplesList = [];
        const scopes: any[] = [];

        if (typeof query.isActive === 'boolean') {
            scopes.push({ method: ['byIsActive', query.isActive] });
        }

        const count = await this.samplesService.getCount(scopes);

        if (count) {
            scopes.push(
                { method: ['pagination', { limit: query.limit, offset: query.offset }] },
            );
            samplesList = await this.samplesService.getList(scopes);
        }

        return new SamplesDto(samplesList, PaginationHelper.buildPagination({ limit: query.limit, offset: query.offset }, count));
    }
}
