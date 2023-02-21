import { Body, Controller, Get, HttpCode, HttpStatus, Put, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionDataDto } from '../../sessions/src/models';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { PutWidgetUserDashboardSettingsDto } from './models/put-widget-user-dashboard-settings.dto';
import { UsersWidgetSettingsService } from './users-widget-settings.service';
import { EnumHelper } from '../../common/src/utils/helpers/enum.helper';
import { DashboardWidgetTypes } from '../../common/src/resources/users-widgets/users-widgets-types';
import { UserWidgetSettingsDto } from './models/user-widget-settings.dto';

@ApiBearerAuth()
@ApiTags('users/widgets')
@Controller('users/widgets')
export class UsersWidgetsController {
    constructor(
        private readonly usersWidgetSettingsService: UsersWidgetSettingsService
    ) { }

    @ApiOperation({ summary: 'Set dashboard widget settings' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Put('dashboard-settings')
    async setDashboardWidgetSettings(@Body() body: PutWidgetUserDashboardSettingsDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
        await this.usersWidgetSettingsService.bulkCreateDashboardSettings(body, req.user.userId);
    }

    @ApiResponse({ type: () => UserWidgetSettingsDto })
    @ApiOperation({ summary: 'Get dashboard widget settings' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Get('dashboard-settings')
    async getDashboardWidgetSettings(@Request() req: Request & { user: SessionDataDto }): Promise<UserWidgetSettingsDto> {
        const dashboardSettingsList = await this.usersWidgetSettingsService.getList([
            {
                method: [
                    'byWidgetType',
                    EnumHelper
                        .toCollection(DashboardWidgetTypes)
                        .map(widgetType => widgetType.value)
                ]
            },
            { method: ['byUserId', req.user.userId] },
            { method: ['orderBy', [['order', 'asc']]] }
        ]);

        return new UserWidgetSettingsDto(dashboardSettingsList);
    }
}
