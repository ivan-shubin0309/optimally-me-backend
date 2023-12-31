import {
    Get,
    Post,
    Controller,
    Request,
    HttpStatus,
    BadRequestException,
    Delete,
    HttpCode,
    Query,
    NotFoundException,
    Body,
    Patch,
    Response,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WefitterService, measurementTypeToMetricType } from './wefitter.service';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { TranslatorService } from 'nestjs-translator';
import { WefitterProfileDto } from './models/wefitter-profile.dto';
import { UsersService } from '../../users/src/users.service';
import { WefitterConnectionsDto } from './models/wefitter-connections.dto';
import { DeleteConnectionDto } from './models/delete-connection.dto';
import { GetUserConnectionsDto } from './models/get-user-connections.dto';
import { UserWefitterDto } from './models/user-wefitter.dto';
import { SessionDataDto } from '../../sessions/src/models';
import { PatchUserWefitterDto } from './models/patch-user-wefitter.dto';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { ConnectionRedirectDto } from './models/connection-redirect.dto';
import { Public } from 'apps/common/src/resources/common/public.decorator';
import { WefitterUserDailySummaryDto } from './models/wefitter-user-daily-summary.dto';
import { nonWefitterFieldNames } from '../../common/src/resources/wefitter/non-wefitter-connection-slugs';
import { WefitterUserHeartrateSummaryDto } from './models/wefitter-user-heartrate-summary.dto';
import { WefitterUserSleepSummaryDto } from './models/wefitter-user-sleep-summary.dto';
import { GetWefitterResultAveragesDto } from './models/get-wefitter-result-averages.dto';
import { WefitterResultAveragesDto } from './models/wefitter-result-averages.dto';
import { GetWefitterResultsDto } from './models/get-wefitter-results.dto';
import { WefitterMetricResultsDto } from './models/wefitter-metric-results.dto';
import { WefitterMetricNamesDto } from './models/wefitter-metric-names.dto';
import { ProfileWefitterBiometricMeasurementDto } from './models/biometric-measurements/profile-wefitter-biometric-measurement.dto';
import { UsersWidgetDataSourcesService } from '../../users-widgets/src/users-widget-data-sources.service';
import { WefitterMetricTypes } from '../../common/src/resources/wefitter/wefitter-metric-types';
import { WefitterSourcesListDto } from './models/wefitter-sources-list.dto';
import { GetWefitterSourcesListDto } from './models/get-wefitter-sources-list.dto';
import { wefitterSources } from 'apps/common/src/resources/wefitter/wefitter-sources';

