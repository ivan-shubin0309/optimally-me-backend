import { Body, Controller, Delete, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Put, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionDataDto } from '../../sessions/src/models';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { Hl7TemplatesService } from './hl7-templates.service';
import { Hl7TemplateDto } from './models/hl7-template.dto';
import { PostHl7TemplateDto } from './models/post-hl7-template.dto';
import { EntityByIdDto } from '../../common/src/models/entity-by-id.dto';
import { TranslatorService } from 'nestjs-translator';
import { PatchHl7TemplateDto } from './models/patch-hl7-template.dto';

@ApiBearerAuth()
@ApiTags('hl7/templates')
@Controller('hl7/templates')
export class Hl7TemplatesController {
    constructor(
        private readonly hl7TemplatesService: Hl7TemplatesService,
        private readonly translator: TranslatorService,
    ) { }

    @ApiCreatedResponse({ type: () => Hl7TemplateDto })
    @ApiOperation({ summary: 'Create template' })
    @Roles(UserRoles.superAdmin)
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createTemplate(@Body() body: PostHl7TemplateDto, @Request() req: Request & { user: SessionDataDto }): Promise<Hl7TemplateDto> {
        const template = await this.hl7TemplatesService.create(Object.assign({ userId: req.user.userId }, body));

        return new Hl7TemplateDto(template);
    }

    @ApiResponse({ type: () => Hl7TemplateDto })
    @ApiOperation({ summary: 'Update template by id' })
    @Roles(UserRoles.superAdmin)
    @HttpCode(HttpStatus.OK)
    @Put('/:id')
    async updateTemplate(@Param() params: EntityByIdDto, @Body() body: PostHl7TemplateDto, @Request() req: Request & { user: SessionDataDto }): Promise<Hl7TemplateDto> {
        const template = await this.hl7TemplatesService.getOne([
            { method: ['byUserIdOrPublic', req.user.userId] },
            { method: ['byId', params.id] }
        ]);

        if (!template) {
            throw new NotFoundException({
                message: this.translator.translate('HL7_TEMPLATE_NOT_FOUND'),
                errorCode: 'HL7_TEMPLATE_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        await template.update(body);

        return new Hl7TemplateDto(template);
    }

    @ApiOperation({ summary: 'Delete template by id' })
    @Roles(UserRoles.superAdmin)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    async destroyTemplate(@Param() params: EntityByIdDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
        const template = await this.hl7TemplatesService.getOne([
            { method: ['byUserIdOrPublic', req.user.userId] },
            { method: ['byId', params.id] }
        ]);

        if (!template) {
            throw new NotFoundException({
                message: this.translator.translate('HL7_TEMPLATE_NOT_FOUND'),
                errorCode: 'HL7_TEMPLATE_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        await template.destroy();
    }

    @ApiResponse({ type: () => Hl7TemplateDto })
    @ApiOperation({ summary: 'Set template as favourite by id' })
    @Roles(UserRoles.superAdmin)
    @HttpCode(HttpStatus.OK)
    @Patch('/:id')
    async patchTemplate(@Param() params: EntityByIdDto, @Body() body: PatchHl7TemplateDto, @Request() req: Request & { user: SessionDataDto }): Promise<Hl7TemplateDto> {
        const template = await this.hl7TemplatesService.getOne([
            { method: ['byUserIdOrPublic', req.user.userId] },
            { method: ['byId', params.id] }
        ]);

        if (!template) {
            throw new NotFoundException({
                message: this.translator.translate('HL7_TEMPLATE_NOT_FOUND'),
                errorCode: 'HL7_TEMPLATE_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        await template.update(body);

        return new Hl7TemplateDto(template);
    }
}
