import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CacheTime } from './cache-time';

@Injectable()
export class CacheService {
    private redisClient: Redis;

    constructor(
        private readonly redisService: RedisService,
    ) {
        this.redisClient = redisService.getClient();
    }

    async set(prefix: string, key: number, value: any, cacheTime: CacheTime = CacheTime.day): Promise<void> {
        await this.redisClient.set(`${prefix}_${key}`, JSON.stringify(value), 'PX', cacheTime);
    }

    async get(prefix: string, key: number): Promise<any> {
        return JSON.parse(await this.redisClient.get(`${prefix}_${key}`));
    }

    async del(prefix: string, key: number): Promise<void> {
        await this.redisClient.del(`${prefix}_${key}`);
    }
}
