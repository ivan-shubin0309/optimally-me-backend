import { Body, Controller, Get, HttpCode, HttpStatus, Put, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionDataDto } from '../../sessions/src/models';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { PutWidgetUserDashboardSettingsDto } from './models/put-widget-user-dashboard-settings.dto';
import { UsersWidgetSettingsService } from './users-widget-settings.service';
import { EnumHelper } from '../../common/src/utils/helpers/enum.helper';
import { widgetSettingTypeToWidgetType } from '../../common/src/resources/users-widgets/users-widgets-types';
import { UserWidgetSettingsDto } from './models/user-widget-settings.dto';
import { PutWidgetUserDeviceDataSettingsDto } from './models/put-widget-user-device-data-settings.dto';
import { GetWidgetSettingsDto } from './models/get-widget-settings.dto';

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
    @Get('settings')
    async getWidgetSettings(@Query() query: GetWidgetSettingsDto, @Request() req: Request & { user: SessionDataDto }): Promise<UserWidgetSettingsDto> {
        const widgetTypeEnum = widgetSettingTypeToWidgetType[query.widgetSettingType];

        const dashboardSettingsList = await this.usersWidgetSettingsService.getList([
            {
                method: [
                    'byWidgetType',
                    EnumHelper
                        .toCollection(widgetTypeEnum)
                        .map(widgetType => widgetType.value)
                ]
            },
            { method: ['byUserId', req.user.userId] },
            { method: ['orderBy', [['order', 'asc']]] }
        ]);

        return new UserWidgetSettingsDto(dashboardSettingsList);
    }

    @ApiOperation({ summary: 'Set device data widget settings' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Put('device-data-settings')
    async setDeviceDataWidgetSettings(@Body() body: PutWidgetUserDeviceDataSettingsDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
        await this.usersWidgetSettingsService.bulkCreateDeviceDataSettings(body, req.user.userId);
    }
}
