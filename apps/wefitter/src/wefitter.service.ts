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
import { Model, Repository } from 'sequelize-typescript';
import { UserWefitterHeartrateSummary } from './models/wefitter-heartrate-summary.entity';
import { WefitterHeartRateDto } from './models/wefitter-heart-rate.dto';
import { WefitterSleepDto } from './models/wefitter-sleep.dto';
import { UserWefitterSleepSummary } from './models/wefitter-sleep-summary.entity';
import { WefitterStressSummaryDto } from './models/wefitter-stress-summary.dto';
import { UserWefitterStressSummary } from './models/wefitter-stress-summary.entity';
import { GetWefitterResultAveragesDto } from './models/get-wefitter-result-averages.dto';
import { WefitterMetricTypes } from '../../common/src/resources/wefitter/wefitter-metric-types';
import { WefitterResultAveragesDto } from './models/wefitter-result-averages.dto';
import { GetWefitterResultsDto } from './models/get-wefitter-results.dto';
import { WefitterMetricResultsDto } from './models/wefitter-metric-results.dto';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';

const metricTypeToModelName = {
    [WefitterMetricTypes.steps]: 'userWefitterDailySummary',
    [WefitterMetricTypes.caloriesBurned]: 'userWefitterDailySummary',
    [WefitterMetricTypes.timeAsleep]: 'userWefitterSleepSummary',
    [WefitterMetricTypes.sleepScore]: 'userWefitterSleepSummary',
    [WefitterMetricTypes.avgHeartRate]: 'userWefitterHeartrateSummary',
    /*[WefitterMetricTypes.hrvSleep]: '',
    [WefitterMetricTypes.vo2max]: '',
    [WefitterMetricTypes.bloodSugar]: '',
    [WefitterMetricTypes.bloodPressure]: '',*/
};

const metricTypeToFieldName = {
    [WefitterMetricTypes.steps]: 'steps',
    [WefitterMetricTypes.caloriesBurned]: 'bmrCalories',
    [WefitterMetricTypes.timeAsleep]: 'totalTimeInSleep',
    [WefitterMetricTypes.sleepScore]: 'sleepScore',
    [WefitterMetricTypes.avgHeartRate]: 'average',
    /*[WefitterMetricTypes.hrvSleep]: '',
    [WefitterMetricTypes.vo2max]: '',
    [WefitterMetricTypes.bloodSugar]: '',
    [WefitterMetricTypes.bloodPressure]: '',*/
};

