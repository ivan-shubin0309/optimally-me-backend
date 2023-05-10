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
import { GetWefitterResultAveragesDto } from './models/get-wefitter-result-averages.dto';
import { metricTypeToFieldName, WefitterMetricTypes } from '../../common/src/resources/wefitter/wefitter-metric-types';
import { WefitterResultAveragesDto } from './models/wefitter-result-averages.dto';
import { GetWefitterResultsDto } from './models/get-wefitter-results.dto';
import { WefitterMetricResultsDto } from './models/wefitter-metric-results.dto';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { EnumHelper } from '../../common/src/utils/helpers/enum.helper';
import { WefitterBiometricMeasurementDto } from './models/biometric-measurements/wefitter-biometric-measurement.dto';
import { WefitterBloodPressure } from './models/biometric-measurements/wefitter-blood-pressure.entity';
import { WefitterBloodSugar } from './models/biometric-measurements/wefitter-blood-sugar.entity';
import { WefitterDiastolicBloodPressure } from './models/biometric-measurements/wefitter-diastolic-blood-pressure.entity';
import { WefitterSystolicBloodPressure } from './models/biometric-measurements/wefitter-systolic-blood-pressure.entity';
import { WefitterVo2Max } from './models/biometric-measurements/wefitter-vo2-max.entity';
import { WefitterHrvSleep } from './models/biometric-measurements/wefitter-hrv-sleep.entity';
import { UsersWidgetDataSourcesService } from '../../users-widgets/src/users-widget-data-sources.service';

const metricTypeToModelName = {
    [WefitterMetricTypes.steps]: 'userWefitterDailySummary',
    [WefitterMetricTypes.caloriesBurned]: 'userWefitterDailySummary',
    [WefitterMetricTypes.timeAsleep]: 'userWefitterSleepSummary',
    [WefitterMetricTypes.sleepScore]: 'userWefitterSleepSummary',
    [WefitterMetricTypes.avgHeartRate]: 'userWefitterHeartrateSummary',
    [WefitterMetricTypes.hrvSleep]: 'wefitterHrvSleepModel',
    [WefitterMetricTypes.vo2max]: 'wefitterVo2MaxModel',
    [WefitterMetricTypes.bloodSugar]: 'wefitterBloodSugarModel',
    [WefitterMetricTypes.bloodPressure]: 'wefitterBloodPressureModel',
    [WefitterMetricTypes.systolicBloodPressure]: 'wefitterSystolicBloodPressureModel',
    [WefitterMetricTypes.diastolicBloodPressure]: 'wefitterDiastolicBloodPressureModel',
    [WefitterMetricTypes.awake]: 'userWefitterSleepSummary',
    [WefitterMetricTypes.light]: 'userWefitterSleepSummary',
    [WefitterMetricTypes.deep]: 'userWefitterSleepSummary',
    [WefitterMetricTypes.rem]: 'userWefitterSleepSummary',
};

const measurementTypeToModelName = {
    'blood pressure': 'wefitterBloodPressureModel',
    'glucose': 'wefitterBloodSugarModel',
    'systolic bp': 'wefitterSystolicBloodPressureModel',
    'diastolic bp': 'wefitterDiastolicBloodPressureModel',
    'hrv': 'wefitterHrvSleepModel',
    'vo2 max': 'wefitterVo2MaxModel',
};

