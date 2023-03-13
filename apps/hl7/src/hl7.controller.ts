import { BadRequestException, Body, Controller, Get, Headers, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TranslatorService } from 'nestjs-translator';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { Hl7Service } from './hl7.service';
import { GetHl7ObjectBySampleCodeDto } from './models/get-hl7-object-by-sample-code.dto';
import { Hl7ObjectDto } from './models/hl7-object.dto';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { Hl7ObjectsDto } from './models/hl7-objects.dto';
import { GetHl7ObjectListDto } from './models/get-hl7-object-list.dto';
import { EntityByIdDto } from '../../common/src/models/entity-by-id.dto';
import { Hl7ObjectStatuses } from '../../common/src/resources/hl7/hl7-object-statuses';
import { PatchHl7ObjectStatusDto } from './models/patch-hl7-object-status.dto';
import { Public } from '../../common/src/resources/common/public.decorator';
import { JwtService } from '@nestjs/jwt';

@ApiBearerAuth()
@ApiTags('hl7')
@Controller('hl7')
export class Hl7Controller {
    constructor(
        private readonly hl7Service: Hl7Service,
        private readonly translator: TranslatorService,
        private readonly jwtService: JwtService,
    ) { }

    @ApiResponse({ type: () => Hl7ObjectDto })
    @ApiOperation({ summary: 'Get hl7 object by sample code' })
    @Roles(UserRoles.superAdmin)
    @HttpCode(HttpStatus.OK)
    @Get('/hl7-objects/:sampleCode')
    async getHl7ObjectBySampleCode(@Param() param: GetHl7ObjectBySampleCodeDto): Promise<Hl7ObjectDto> {
        const scopes = [
            { method: ['bySampleCode', param.sampleCode] }
        ];
        const hl7Object = await this.hl7Service.getOne(scopes);

        if (!hl7Object) {
            throw new NotFoundException({
                message: this.translator.translate('HL7_OBJECT_NOT_FOUND'),
                errorCode: 'HL7_OBJECT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        return new Hl7ObjectDto(hl7Object);
    }

    @ApiResponse({ type: () => Hl7ObjectsDto })
    @ApiOperation({ summary: 'Get hl7 object list' })
    @Roles(UserRoles.superAdmin)
    @HttpCode(HttpStatus.OK)
    @Get('/hl7-objects')
    async getHl7ObjectList(@Query() query: GetHl7ObjectListDto): Promise<Hl7ObjectsDto> {
        let hl7ObjectsList = [];
        const scopes: any[] = [];

        if (query.search) {
            scopes.push({ method: ['search', query.search] });
        }

        if (query.activatedAtStartDate || query.activatedAtEndDate) {
            scopes.push({ method: ['byActivatedAtInterval', query.activatedAtStartDate, query.activatedAtEndDate] });
        }

        if (query.sampleAtStartDate || query.sampleAtEndDate) {
            scopes.push({ method: ['bySampleAtInterval', query.sampleAtStartDate, query.sampleAtEndDate] });
        }

        if (query.labReceivedAtStartDate || query.labReceivedAtEndDate) {
            scopes.push({ method: ['byLabReceivedAtInterval', query.labReceivedAtStartDate, query.labReceivedAtEndDate] });
        }

        if (query.resultAtStartDate || query.resultAtEndDate) {
            scopes.push({ method: ['byResultAtInterval', query.resultAtStartDate, query.resultAtEndDate] });
        }

        if (query.dateOfBirthStartDate || query.dateOfBirthEndDate) {
            scopes.push({ method: ['byDateOfBirthInterval', query.dateOfBirthStartDate, query.dateOfBirthEndDate] });
        }

        if (query.status) {
            scopes.push({ method: ['byStatus', query.status] });
        }

        const count = await this.hl7Service.getCount(scopes);

        if (count) {
            scopes.push(
                { method: ['pagination', { limit: query.limit, offset: query.offset }] },
                { method: ['orderBy', [[query.orderBy, query.orderType]]] }
            );
            hl7ObjectsList = await this.hl7Service.getList(scopes);
        }

        return new Hl7ObjectsDto(hl7ObjectsList, PaginationHelper.buildPagination({ limit: query.limit, offset: query.offset }, count));
    }

    @ApiOperation({ summary: 'Patch status field' })
    @Roles(UserRoles.superAdmin)
    @HttpCode(HttpStatus.OK)
    @Patch('/hl7-objects/:id/status')
    async patchStatus(@Param() param: EntityByIdDto, @Body() body: PatchHl7ObjectStatusDto): Promise<void> {
        const hl7Object = await this.hl7Service.getOne([{ method: ['byId', param.id] }]);

        if (!hl7Object) {
            throw new NotFoundException({
                message: this.translator.translate('HL7_OBJECT_NOT_FOUND'),
                errorCode: 'HL7_OBJECT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        if (hl7Object.status !== Hl7ObjectStatuses.error) {
            throw new BadRequestException({
                message: this.translator.translate('HL7_OBJECT_NOT_ERROR_STATUS'),
                errorCode: 'HL7_OBJECT_NOT_ERROR_STATUS',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        await hl7Object.update({ status: body.status });
    }

    @Public()
    @ApiOperation({ summary: 'Hl7 object generator webhook' })
    @HttpCode(HttpStatus.OK)
    @Post('/webhook/object-generator')
    async generateHl7ObjectsWebhook(@Headers('Authorization') authHeader): Promise<void> {
        const token = authHeader && authHeader.split(' ')[1];

        const decodedToken: any = this.jwtService.decode(token);

        if (!decodedToken || !decodedToken.isWebhook) {
            throw new UnauthorizedException({
                message: this.translator.translate('WRONG_CREDENTIALS'),
                errorCode: 'WRONG_CREDENTIALS',
                statusCode: HttpStatus.UNAUTHORIZED
            });
        }

        await this.hl7Service.generateHl7ObjectsFromSamples();
    }
}