interface IMappedWefitterMetric { model: Repository<Model>, fieldName: string, metricEnum: WefitterMetricTypes }

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
        @Inject('USER_MODEL') private userModel: Repository<User>,
        @Inject('USER_WEFITTER_MODEL') private userWefitterModel: Repository<UserWefitter>,
        @Inject('USER_WEFITTER_DAILY_SUMMARY_MODEL') private userWefitterDailySummary: Repository<UserWefitterDailySummary>,
        @Inject('USER_WEFITTER_HEARTRATE_SUMMARY_MODEL') private userWefitterHeartrateSummary: Repository<UserWefitterHeartrateSummary>,
        @Inject('USER_WEFITTER_SLEEP_SUMMARY_MODEL') private userWefitterSleepSummary: Repository<UserWefitterSleepSummary>,
        @Inject('USER_WEFITTER_STRESS_SUMMARY_MODEL') private userWefitterStressSummary: Repository<UserWefitterStressSummary>,
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
        let dailySummary = await this.userWefitterDailySummary
            .scope([
                { method: ['byUserId', userId] },
                { method: ['byDate', data.date] }
            ])
            .findOne({ transaction });

        const dailySummaryBody = {
            userId,
            date: data.date,
            distance: data.distance,
            steps: data.steps,
            calories: data.calories,
            activeCalories: data.active_calories,
            bmrCalories: data.bmr_calories,
            points: data.points,
            source: data.source,
        };

        if (!dailySummary) {
            dailySummary = await this.userWefitterDailySummary.create(dailySummaryBody, { transaction });
        } else {
            await dailySummary.update(dailySummaryBody, { transaction });
        }

        if (data.heart_rate_summary) {
            await this.createOrUpdateHeartrateSummary(userId, data.heart_rate_summary, dailySummary.id, transaction);
        }

        if (data.stress_summary) {
            await this.createOrUpdateStressSummary(userId, data.stress_summary, dailySummary.id, transaction);
        }
    }

    async createOrUpdateHeartrateSummary(userId: number, data: WefitterHeartRateDto, dailySummaryId?: number, transaction?: Transaction): Promise<void> {
        let heartrateSummary;

        const scopes: any[] = [
            { method: ['byUserId', userId] }
        ];

        if (dailySummaryId) {
            scopes.push({ method: ['byDailySummaryId', dailySummaryId] });
        } else if (data.timestamp) {
            scopes.push({ method: ['byTimestamp', data.timestamp] });
        }

        if (dailySummaryId || data.timestamp) {
            heartrateSummary = await this.userWefitterHeartrateSummary
                .scope(scopes)
                .findOne({ transaction });
        }

        const heartrateSummaryBody = {
            userId,
            timestamp: data.timestamp,
            source: data.source,
            duration: data.duration,
            min: data.min,
            max: data.max,
            average: data.average,
            resting: data.resting,
            dailySummaryId: dailySummaryId,
        };
        if (!heartrateSummary) {
            await this.userWefitterHeartrateSummary.create(heartrateSummaryBody, { transaction });
        } else {
            await heartrateSummary.update(heartrateSummaryBody, { transaction });
        }
    }

    async createOrUpdateStressSummary(userId: number, data: WefitterStressSummaryDto, dailySummaryId?: number, transaction?: Transaction): Promise<void> {
        let stressSummary;

        const scopes: any[] = [
            { method: ['byUserId', userId] }
        ];

        if (dailySummaryId) {
            scopes.push({ method: ['byDailySummaryId', dailySummaryId] });
        } else if (data.timestamp) {
            scopes.push({ method: ['byTimestamp', data.timestamp] });
        }

        if (dailySummaryId || data.timestamp) {
            stressSummary = await this.userWefitterStressSummary
                .scope(scopes)
                .findOne({ transaction });
        }

        const stressSummaryBody = {
            userId,
            timestamp: data.timestamp,
            source: data.source,
            duration: data.duration,
            stressQualifier: data.stress_qualifier,
            averageStressLevel: data.average_stress_level,
            maxStressLevel: data.max_stress_level,
            restStressDuration: data.rest_stress_duration,
            lowStressDuration: data.low_stress_duration,
            mediumStressDuration: data.medium_stress_duration,
            highStressDuration: data.high_stress_duration,
            stressDuration: data.stress_duration,
            dailySummaryId: dailySummaryId,
        };
        if (!stressSummary) {
            await this.userWefitterStressSummary.create(stressSummaryBody, { transaction });
        } else {
            await stressSummary.update(stressSummaryBody, { transaction });
        }
    }

    async saveHeartrateSummaryData(userId: number, data: WefitterHeartRateDto, transaction?: Transaction): Promise<void> {
        await this.createOrUpdateHeartrateSummary(userId, data, null, transaction);
    }

    async saveSleepSummaryData(userId: number, data: WefitterSleepDto, transaction?: Transaction): Promise<void> {
        let sleepSummary;

        if (data.timestamp) {
            sleepSummary = await this.userWefitterSleepSummary
                .scope([
                    { method: ['byUserId', userId] },
                    { method: ['byTimestamp', data.timestamp] }
                ])
                .findOne({ transaction });
        }

        const sleepSummaryBody = {
            userId,
            timestamp: data.timestamp,
            timestampEnd: data.timestamp_end,
            source: data.source,
            duration: data.duration,
            awake: data.awake,
            light: data.light,
            deep: data.deep,
            rem: data.rem,
            sleepScore: data.sleep_score,
            totalTimeInSleep: data.total_time_in_sleep
        };

        if (!sleepSummary) {
            await this.userWefitterSleepSummary.create(sleepSummaryBody, { transaction });
        } else {
            await sleepSummary.update(sleepSummaryBody, { transaction });
        }
    }

    async saveStressSummaryData(userId: number, data: WefitterStressSummaryDto, transaction?: Transaction): Promise<void> {
        await this.createOrUpdateStressSummary(userId, data, null, transaction);
    }

    async getAvarages(query: GetWefitterResultAveragesDto, userId: number): Promise<WefitterResultAveragesDto> {
        const dataObjectsArray: IMappedWefitterMetric[] = [];
        query.metricNames.forEach(metric => {
            const metricEnum = WefitterMetricTypes[metric];
            const fieldName = metricTypeToFieldName[metricEnum];
            const currentModel = this[`${metricTypeToModelName[metricEnum]}`];
            if (!metricEnum || !currentModel || !fieldName) {
                return;
            }
            dataObjectsArray.push({
                metricEnum,
                fieldName,
                model: currentModel,
            });
        });

        const scopes: any[] = [
            { method: ['byUserId', userId] }
        ];

        const promises = dataObjectsArray.map(async (dataObject) => {
            const result = await dataObject.model
                .scope(
                    scopes.concat([
                        { method: ['averages', dataObject.fieldName] }
                    ])
                )
                .findOne({});

            if (!result) {
                return null;
            }

            result.setDataValue('metricName', WefitterMetricTypes[dataObject.metricEnum]);

            return result;
        });

        const results = await Promise.all(promises);

        return new WefitterResultAveragesDto(results.filter(result => !!result) as any);
    }

    async getResultListByMetricName(query: GetWefitterResultsDto, userId: number) {
        let resultList = [];
        const metricEnum = WefitterMetricTypes[query.metricName];
        const fieldName = metricTypeToFieldName[metricEnum];
        const currentModel = this[`${metricTypeToModelName[metricEnum]}`];
        const modelDataObject: IMappedWefitterMetric = {
            metricEnum,
            fieldName,
            model: currentModel,
        };
        if (!metricEnum || !currentModel || !fieldName) {
            return new WefitterMetricResultsDto(
                resultList,
                { fieldName: modelDataObject.fieldName, metricName: WefitterMetricTypes[modelDataObject.metricEnum] },
                PaginationHelper.buildPagination({ limit: query.limit, offset: query.offset }, 0)
            );
        }
        const scopes: any[] = [
            { method: ['byUserId', userId] },
            { method: ['byFieldName', modelDataObject.fieldName] }
        ];

        const count = await modelDataObject.model
            .scope(scopes)
            .count();

        if (count) {
            scopes.push(
                { method: ['pagination', { limit: query.limit, offset: query.offset }] },
                { method: ['orderByDate'] },
            );
            resultList = await modelDataObject.model
                .scope(scopes)
                .findAll({});
        }

        return new WefitterMetricResultsDto(
            resultList,
            { fieldName: modelDataObject.fieldName, metricName: WefitterMetricTypes[modelDataObject.metricEnum] },
            PaginationHelper.buildPagination({ limit: query.limit, offset: query.offset }, count)
        );
    }
}