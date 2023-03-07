import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TranslatorService } from 'nestjs-translator';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { Hl7Service } from './hl7.service';
import { GetHl7ObjectBySampleCodeDto } from './models/get-hl7-object-by-sample-code.dto';
import { Hl7ObjectDto } from './models/hl7-object.dto';

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
}
