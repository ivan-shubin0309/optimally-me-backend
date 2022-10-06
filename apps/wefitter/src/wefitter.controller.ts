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

@ApiTags('wefitter')
@Controller('wefitter')
export class WefitterController {
    constructor(
        private readonly wefitterService: WefitterService,
        private readonly usersService: UsersService,
        private readonly translator: TranslatorService,
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
        const { connectionSlug, deleteData } = query;
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
        if (deleteData) {
            // TODO Delete data from our DB
        }
        await this.wefitterService.deleteConnection(publicId, bearer, connectionSlug);


    }

}
