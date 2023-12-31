import { Body, Controller, Get, HttpCode, HttpStatus, Put, Query, Request, Patch, Inject, BadRequestException } from '@nestjs/common';
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
import { UsersWidgetDataSourcesService } from './users-widget-data-sources.service';
import { UserWidgetDataSourcesDto } from './models/user-widget-data-sources.dto';
import { PatchWidgetDataSourcesDto } from './models/patch-widget-data-sources.dto';
import { WefitterService } from '../../wefitter/src/wefitter.service';
import { WefitterMetricTypes } from '../../common/src/resources/wefitter/wefitter-metric-types';
import { Sequelize } from 'sequelize-typescript';
import { TranslatorService } from 'nestjs-translator';
import { PutDahboardSettingsDto } from './models/put-dashboard-settings.dto';
import { UsersDashboardSettingsService } from './users-dashboard-settings.service';
import { UsersMetricGraphSettingsService } from './users-metric-graph-service';
import { UserDashboardSettingDto } from './models/user-dashboard-setting.dto';
import { PutMetricGraphSettingsDto } from './models/put-metric-graph-setting.dto';
import { UserMetricGraphSettingDto } from './models/user-metric-graph-setting.dto';

@ApiBearerAuth()
@ApiTags('users/widgets')
@Controller('users')
export class UsersWidgetsController {
    constructor(
        private readonly usersWidgetSettingsService: UsersWidgetSettingsService,
        private readonly usersWidgetDataSourcesService: UsersWidgetDataSourcesService,
        private readonly wefitterService: WefitterService,
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
        private readonly translator: TranslatorService,
        private readonly usersDashboardSettingsService: UsersDashboardSettingsService,
        private readonly usersMetricGraphSettingsService: UsersMetricGraphSettingsService,
    ) { }

    @ApiOperation({ summary: 'Set dashboard widget settings' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Put('/widgets/dashboard-settings')
    async setDashboardWidgetSettings(@Body() body: PutWidgetUserDashboardSettingsDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
        await this.usersWidgetSettingsService.bulkCreateDashboardSettings(body, req.user.userId);
    }

    @ApiResponse({ type: () => UserWidgetSettingsDto })
    @ApiOperation({ summary: 'Get dashboard widget settings' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Get('/widgets/settings')
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
    @Put('/widgets/device-data-settings')
    async setDeviceDataWidgetSettings(@Body() body: PutWidgetUserDeviceDataSettingsDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
        await this.usersWidgetSettingsService.bulkCreateDeviceDataSettings(body, req.user.userId);
    }

    @ApiResponse({ type: () => UserWidgetDataSourcesDto })
    @ApiOperation({ summary: 'Get active data sources' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Get('/widgets/data-sources')
    async getWidgetDataSources(@Request() req: Request & { user: SessionDataDto }): Promise<UserWidgetDataSourcesDto> {
        const dataSourcesList = await this.usersWidgetDataSourcesService.getList([
            { method: ['byUserId', req.user.userId] }
        ]);

        return new UserWidgetDataSourcesDto(dataSourcesList);
    }

    @ApiResponse({ type: () => UserWidgetDataSourcesDto })
    @ApiOperation({ summary: 'Set active data sources' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Patch('/widgets/data-sources')
    async postWidgetDataSources(@Request() req: Request & { user: SessionDataDto }, @Body() body: PatchWidgetDataSourcesDto): Promise<void> {
        await this.dbConnection.transaction(async transaction => {
            const dataSourcesList = await this.usersWidgetDataSourcesService.getList(
                [
                    { method: ['byUserId', req.user.userId] }
                ],
                transaction
            );
            await Promise.all(
                body.data.map(async dataSource => {
                    const allowedSources = await this.wefitterService.getSourcesByMetricType(req.user.userId, WefitterMetricTypes[dataSource.metricName], transaction);

                    if (!allowedSources.includes(dataSource.source)) {
                        throw new BadRequestException({
                            message: this.translator.translate('DATA_SOURCE_INVALID'),
                            errorCode: 'DATA_SOURCE_INVALID',
                            statusCode: HttpStatus.BAD_REQUEST
                        });
                    }

                    const dataSourceFromList = dataSourcesList.find(entity => entity.metricType === WefitterMetricTypes[dataSource.metricName]);

                    if (dataSourceFromList) {
                        await dataSourceFromList.update({ source: dataSource.source }, { transaction });
                    } else {
                        await this.usersWidgetDataSourcesService.create({ source: dataSource.source, metricType: WefitterMetricTypes[dataSource.metricName], userId: req.user.userId }, transaction);
                    }
                })
            );
        });
    }

    @ApiOperation({ summary: 'Set dashboard settings' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Put('/dashboard-settings')
    async setDashboardSettings(@Body() body: PutDahboardSettingsDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
        await this.usersDashboardSettingsService.updateOrCreate(Object.assign({ userId: req.user.userId }, body));
    }

    @ApiResponse({ type: () => UserDashboardSettingDto })
    @ApiOperation({ summary: 'Get dashboard settings' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Get('/dashboard-settings')
    async getDashboardSettings(@Request() req: Request & { user: SessionDataDto }): Promise<UserDashboardSettingDto | object> {
        const dashboardSetting = await this.usersDashboardSettingsService.getOne([
            { method: ['byUserId', req.user.userId] }
        ]);

        if (!dashboardSetting) {
            return {};
        }

        return new UserDashboardSettingDto(dashboardSetting);
    }

    @ApiOperation({ summary: 'Set metric graph settings' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Put('/widgets/metric-graph-settings')
    async setMetricGraphSettings(@Body() body: PutMetricGraphSettingsDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
        await this.usersMetricGraphSettingsService.updateOrCreate(Object.assign({ userId: req.user.userId }, body));
    }

    @ApiResponse({ type: () => UserMetricGraphSettingDto })
    @ApiOperation({ summary: 'Get metric graph settings' })
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.OK)
    @Get('/widgets/metric-graph-settings')
    async getMetricGraphSettings(@Request() req: Request & { user: SessionDataDto }): Promise<UserMetricGraphSettingDto | object> {
        const metricGraphSetting = await this.usersMetricGraphSettingsService.getOne([
            { method: ['byUserId', req.user.userId] }
        ]);

        if (!metricGraphSetting) {
            return {};
        }

        return new UserMetricGraphSettingDto(metricGraphSetting);
    }
}
