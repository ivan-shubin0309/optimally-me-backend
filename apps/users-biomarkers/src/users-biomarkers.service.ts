import { Inject, Injectable } from '@nestjs/common';
import { Biomarker } from '../../biomarkers/src/models/biomarker.entity';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { UserResult } from '../../admins-results/src/models/user-result.entity';
import { recommendationTypesToRangeTypes, UserBiomarkerRangeTypes } from '../../common/src/resources/usersBiomarkers/user-biomarker-range-types';
import { UserBiomarkerCounterDto } from './models/user-biomarker-counter.dto';

@Injectable()
export class UsersBiomarkersService extends BaseService<Biomarker> {
    constructor(
        @Inject('BIOMARKER_MODEL') protected model: Repository<Biomarker>,
        @Inject('USER_RESULT_MODEL') protected userResultModel: Repository<UserResult>,
    ) { super(model); }

    async getBiomarkerRangeCounters(userId: number): Promise<UserBiomarkerCounterDto> {
        const results = await this.model
            .scope([
                { method: ['withLastResults', userId, 1, false, true] },
                'rangeCounters'
            ])
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

    async includeUserBiomarkerCounters(biomarkers: Biomarker[], userId: number): Promise<void> {
        const results = await this.userResultModel
            .scope([
                { method: ['byUserId', userId] },
                { method: ['byBiomarkerId', biomarkers.map(biomarker => biomarker.id)] },
                'resultCounters'
            ])
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
}

