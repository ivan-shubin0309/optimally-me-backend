import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionDto, SessionDataDto } from '../../sessions/src/models';
import { DateTime } from 'luxon';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ObjectKeyComposer } from 'apps/common/src/utils/helpers/object-key-composer.helper';
import { Redis } from 'ioredis';
import * as uuid from 'uuid';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { TranslatorService } from 'nestjs-translator';

@Injectable()
export class SessionsService {
    private redisClient: Redis;

    constructor(
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
        private readonly translator: TranslatorService,
    ) { 
        this.redisClient = redisService.getClient();
    }

    getUserAppendix(userId: number): string {
        return ObjectKeyComposer.createKey('user', userId);
    }

    getSessionAppendix(userId: number): string {
        return ObjectKeyComposer.createKey('user_session', userId);
    }

    async destroyAllSessions(userId: number): Promise<void> {
        const sessionKey = this.getSessionAppendix(userId);
        const existAccessTokens = await this.redisClient.lrange(sessionKey, 0, -1);
        existAccessTokens.forEach(async token => await this.redisClient.del(token));
        await this.redisClient.del(sessionKey);
    }

    async create(userId: number, sessionOptions?: any, dynamicOptions: any = {}): Promise<SessionDto> {
        const uniqueKey = uuid.v4();

        const tokenParams: SessionDataDto = {
            userId,
            role: sessionOptions.role,
            email: sessionOptions.email,
            registrationStep: sessionOptions.registrationStep,
            isEmailVerified: sessionOptions.isEmailVerified,
            sessionId: sessionOptions.sessionId || uniqueKey
        };

        const lifeTime = sessionOptions.lifeTime || this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN');

        const dynamicParams = {
            additionalAuthenticationType: dynamicOptions.additionalAuthenticationType,
            isDeviceVerified: dynamicOptions.isDeviceVerified,
            isAdditionalAuthenticationDeclined: dynamicOptions.isAdditionalAuthenticationDeclined,
            deviceId: dynamicOptions.deviceId,
            expiresAt: dynamicOptions.expiresAt || DateTime.utc().plus({ milliseconds: lifeTime }).toISO()
        };

        const accessToken = this.jwtService.sign(
            {
                data: tokenParams
            },
            {
                expiresIn: lifeTime
            }
        );

        await this.addTokenToSessionList(userId, accessToken);
        await this.redisClient.set(accessToken, JSON.stringify(Object.assign(dynamicParams, tokenParams)), 'PX', lifeTime);

        const refreshToken = this.jwtService.sign(
            {
                data: {
                    ...tokenParams,
                    tokenType: 'refresh',
                    accessToken: accessToken
                }
            },
            {
                expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN')
            }
        );

        return new SessionDto(accessToken, refreshToken, DateTime.utc().plus({ milliseconds: lifeTime }).valueOf());
    }

    addTokenToSessionList(userId: number, accessToken: string): Promise<number> {
        return this.redisClient.lpush(this.getSessionAppendix(userId), accessToken);
    }

    deleteTokenFromSessionList(userId: number, accessToken: string): Promise<number> {
        return this.redisClient.lrem(this.getSessionAppendix(userId), 0, accessToken);
    }

    async findSession(accessToken: string): Promise<SessionDataDto & { [key: string]: any }> {
        const cachedSession: SessionDataDto = JSON.parse(await this.redisClient.get(accessToken));

        if (!cachedSession) {
            return null;
        }

        return cachedSession;
    }

    async destroy(userId: number, accessToken: string): Promise<void> {
        await this.deleteTokenFromSessionList(userId, accessToken);
        await this.redisClient.del(accessToken);
    }

    async refresh(refreshToken: string): Promise<SessionDto> {
        const sessionParams = this.verifyToken(refreshToken);
        const sessionKey = this.getSessionAppendix(sessionParams.data.userId);
        const existAccessTokens = await this.redisClient.lrange(sessionKey, 0, -1);
        if (!existAccessTokens.find(token => token === sessionParams.data.accessToken)) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('TOKEN_EXPIRED'),
                errorCode: 'TOKEN_EXPIRED',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
        const dynamicParams = await this.findSession(sessionParams.data.accessToken);
        await this.destroy(sessionParams.data.userId, sessionParams.data.accessToken);
        const paramsForNewSession = {
            role: sessionParams.data.role,
            email: sessionParams.data.email,
            registrationStep: sessionParams.data.registrationStep,
            isEmailVerified: sessionParams.data.isEmailVerified,
            sessionId: sessionParams.data.sessionId,
        };
        return this.create(sessionParams.data.userId, paramsForNewSession, dynamicParams);
    }

    verifyToken(token: string, error = 'TOKEN_EXPIRED'): any {
        try {
            return this.jwtService.verify(token);
        } catch (e) {
            throw new UnprocessableEntityException({
                message: this.translator.translate(error),
                errorCode: error,
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    async updateSessionParams(accessToken: string, params: any): Promise<void> {
        const cachedSession = await this.findSession(accessToken);
        const lifeTime = DateTime.fromISO(cachedSession.expiresAt).valueOf() - DateTime.utc().valueOf();

        await this.redisClient.set(accessToken, JSON.stringify(params), 'PX', lifeTime);
    }

    async findSessionBySessionId(sessionId: string, userId: number): Promise<[SessionDataDto & { [key: string]: any }, string]> {
        const sessionKey = this.getSessionAppendix(userId);
        const existAccessTokens = await this.redisClient.lrange(sessionKey, 0, -1);
        const sessions = await Promise.all(
            existAccessTokens.map(async token => ({
                session: await this.findSession(token),
                token
            }))
        );
        const result = sessions.find(data => data.session.sessionId === sessionId);

        return [result.session, result.token];
    }
}
