import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRoles } from '../../common/src/resources/users';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { GenerateSamplesDto } from './models/generate-samples.dto';
import { GetSamplesListDto } from './models/get-samples-list.dto';
import { SamplesService } from './samples.service';
import { PaginationHelper } from 'apps/common/src/utils/helpers/pagination.helper';
import { SamplesDto } from './models/samples.dto';
import { TranslatorService } from 'nestjs-translator';
import { CheckSampleIdDto } from './models/check-sample-id.dto';

@ApiBearerAuth()
@ApiTags('samples')
@Controller('samples')
export class SamplesController {
    constructor(
        private readonly samplesService: SamplesService,
        private readonly translator: TranslatorService,
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
    async getSamplesList(@Query() query: GetSamplesListDto): Promise<SamplesDto> {
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

    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Check sample id' })
    @Get('/sampleId')
    async checkSampleId(@Query() query: CheckSampleIdDto): Promise<void> {
        const sample = await this.samplesService.getOne([
            { method: ['byIsActive', true] },
            { method: ['bySampleId', query.sampleId] }
        ]);

        if (!sample) {
            throw new NotFoundException({
                message: this.translator.translate('SAMPLE_NOT_FOUND'),
                errorCode: 'SAMPLE_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }
    }
}
