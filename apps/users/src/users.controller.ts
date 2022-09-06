import {
    Get,
    Post,
    Body,
    Controller,
    Request,
    HttpCode,
    HttpStatus,
    BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Public } from '../../common/src/resources/common/public.decorator';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserDto, CreateUserDto } from './models';
import { UserRoles } from '../../common/src/resources/users';
import { TranslatorService } from 'nestjs-translator';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly translator: TranslatorService,
    ) {}

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @ApiResponse({ type: () => UserDto })
    @ApiOperation({ summary: 'Get current user\'s profile' })
    @Get('me')
    async getMyProfile(@Request() req): Promise<UserDto> {
        const user = await this.usersService.getUser(req.user.userId);

        return new UserDto(user);
    }

    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Register user' })
    @Post('signup')
    async create(@Body() body: CreateUserDto): Promise<object> {
        const user = await this.usersService.getUserByEmail(body.email);

        if (user) {
            throw new BadRequestException({
                message: this.translator.translate('USER_ALREADY_EXIST'),
                errorCode: 'USER_ALREADY_EXIST',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        await this.usersService.create(body);

        return {};
    }
}
