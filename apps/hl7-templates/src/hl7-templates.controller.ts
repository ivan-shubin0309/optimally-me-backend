import { Body, Controller, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessionDataDto } from '../../sessions/src/models';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { Hl7TemplatesService } from './hl7-templates.service';
import { Hl7TemplateDto } from './models/hl7-template.dto';
import { PostHl7TemplateDto } from './models/post-hl7-template.dto';

@ApiBearerAuth()
@ApiTags('hl7/templates')
@Controller('hl7/templates')
export class Hl7TemplatesController {
    constructor(
        private readonly hl7TemplatesService: Hl7TemplatesService
    ) { }

    @ApiCreatedResponse({ type: () => Hl7TemplateDto })
    @ApiOperation({ summary: 'Get list of user biomarkers' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createTemplate(@Body() body: PostHl7TemplateDto, @Request() req: Request & { user: SessionDataDto }): Promise<Hl7TemplateDto> {
        const template = await this.hl7TemplatesService.create(Object.assign({ userId: req.user.userId }, body));

        return new Hl7TemplateDto(template);
    }
}
