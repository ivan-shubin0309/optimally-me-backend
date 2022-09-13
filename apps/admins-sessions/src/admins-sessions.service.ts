import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionDto, UserSessionDto } from '../../sessions/src/models';
import { DateTime } from 'luxon';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ObjectKeyComposer } from 'apps/common/src/utils/helpers/object-key-composer.helper';
import { Redis } from 'ioredis';
import * as uuid from 'uuid';
import { ConfigService } from '../../common/src/utils/config/config.service';

@Injectable()
export class AdminsSessionsService {
    private redisClient: Redis;

    constructor(
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
    ) {
        this.redisClient = redisService.getClient();
    }

    getSessionAppendix(userId: number): string {
        return ObjectKeyComposer.createKey('user_session', userId);
    }

    async create(userId: number, sessionOptions?: any): Promise<SessionDto> {
        const uniqueKey = uuid.v4();

        const tokenParams: UserSessionDto = {
            userId,
            role: sessionOptions.role,
            sessionId: uniqueKey
        };

        const lifeTime = sessionOptions.lifeTime || this.configService.get('JWT_EXPIRES_IN');

        const accessToken = this.jwtService.sign(
            {
                data: tokenParams
            },
            {
                secret: this.configService.get('JWT_SECRET')
            }
        );

        await this.addTokenToSessionList(userId, accessToken);
        await this.redisClient.set(accessToken, JSON.stringify(tokenParams), 'PX', lifeTime);

        const refreshToken = this.jwtService.sign(
            {
                data: {
                    ...tokenParams,
                    tokenType: 'refresh',
                    accessToken: accessToken
                }
            },
            {
                secret: this.configService.get('JWT_SECRET')
            }
        );

        return new SessionDto(accessToken, refreshToken, DateTime.utc().plus({ milliseconds: lifeTime }).valueOf());
    }

    addTokenToSessionList(userId: number, accessToken: string): Promise<number> {
        return this.redisClient.lpush(this.getSessionAppendix(userId), accessToken);
    }

    async findSession(accessToken: string): Promise<UserSessionDto> {
        const cachedSession: UserSessionDto = JSON.parse(await this.redisClient.get(accessToken));

        if (!cachedSession) {
            return null;
        }

        return cachedSession;
    }
}