export const measurementTypeToMetricType = {
    'blood pressure': WefitterMetricTypes.bloodPressure,
    'glucose': WefitterMetricTypes.bloodSugar,
    'systolic bp': WefitterMetricTypes.systolicBloodPressure,
    'diastolic bp': WefitterMetricTypes.diastolicBloodPressure,
    'hrv': WefitterMetricTypes.hrvSleep,
    'vo2 max': WefitterMetricTypes.vo2max,
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
        @Inject('USER_WEFITTER_MODEL') private userWefitterModel: Repository<UserWefitter>,
        @Inject('USER_WEFITTER_DAILY_SUMMARY_MODEL') private userWefitterDailySummary: Repository<UserWefitterDailySummary>,
        @Inject('USER_WEFITTER_HEARTRATE_SUMMARY_MODEL') private userWefitterHeartrateSummary: Repository<UserWefitterHeartrateSummary>,
        @Inject('USER_WEFITTER_SLEEP_SUMMARY_MODEL') private userWefitterSleepSummary: Repository<UserWefitterSleepSummary>,
        @Inject('WEFITTER_BLOOD_PRESSURE') private wefitterBloodPressureModel: Repository<WefitterBloodPressure>,
        @Inject('WEFITTER_BLOOD_SUGAR') private wefitterBloodSugarModel: Repository<WefitterBloodSugar>,
        @Inject('WEFITTER_DIASTOLIC_BLOOD_PRESSURE') private wefitterDiastolicBloodPressureModel: Repository<WefitterDiastolicBloodPressure>,
        @Inject('WEFITTER_SYSTOLIC_BLOOD_PRESSURE') private wefitterSystolicBloodPressureModel: Repository<WefitterSystolicBloodPressure>,
        @Inject('WEFITTER_VO2_MAX') private wefitterVo2MaxModel: Repository<WefitterVo2Max>,
        @Inject('WEFITTER_HRV_SLEEP') private wefitterHrvSleepModel: Repository<WefitterHrvSleep>,
        private readonly usersWidgetDataSourcesService: UsersWidgetDataSourcesService,
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
                { method: ['byDate', data.date] },
                { method: ['bySource', data.source] },
                'withIdAttribute'
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
            await this.userWefitterDailySummary
                .scope({ method: ['byId', dailySummary.get('id')] })
                .update(dailySummaryBody, { transaction } as any);
        }

        const metricsArray = [];

        if (dailySummaryBody[metricTypeToFieldName[WefitterMetricTypes.steps]]) {
            metricsArray.push(WefitterMetricTypes.steps);
        }

        if (dailySummaryBody[metricTypeToFieldName[WefitterMetricTypes.caloriesBurned]]) {
            metricsArray.push(WefitterMetricTypes.caloriesBurned);
        }

        if (metricsArray.length) {
            await this.usersWidgetDataSourcesService.setDefaultSourceIfNotExist(
                userId,
                metricsArray,
                data.source
            );
        }

        if (data.heart_rate_summary) {
            await this.createOrUpdateHeartrateSummary(userId, data.heart_rate_summary, data.source, dailySummary, transaction);

            if (data.heart_rate_summary[metricTypeToFieldName[WefitterMetricTypes.avgHeartRate]]) {
                await this.usersWidgetDataSourcesService.setDefaultSourceIfNotExist(
                    userId,
                    [
                        WefitterMetricTypes.avgHeartRate
                    ],
                    data.source
                );
            }
        }
    }

    async createOrUpdateHeartrateSummary(userId: number, data: WefitterHeartRateDto, source: string, dailySummary?: UserWefitterDailySummary, transaction?: Transaction): Promise<void> {
        let heartrateSummary;

        const scopes: any[] = [
            { method: ['byUserId', userId] },
            { method: ['bySource', source] }
        ];

        if (dailySummary) {
            scopes.push({ method: ['byDailySummaryId', dailySummary.get('id')] });
        } else if (data.timestamp) {
            scopes.push({ method: ['byTimestamp', data.timestamp] });
        }

        if (dailySummary || data.timestamp) {
            heartrateSummary = await this.userWefitterHeartrateSummary
                .scope(scopes)
                .findOne({ transaction });
        }

        const heartrateSummaryBody = {
            userId,
            timestamp: data.timestamp || dailySummary?.get('date'),
            source: data.source || source,
            duration: data.duration,
            min: data.min,
            max: data.max,
            average: data.average,
            resting: data.resting,
            dailySummaryId: dailySummary?.get('id'),
        };
        if (!heartrateSummary) {
            await this.userWefitterHeartrateSummary.create(heartrateSummaryBody, { transaction });
        } else {
            await heartrateSummary.update(heartrateSummaryBody, { transaction });
        }
    }

    async saveHeartrateSummaryData(userId: number, data: WefitterHeartRateDto, transaction?: Transaction): Promise<void> {
        await this.createOrUpdateHeartrateSummary(userId, data, data.source, null, transaction);

        if (data[metricTypeToFieldName[WefitterMetricTypes.avgHeartRate]]) {
            await this.usersWidgetDataSourcesService.setDefaultSourceIfNotExist(
                userId,
                [
                    WefitterMetricTypes.avgHeartRate
                ],
                data.source
            );
        }
    }

    async saveSleepSummaryData(userId: number, data: WefitterSleepDto, transaction?: Transaction): Promise<void> {
        let sleepSummary;

        if (data.timestamp) {
            sleepSummary = await this.userWefitterSleepSummary
                .scope([
                    { method: ['byUserId', userId] },
                    { method: ['byTimestamp', data.timestamp] },
                    { method: ['bySource', data.source] }
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

        const metricsArray = [];

        if (sleepSummaryBody[metricTypeToFieldName[WefitterMetricTypes.timeAsleep]]) {
            metricsArray.push(WefitterMetricTypes.timeAsleep);
        }

        if (sleepSummaryBody[metricTypeToFieldName[WefitterMetricTypes.sleepScore]]) {
            metricsArray.push(WefitterMetricTypes.sleepScore);
        }
        if (sleepSummaryBody[metricTypeToFieldName[WefitterMetricTypes.awake]]) {
            metricsArray.push(WefitterMetricTypes.awake);
        }
        if (sleepSummaryBody[metricTypeToFieldName[WefitterMetricTypes.light]]) {
            metricsArray.push(WefitterMetricTypes.light);
        }
        if (sleepSummaryBody[metricTypeToFieldName[WefitterMetricTypes.deep]]) {
            metricsArray.push(WefitterMetricTypes.deep);
        }
        if (sleepSummaryBody[metricTypeToFieldName[WefitterMetricTypes.rem]]) {
            metricsArray.push(WefitterMetricTypes.rem);
        }

        if (metricsArray.length) {
            await this.usersWidgetDataSourcesService.setDefaultSourceIfNotExist(
                userId,
                metricsArray,
                data.source
            );
        }
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
            { method: ['byUserId', userId] },
            { method: ['withDailySummary'] }
        ];

        if (query.startDate || query.endDate) {
            scopes.push({ method: ['byDateInterval', query.startDate, query.endDate] });
        }

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

    async getResultListByMetricName(query: GetWefitterResultsDto, userId: number): Promise<WefitterMetricResultsDto> {
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
        const defaultSource = await this.usersWidgetDataSourcesService.getOne([
            { method: ['byUserId', userId] },
            { method: ['byMetricType', modelDataObject.metricEnum] }
        ]);

        const scopes: any[] = [
            { method: ['byUserId', userId] },
            { method: ['byFieldName', modelDataObject.fieldName, true] },
        ];

        if (defaultSource) {
            scopes.push({ method: ['bySource', defaultSource.source] });
        }

        if (query.startDate || query.endDate) {
            scopes.push({ method: ['byDateInterval', query.startDate, query.endDate] });
        }

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

    async getAvailableMetricNames(userId: number): Promise<string[]> {
        const resultArray: string[] = [];

        const scopes: any[] = [
            { method: ['byUserId', userId] },
            { method: ['checkMetricAvailability'] }
        ];

        const scopesForBiometricMeasurements: any[] = [
            { method: ['byUserId', userId] },
        ];

        const [
            dailySummary,
            heartrateSummary,
            sleepSummary,
            bloodPressureCount,
            bloodSugarCount,
            diastolicBloodPressureCount,
            systolicBloodPressureCount,
            vo2MaxCount,
            hrvSleepCount,
        ] = await Promise.all([
            this.userWefitterDailySummary
                .scope(scopes)
                .findOne(),
            this.userWefitterHeartrateSummary
                .scope(scopes)
                .findOne(),
            this.userWefitterSleepSummary
                .scope(scopes)
                .findOne(),
            this.wefitterBloodPressureModel
                .scope(scopesForBiometricMeasurements)
                .count(),
            this.wefitterBloodSugarModel
                .scope(scopesForBiometricMeasurements)
                .count(),
            this.wefitterDiastolicBloodPressureModel
                .scope(scopesForBiometricMeasurements)
                .count(),
            this.wefitterSystolicBloodPressureModel
                .scope(scopesForBiometricMeasurements)
                .count(),
            this.wefitterVo2MaxModel
                .scope(scopesForBiometricMeasurements)
                .count(),
            this.wefitterHrvSleepModel
                .scope(scopesForBiometricMeasurements)
                .count(),
        ]);

        const biometricMeasurementMap = {
            vo2max: vo2MaxCount,
            hrvSleep: hrvSleepCount,
            bloodSugar: bloodSugarCount,
            bloodPressure: bloodPressureCount,
            systolicBloodPressure: systolicBloodPressureCount,
            diastolicBloodPressure: diastolicBloodPressureCount,
        };

        EnumHelper
            .toCollection(WefitterMetricTypes)
            .forEach(metric => {
                const fieldName = metricTypeToFieldName[metric.value];
                if (
                    fieldName
                    && (dailySummary.get(fieldName)
                        || heartrateSummary.get(fieldName)
                        || sleepSummary.get(fieldName))
                ) {
                    console.log(dailySummary.get(fieldName));
                    console.log(typeof dailySummary.get(fieldName));
                    resultArray.push(metric.key);
                }
                if (biometricMeasurementMap[metric.key]) {
                    resultArray.push(metric.key);
                }
            });

        return resultArray;
    }

    async saveBiometricMeasurement(userId: number, data: WefitterBiometricMeasurementDto, transaction?: Transaction): Promise<void> {
        const modelName = measurementTypeToModelName[data.measurement_type];
        const model = this[modelName];

        if (!model) {
            console.log(`Model for ${data.measurement_type} - not found`);
            return;
        }

        const scopes: any[] = [
            { method: ['byUserId', userId] },
            { method: ['bySource', data.source] },
            { method: ['byTimestamp', data.timestamp] }
        ];

        const biometricMeasurement = await model
            .scope(scopes)
            .findOne({ transaction });

        const dataForCreate = {
            userId,
            timestamp: data.timestamp,
            timestampEnd: data.end,
            source: data.source,
            isManual: data.is_manual,
            value: data.value,
            unit: data.unit,
        };

        if (biometricMeasurement) {
            await model
                .scope([{ method: ['byId', biometricMeasurement.get('id')] }])
                .findOne({ transaction });
        } else {
            await model.create(dataForCreate, { transaction });
        }
    }

    async getSourcesByMetricType(userId: number, metricType: WefitterMetricTypes, transaction?: Transaction): Promise<string[]> {
        const currentModel = this[`${metricTypeToModelName[metricType]}`];
        if (!currentModel) {
            return;
        }

        const sourcesCount = await currentModel
            .scope([
                { method: ['byUserId', userId] },
                { method: ['sourceCount'] },
                { method: ['byFieldName', metricTypeToFieldName[metricType]] }
            ])
            .findAll({ transaction });

        return sourcesCount.map(source => source.get('source'));
    }
}