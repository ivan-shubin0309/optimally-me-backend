import { BadRequestException, Body, Controller, HttpStatus, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessionDataDto } from '../../sessions/src/models';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { AdditionalAuthenticationsService } from './additional-authentications.service';
import { PostAuthenticationMethodDto } from './models/post-authentication-method.dto';
import { AdditionalAuthenticationTypes } from '../../common/src/resources/users-mfa-devices/additional-authentication-types';
import { TranslatorService } from 'nestjs-translator';
import { UsersService } from '../../users/src/users.service';

@ApiBearerAuth()
@ApiTags('users/additional-authentications')
@Controller('users/additional-authentications')
export class AdditionalAuthenticationsController {
    constructor(
        private readonly additionalAuthenticationsService: AdditionalAuthenticationsService,
        private readonly translator: TranslatorService,
        private readonly usersService: UsersService,
    ) { }

    @ApiOperation({ summary: 'Set additional authentication method' })
    @Roles(UserRoles.user)
    @Post()
    async setAdditionalAuthenticationMethod(@Body() body: PostAuthenticationMethodDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
        const user = await this.usersService.getOne([
            { method: ['byId', req.user.userId] },
            { method: ['withAdditionalField'] }
        ]);

        if (user.additionalField.additionalAuthenticationType) {
            throw new BadRequestException({
                message: this.translator.translate('ADDITIONAL_AUTHENTICATION_ALREADY_EXIST'),
                errorCode: 'ADDITIONAL_AUTHENTICATION_ALREADY_EXIST',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        if (body.authenticationMethod === AdditionalAuthenticationTypes.mfa && !body.deviceToken) {
            throw new BadRequestException({
                message: this.translator.translate('DEVICE_TOKEN_REQUIRED'),
                errorCode: 'DEVICE_TOKEN_REQUIRED',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        await this.additionalAuthenticationsService.setAdditionalAuthentication(user, body.authenticationMethod, body.deviceToken);
    }
}
