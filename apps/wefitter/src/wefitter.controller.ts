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
import { WefitterService } from './wefitter.service';
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

@ApiTags('wefitter')
@Controller('wefitter')
export class WefitterController {
    constructor(
        private readonly wefitterService: WefitterService,
        private readonly usersService: UsersService,
        private readonly translator: TranslatorService,
        private readonly configService: ConfigService,
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
        const { wefitter: { publicId, bearer } } = user;
        if (!publicId || !bearer) {
            throw new BadRequestException({
                message: this.translator.translate('WEFITTER_PROFILE_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }
        const connections = await this.wefitterService.getConnections(publicId, bearer, query);
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
            // TODO Delete data from our DB
        }

        if (isWefitterConnectionSlug) {
            await this.wefitterService.deleteConnection(user.wefitter.publicId, user.wefitter.bearer, connectionSlug);
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
}
