import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Query } from '@nestjs/common';
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

@ApiBearerAuth()
@ApiTags('hl7')
@Controller('hl7')
export class Hl7Controller {
    constructor(
        private readonly hl7Service: Hl7Service,
        private readonly translator: TranslatorService,
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

        const count = await this.hl7Service.getCount(scopes);

        if (count) {
            scopes.push(
                { method: ['pagination', { limit: query.limit, offset: query.offset }] },
            );
            hl7ObjectsList = await this.hl7Service.getList(scopes);
        }

        return new Hl7ObjectsDto(hl7ObjectsList, PaginationHelper.buildPagination({ limit: query.limit, offset: query.offset }, count));
    }
}
