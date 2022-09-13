import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { UserSessionDto } from '../../../sessions/src/models';
import { AdminsSessionsService } from 'apps/admins-sessions/src/admins-sessions.service';

@Injectable()
export class JwtStrategyAdmins extends PassportStrategy(Strategy) {
    constructor(
        private readonly adminsSessionsService: AdminsSessionsService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secret'
        });
    }

    authenticate(request: any, options?: any) {
        const token = request.headers['authorization'] && request.headers['authorization'].split(' ')[1];

        this.adminsSessionsService
            .findSession(token)
            .then(user => this.success(user));
    }

    async validate(payload: UserSessionDto) {
        if (!payload) {
            throw new ForbiddenException({ 
                message: 'USER_UNAUTHORIZED', 
                statusCode: HttpStatus.FORBIDDEN 
            });
        }

        return payload;
    }
}