@ApiTags('wefitter')
@Controller('wefitter')
export class WefitterController {
    constructor(
        private readonly wefitterService: WefitterService,
        private readonly usersService: UsersService,
        private readonly translator: TranslatorService,
        private readonly configService: ConfigService,
        private readonly usersWidgetDataSourcesService: UsersWidgetDataSourcesService,
    ) {}

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => WefitterProfileDto })
    @ApiOperation({ summary: 'Create wefitter user profile' })
    @Post('profile')
    async createProfile(@Request() req): Promise<WefitterProfileDto> {
        const scopes = [
            { method: ['withWefitter'] }
        ];
        const user = await this.usersService.getUser(req.user.userId, scopes);
        if (user.wefitter && user.wefitter.publicId) {
            throw new BadRequestException({
                message: this.translator.translate('WEFITTER_PROFILE_ALREADY_EXIST'),
                errorCode: 'WEFITTER_PROFILE_ALREADY_EXIST',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }
        const wefitterProfile = await this.wefitterService.createProfile(user);
        return new WefitterProfileDto(wefitterProfile);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => WefitterProfileDto })
    @ApiOperation({ summary: 'Get current wefitter user profile' })
    @Get('profile')
    async getMyProfile(@Request() req): Promise<WefitterProfileDto> {
        const scopes = [
            { method: ['withWefitter'] }
        ];
        const user = await this.usersService.getUser(req.user.userId, scopes);
        if (!user) {
            throw new BadRequestException({
                message: this.translator.translate('USER_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }
        const { wefitter: { publicId, bearer } } = user;
        if (!publicId || !bearer) {
            throw new BadRequestException({
                message: this.translator.translate('WEFITTER_PROFILE_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }
        const wefitterProfile = await this.wefitterService.getProfile(publicId, bearer);
        return new WefitterProfileDto(wefitterProfile);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => WefitterConnectionsDto })
    @ApiOperation({ summary: 'Get wefitter connections' })
    @Get('connections')
    async getUserConnections(@Request() req, @Query() query: GetUserConnectionsDto): Promise<WefitterConnectionsDto> {
        const scopes = [
            { method: ['withWefitter'] }
        ];
        const user = await this.usersService.getUser(req.user.userId, scopes);
        if (!user) {
            throw new BadRequestException({
                message: this.translator.translate('USER_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        if (!user.wefitter || !user.wefitter.publicId || !user.wefitter.bearer) {
            throw new BadRequestException({
                message: this.translator.translate('WEFITTER_PROFILE_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }
        const connections = await this.wefitterService.getConnections(user.wefitter.publicId, user.wefitter.bearer, query);
        return new WefitterConnectionsDto(connections);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user wefitter connection' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('connection')
    async deleteUserConnections(@Request() req, @Query() query: DeleteConnectionDto): Promise<void> {
        const { connectionSlug, deleteData, isWefitterConnectionSlug } = query;
        const scopes = [
            { method: ['withWefitter'] }
        ];
        const user = await this.usersService.getUser(req.user.userId, scopes);
        if (!user) {
            throw new BadRequestException({
                message: this.translator.translate('USER_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }
        if (!user.wefitter || !user.wefitter.publicId || !user.wefitter.bearer) {
            throw new BadRequestException({
                message: this.translator.translate('WEFITTER_PROFILE_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }
        if (deleteData) {
            await this.wefitterService.deleteAllUserData(user.id, query.connectionSlug.toUpperCase());
        }

        if (isWefitterConnectionSlug) {
            await this.wefitterService.deleteConnection(user.wefitter.publicId, user.wefitter.bearer, connectionSlug);
        } else {
            const fieldName = nonWefitterFieldNames[connectionSlug];
            if (!fieldName) {
                throw new BadRequestException({
                    message: this.translator.translate('WRONG_CONNECTION_SLUG'),
                    errorCode: 'WRONG_CONNECTION_SLUG',
                    statusCode: HttpStatus.BAD_REQUEST
                });
            }
            await user.wefitter.update({ [fieldName]: false });
        }
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => UserWefitterDto })
    @ApiOperation({ summary: 'Get wefitter user data' })
    @Get('user-data')
    async getUserWefitter(@Request() req: Request & { user: SessionDataDto }): Promise<UserWefitterDto> {
        const userWefitters = await this.wefitterService.getUserWefitter(req.user.userId);

        if (!userWefitters) {
            throw new NotFoundException({
                message: this.translator.translate('USER_WEFITTER_NOT_FOUND'),
                errorCode: 'USER_WEFITTER_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        return new UserWefitterDto(userWefitters);
    }

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => UserWefitterDto })
    @ApiOperation({ summary: 'Patch wefitter user data' })
    @Patch('user-data')
    async patch(@Request() req: Request & { user: SessionDataDto }, @Body() body: PatchUserWefitterDto): Promise<UserWefitterDto> {
        let userWefitter = await this.wefitterService.getUserWefitter(req.user.userId);

        if (!userWefitter) {
            throw new NotFoundException({
                message: this.translator.translate('USER_WEFITTER_NOT_FOUND'),
                errorCode: 'USER_WEFITTER_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        userWefitter = await userWefitter.update(body);

        return new UserWefitterDto(userWefitter);
    }


    @Public()
    @ApiOperation({ summary: 'Redirect connection' })
    @Get('connections/redirect')
    async connectionRedirect(@Query() query: ConnectionRedirectDto, @Response() response) {
        let link = `${this.configService.get('MOBILE_FRONTEND_BASE_URL')}connectionResult?connection=${query.connection}`;
        if (query.error) {
            link = `${link}&error=${query.error}`;
        }
        response.set('Content-Type', 'text/html');
        response.send(Buffer.from(`<!DOCTYPE html><html><head><title></title><meta charset="UTF-8" /><meta http-equiv="refresh" content="3; URL=${link}" /></head><body></body></html>`));
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Wefitter push daily summary data' })
    @Post('push/daily-summary')
    async pushDailySummary(@Body() body: WefitterUserDailySummaryDto): Promise<object> {
        const user = await this.wefitterService.getUserWefitterByPublicId(body.profile);
        console.log(JSON.stringify(body));
        if (!user) {
            throw new BadRequestException({
                message: this.translator.translate('USER_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        await this.wefitterService.saveDailySummaryData(user.userId, body.data);

        return {};
    }

    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Wefitter push heartrate summary data' })
    @Post('push/heartrate-summary')
    async pushHeartrateSummary(@Body() body: WefitterUserHeartrateSummaryDto): Promise<void> {
        const user = await this.wefitterService.getUserWefitterByPublicId(body.profile);
        console.log(JSON.stringify(body));
        if (!user) {
            throw new BadRequestException({
                message: this.translator.translate('USER_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        await this.wefitterService.saveHeartrateSummaryData(user.userId, body.data);
    }

    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Wefitter push sleep summary data' })
    @Post('push/sleep-summary')
    async pushSleepSummary(@Body() body: WefitterUserSleepSummaryDto): Promise<void> {
        const user = await this.wefitterService.getUserWefitterByPublicId(body.profile);
        console.log(JSON.stringify(body));
        if (!user) {
            throw new BadRequestException({
                message: this.translator.translate('USER_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        await this.wefitterService.saveSleepSummaryData(user.userId, body.data);
    }

    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Wefitter push biometric measurement data' })
    @Post('push/biometric-measurement')
    async pushBiometricMeasurement(@Body() body: ProfileWefitterBiometricMeasurementDto): Promise<void> {
        const user = await this.wefitterService.getUserWefitterByPublicId(body.profile);
        console.log(JSON.stringify(body));
        if (!user) {
            throw new BadRequestException({
                message: this.translator.translate('USER_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        await this.wefitterService.saveBiometricMeasurement(user.userId, body.data);

        if (measurementTypeToMetricType[body.data.measurement_type]) {
            await this.usersWidgetDataSourcesService.setDefaultSourceIfNotExist(
                user.userId,
                [measurementTypeToMetricType[body.data.measurement_type]],
                body.data.source
            );
        }
    }

    @ApiBearerAuth()
    @ApiResponse({ type: () => WefitterResultAveragesDto })
    @ApiOperation({ summary: 'Get wefitter results averages by metric name' })
    @HttpCode(HttpStatus.OK)
    @Roles(UserRoles.user)
    @Get('/results/averages')
    async getWefitterResultsAvarages(@Query() query: GetWefitterResultAveragesDto, @Request() req: Request & { user: SessionDataDto }): Promise<WefitterResultAveragesDto> {
        return this.wefitterService.getAvarages(query, req.user.userId);
    }

    @ApiBearerAuth()
    @ApiResponse({ type: () => WefitterMetricResultsDto })
    @ApiOperation({ summary: 'Get wefitter results by metric name' })
    @HttpCode(HttpStatus.OK)
    @Roles(UserRoles.user)
    @Get('/results')
    async getWefitterResults(@Query() query: GetWefitterResultsDto, @Request() req: Request & { user: SessionDataDto }): Promise<WefitterMetricResultsDto> {
        return this.wefitterService.getResultListByMetricName(query, req.user.userId);
    }

    @ApiBearerAuth()
    @ApiResponse({ type: () => WefitterMetricNamesDto })
    @ApiOperation({ summary: 'Get wefitter available metric names' })
    @HttpCode(HttpStatus.OK)
    @Roles(UserRoles.user)
    @Get('/results/metric-names')
    async getAvailableMetrics(@Request() req: Request & { user: SessionDataDto }): Promise<WefitterMetricNamesDto> {
        const result: string[] = await this.wefitterService.getAvailableMetricNames(req.user.userId);

        return new WefitterMetricNamesDto(result);
    }

    @ApiBearerAuth()
    @ApiResponse({ type: () => WefitterSourcesListDto })
    @ApiOperation({ summary: 'Get wefitter available source names' })
    @HttpCode(HttpStatus.OK)
    @Roles(UserRoles.user)
    @Get('/results/sources')
    async getSourcesByMetricName(@Request() req: Request & { user: SessionDataDto }, @Query() query: GetWefitterSourcesListDto): Promise<WefitterSourcesListDto> {
        const sources: string[] = await this.wefitterService.getSourcesByMetricType(req.user.userId, WefitterMetricTypes[query.metricName]);

        const results = wefitterSources.map(wefitterSource => ({ isAvailable: sources.includes(wefitterSource), source: wefitterSource }));

        return new WefitterSourcesListDto(results);
    }
}
