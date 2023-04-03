import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRoles } from '../../common/src/resources/users';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { GenerateSamplesDto } from './models/generate-samples.dto';
import { GetSamplesListDto } from './models/get-samples-list.dto';
import { SamplesService } from './samples.service';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { SamplesDto } from './models/samples.dto';
import { TranslatorService } from 'nestjs-translator';
import { CheckSampleIdDto } from './models/check-sample-id.dto';
import { ActivateSampleDto } from './models/activate-sample.dto';
import { SessionDataDto } from '../../sessions/src/models';
import { Public } from '../../common/src/resources/common/public.decorator';
import { SampleDto } from './models/sample.dto';
import { ActivateSampleBodyDto } from './models/activate-sample-body.dto';

@ApiTags('samples')
@Controller('samples')
export class SamplesController {
    constructor(
        private readonly samplesService: SamplesService,
        private readonly translator: TranslatorService,
    ) { }

    @ApiBearerAuth()
    @Roles(UserRoles.superAdmin)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Generate samples' })
    @Post()
    async generateSamples(@Body() body: GenerateSamplesDto): Promise<void> {
        await this.samplesService.generateSamples(body);
    }

    @ApiBearerAuth()
    @Roles(UserRoles.superAdmin)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ type: () => GetSamplesListDto })
    @ApiOperation({ summary: 'Get list of samples' })
    @Get()
    async getSamplesList(@Query() query: GetSamplesListDto): Promise<SamplesDto> {
        let samplesList = [];
        const scopes: any[] = [];

        if (typeof query.isActivated === 'boolean') {
            scopes.push({ method: ['byIsActivated', query.isActivated] });
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

    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Check sample id' })
    @ApiResponse({ type: () => SampleDto })
    @Get('/sampleId')
    async checkSampleId(@Query() query: CheckSampleIdDto): Promise<SampleDto> {
        const sample = await this.samplesService.getOne([
            { method: ['byIsActivated', false] },
            { method: ['bySampleId', query.sampleId] }
        ]);

        if (!sample) {
            throw new NotFoundException({
                message: this.translator.translate('SAMPLE_NOT_FOUND'),
                errorCode: 'SAMPLE_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        return new SampleDto(sample);
    }

    @ApiBearerAuth()
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Activate sample by sampleId' })
    @ApiResponse({ type: () => SampleDto })
    @Post(':sampleId')
    async activateSample(@Param() params: ActivateSampleDto, @Body() body: ActivateSampleBodyDto, @Request() req: Request & { user: SessionDataDto }): Promise<SampleDto> {
        let sample = await this.samplesService.getOne([
            { method: ['byIsActivated', false] },
            { method: ['bySampleId', params.sampleId] }
        ]);

        if (!sample) {
            throw new NotFoundException({
                message: this.translator.translate('SAMPLE_NOT_FOUND'),
                errorCode: 'SAMPLE_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        await this.samplesService.activateSample(sample.id, req.user.userId, body.otherFeature);

        sample = await sample.reload();

        return new SampleDto(sample);
    }
}
