import { Inject, Injectable } from '@nestjs/common';
import { Biomarker } from '../../biomarkers/src/models/biomarker.entity';
import { Repository, Sequelize } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { UserResult } from '../../admins-results/src/models/user-result.entity';
import { recommendationTypesToRangeTypes, UserBiomarkerRangeTypes } from '../../common/src/resources/usersBiomarkers/user-biomarker-range-types';
import { UserBiomarkerCounterDto } from './models/user-biomarker-counter.dto';
import { getLastUserResultsForEachBiomarker } from '../../common/src/resources/usersBiomarkers/queries';

@Injectable()
export class UsersBiomarkersService extends BaseService<Biomarker> {
    constructor(
        @Inject('BIOMARKER_MODEL') protected model: Repository<Biomarker>,
        @Inject('USER_RESULT_MODEL') protected userResultModel: Repository<UserResult>,
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
    ) { super(model); }

    async getBiomarkerRangeCounters(lastResultIds: number[], additionalScopes = []): Promise<UserBiomarkerCounterDto> {
        const scopes: any[] = [
            { method: ['withLastResult', lastResultIds, true, [], false] },
            'rangeCounters'
        ];

        const results = await this.model
            .scope(scopes.concat(additionalScopes))
            .findAll();

        const resultMap = {};

        results.forEach(result => {
            //eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const rangeType = recommendationTypesToRangeTypes[result.get('recommendationRange')];
            const fieldName = UserBiomarkerRangeTypes[rangeType];
            if (rangeType && fieldName) {
                if (!resultMap[fieldName]) {
                    resultMap[fieldName] = 0;
                }
                resultMap[fieldName] += result.get('value');
            }
        });

        return new UserBiomarkerCounterDto(resultMap);
    }

    async includeUserBiomarkerCounters(biomarkers: Biomarker[], userId: number, beforeDate?: string): Promise<void> {
        const scopes: any[] = [
            { method: ['byUserId', userId] },
            { method: ['byBiomarkerId', biomarkers.map(biomarker => biomarker.id)] },
            'resultCounters'
        ];

        if (beforeDate) {
            scopes.push({ method: ['byDate', null, beforeDate] });
        }

        const results = await this.userResultModel
            .scope(scopes)
            .findAll();
        const resultsMap = {};
        results.forEach(result => {
            resultsMap[result.biomarkerId] = result.value;
        });

        biomarkers.forEach(biomarker => {
            biomarker.resultsCount = resultsMap[biomarker.id];
            biomarker.setDataValue('resultsCount', resultsMap[biomarker.id]);
        });
    }

    async getLastResultIdsByDate(userId: number, dateFilter: { afterDate?: string, beforeDate: string }, numberOfLastRecords: number): Promise<number[]> {
        const results = await this.dbConnection.query(getLastUserResultsForEachBiomarker(userId, numberOfLastRecords, dateFilter?.afterDate, dateFilter?.beforeDate), { model: UserResult });

        return results.map(result => result.get('id'));
    }
}

