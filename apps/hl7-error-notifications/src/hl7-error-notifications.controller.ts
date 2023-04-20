import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { Hl7ErrorNotificationsService } from './hl7-error-notifications.service';
import { GetHl7ErrorNotificationListDto } from './models/get-hl7-error-notification-list.dto';
import { Hl7ErrorNotificationsDto } from './models/hl7-error-notifications.dto';

@ApiBearerAuth()
@ApiTags('hl7/notifications')
@Controller('hl7/notifications')
export class Hl7ErrorNotificationsController {
    constructor(
        private readonly hl7ErrorNotificationsService: Hl7ErrorNotificationsService
    ) { }

    @ApiResponse({ type: () => Hl7ErrorNotificationsDto })
    @ApiOperation({ summary: 'Get hl7 error notifications' })
    @Roles(UserRoles.superAdmin)
    @HttpCode(HttpStatus.OK)
    @Get()
    async getHl7ObjectNotifications(@Query() query: GetHl7ErrorNotificationListDto): Promise<Hl7ErrorNotificationsDto> {
        let hl7ObjectsList = [];
        const scopes: any[] = [];

        if (typeof query.isResolved === 'boolean') {
            scopes.push({ method: ['byIsResolved', query.isResolved] });
        }

        const count = await this.hl7ErrorNotificationsService.getCount(scopes);

        if (count) {
            scopes.push(
                { method: ['pagination', { limit: query.limit, offset: query.offset }] },
                { method: ['orderBy', [['createdAt', 'desc']]] },
                { method: ['withHl7Object'] },
            );
            hl7ObjectsList = await this.hl7ErrorNotificationsService.getList(scopes);
        }

        return new Hl7ErrorNotificationsDto(hl7ObjectsList, PaginationHelper.buildPagination({ limit: query.limit, offset: query.offset }, count));
    }
}
