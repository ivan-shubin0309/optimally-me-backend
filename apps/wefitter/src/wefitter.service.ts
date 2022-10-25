import axios from 'axios';
import { Transaction } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { TranslatorService } from 'nestjs-translator';
import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '../../users/src/models';
import { UserWefitter } from './models/user-wefitter.entity';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { Redis } from 'ioredis';
import { ICreateProfile } from './models/create-profile.interface';
import { GetUserConnectionsDto } from './models/get-user-connections.dto';
import { UserWefitterDailySummary } from './models/wefitter-daily-summary.entity';
import { WefitterDailySummaryDto } from './models/wefitter-daily-summary.dto';


@Injectable()
export class WefitterService {

    private readonly baseUrl;
    private readonly secret;
    private readonly appPublicId;
    private readonly dbKey;
    private readonly tokenExpire;
    private token;
    private redisClient: Redis;

    constructor(
        private readonly configService: ConfigService,
        private readonly translator: TranslatorService,
        private readonly redisService: RedisService,
        @Inject('USER_MODEL') private userModel: typeof User,
        @Inject('USER_WEFITTER_MODEL') private userWefitterModel: typeof UserWefitter,
        @Inject('USER_WEFITTER_DAILY_SUMMARY_MODEL') private userWefitterDailySummary: typeof UserWefitterDailySummary,
    ) {
        this.redisClient = redisService.getClient();
        this.baseUrl = this.configService.get('WEFITTER_API_URL');
        this.secret = this.configService.get('WEFITTER_SECRET');
        this.appPublicId = this.configService.get('WEFITTER_PUBLIC_ID');
        this.dbKey = this.configService.get('WEFITTER_TOKEN_DB_KEY');
        this.tokenExpire = this.configService.get('WEFITTER_TOKEN_EXPIRE');
    }

    private async initToken(): Promise<void> {
        let token = await this.getTokenFromDb();
        if (!token) {
            token = await this.getNewToken();
            await this.setTokenToDb(token);
        }
        this.token = token;
    }

    private async getNewToken(): Promise<string> {
        const url = `${this.baseUrl}/token/`;
        const axiosResponse = await axios.post(url, {}, {
            auth: {
                username: this.appPublicId,
                password: this.secret
            }
        }
        );
        const { data: { bearer } } = axiosResponse;
        return bearer;
    }

    private async getTokenFromDb(): Promise<string> {
        return this.redisClient.get(this.dbKey);
    }

    private async setTokenToDb(token): Promise<string> {
        return this.redisClient.set(this.dbKey, token, 'EX', this.tokenExpire);
    }

    private async createProfileRequest(user: User): Promise<ICreateProfile> {
        await this.initToken();
        const link = `${this.baseUrl}/profile/`;
        const postData = {
            given_name: user.firstName ? user.firstName : '',
            family_name: user.lastName ? user.lastName : '',
            reference: uuidv4(),
        };
        const axiosResponse = await axios.post(link, postData, { ...this.prepareAuth(this.token) });
        const { data } = axiosResponse;
        return data;
    }

    private prepareAuth(token): object {
        return {
            headers: {
                'Authorization': `bearer ${token}`
            }
        };
    }

    async createProfile(user: User, transaction?: Transaction): Promise<object> {
        const profile = await this.createProfileRequest(user);
        if (!profile) {
            throw new BadRequestException({
                message: this.translator.translate('USER_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }
        return this.userWefitterModel.create({
            userId: user.id,
            publicId: profile.public_id,
            bearer: profile.bearer,
            reference: profile.reference
        }, { transaction });
    }

    async getProfile(publicId: string, userToken: string): Promise<object> {
        const link = `${this.baseUrl}/profile/${publicId}/`;
        const axiosResponse = await axios.get(link, { ...this.prepareAuth(userToken) });
        const { data } = axiosResponse;
        return data;
    }

    async getConnections(publicId: string, userToken: string, query?: GetUserConnectionsDto): Promise<any> {
        const link = `${this.baseUrl}/profile/${publicId}/connections/`;
        const axiosResponse = await axios.get(
            link,
            {
                ...this.prepareAuth(userToken),
                params: { redirect: query && query.redirect, redirect_on_error: query && query.redirectOnError }
            }
        );
        const { data } = axiosResponse;
        return data;
    }

    async deleteConnection(publicId: string, userToken: string, connectionSlug: string): Promise<any> {
        const link = `${this.baseUrl}/connection/${connectionSlug}/connect/?profile=${publicId}`;
        const axiosResponse = await axios.delete(link, { ...this.prepareAuth(userToken) });
        const { status } = axiosResponse;
        return status == HttpStatus.OK;
    }

    getUserWefitter(userId: number): Promise<UserWefitter> {
        return this.userWefitterModel
            .scope([{ method: ['byUserId', userId] }])
            .findOne();
    }

    getUserWefitterByPublicId(publicId: string): Promise<UserWefitter> {
        return this.userWefitterModel
            .scope([{ method: ['byPublicId', publicId] }])
            .findOne();
    }

    async saveDailySummaryData(userId: number, data: WefitterDailySummaryDto, transaction?: Transaction): Promise<void> {
        this.userWefitterDailySummary.create({
            userId,
            date: data.date,
            distance: data.distance,
            steps: data.steps,
            calories: data.calories,
            activeCalories: data.active_calories,
            bmrCalories: data.bmr_calories,
            points: data.points,
            source: data.source,
            heartSateSummaryMin: data.heart_rate_summary && data.heart_rate_summary.min,
            heartSateSummaryMax: data.heart_rate_summary && data.heart_rate_summary.max,
            heartSateSummaryAverage: data.heart_rate_summary && data.heart_rate_summary.average,
            heartSateSummaryResting: data.heart_rate_summary && data.heart_rate_summary.resting,
            stressQualifier: data.stress_summary && data.stress_summary.stress_qualifier,
            averageStressLevel: data.stress_summary && data.stress_summary.average_stress_level,
            maxStressLevel: data.stress_summary && data.stress_summary.max_stress_level,
            restStressDuration: data.stress_summary && data.stress_summary.rest_stress_duration,
            lowStressDuration: data.stress_summary && data.stress_summary.low_stress_duration,
            mediumStressDuration: data.stress_summary && data.stress_summary.medium_stress_duration,
            highStressDuration: data.stress_summary && data.stress_summary.high_stress_duration,
            stressDuration: data.stress_summary && data.stress_summary.stress_duration,
        }, { transaction });
    }
}