import { BadRequestException, HttpStatus, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { File } from '../../files/src/models/file.entity';
import { FileHelper } from '../../common/src/utils/helpers/file.helper';
import { Repository } from 'sequelize-typescript';
import { UserResult } from '../../admins-results/src/models/user-result.entity';
import { SamplesService } from '../../samples/src/samples.service';
import { UsersBiomarkersService } from '../../users-biomarkers/src/users-biomarkers.service';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { FilterRangeHelper } from '../../common/src/resources/filters/filter-range.helper';
import { DateTime } from 'luxon';
import { Sequelize } from 'sequelize';
import { TranslatorService } from 'nestjs-translator';
import { FileTypes } from '../../common/src/resources/files/file-types';
import { DnaAgeResult } from './models/dna-age-result.entity';
import { CreateDnaAgeResultDto } from './models/create-dna-age-result.dto';
import { CsvParser, ParsedData } from 'nest-csv-parser';
import { DnaAgeFileDto } from './models/dna-age-file.dto';
import * as https from 'https';
import { Readable } from 'stream';
import { Transaction } from 'sequelize';
import { Recommendation } from '../../biomarkers/src/models/recommendations/recommendation.entity';
import { UserRecommendation } from '../../biomarkers/src/models/userRecommendations/user-recommendation.entity';

export interface IDnaAgeFile {
    SID: string,
    OriginalOrderInBatch: string,
    Plate_Number: string,
    Well_Address: string,
    Age: string,
    Tissue: string,
    Female: string,
    Sex: string,
    [key: string]: any
}

const PERCENTILE_SUFFIX = '_percentile';

const requiredFields = [
    'SID',
    'OriginalOrderInBatch',
    'Plate_Number',
    'Well_Address',
    'Age',
    'Tissue',
    'Female',
    'Sex'
];

@Injectable()
export class DnaAgeFilesService {
    constructor(
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
        @Inject('USER_RESULT_MODEL') private readonly userResultModel: Repository<UserResult>,
        @Inject('DNA_AGE_RESULT_MODEL') private readonly dnaAgeResultModel: Repository<DnaAgeResult>,
        @Inject('RECOMMENDATION_MODEL') private readonly recommendationModel: Repository<Recommendation>,
        @Inject('USER_RECOMMENDATION_MODEL') private readonly userRecommendationModel: Repository<UserRecommendation>,
        private readonly samplesService: SamplesService,
        private readonly usersBiomarkersService: UsersBiomarkersService,
        private readonly translator: TranslatorService,
        private readonly csvParser: CsvParser,
    ) { }

    async parseCsvToJson(file: File): Promise<IDnaAgeFile[]> {
        let fileStream: Readable, parsedData: ParsedData<DnaAgeFileDto>, data: DnaAgeFileDto[];

        if (file.type !== FileTypes.dnaAge) {
            throw new BadRequestException({
                message: this.translator.translate('FILE_NOT_DNA_AGE'),
                errorCode: 'FILE_NOT_DNA_AGE',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        try {
            fileStream = await new Promise<Readable>((resolve, reject) => {
                https.get(FileHelper.getInstance().buildBaseLink(file), (stream) => {
                    resolve(stream);
                });
            });

            parsedData = await this.csvParser.parse(fileStream, DnaAgeFileDto, null, null, { separator: ',' });
            data = parsedData.list;
        } catch (err) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('ERROR_WHEN_PARSING_CSV'),
                errorCode: 'ERROR_WHEN_PARSING_CSV',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        console.log(JSON.stringify(data));

        if (!data.length) {
            throw new BadRequestException({
                message: this.translator.translate('DNA_AGE_FILE_EMPTY'),
                errorCode: 'DNA_AGE_FILE_EMPTY',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        const fieldNames = Object.keys(data[0]);

        if (requiredFields.find(fieldName => !fieldNames.includes(fieldName))) {
            throw new BadRequestException({
                message: this.translator.translate('DNA_AGE_FILE_STRUCTURE_INCORRECT'),
                errorCode: 'DNA_AGE_FILE_STRUCTURE_INCORRECT',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        return data;
    }

    async processDnaAgeResults(data: IDnaAgeFile[]): Promise<void> {
        await this.dbConnection.transaction(async transaction => {
            const promises = data.map(async row => {
                const sample = await this.samplesService.getOne([
                    { method: ['bySampleId', row.SID] },
                    { method: ['withUserSample', undefined, true] }
                ], transaction);

                if (!sample) {
                    return;
                }

                let dnaAgeResultToCreate: any, dnaAgeResult;

                try {
                    dnaAgeResultToCreate = new CreateDnaAgeResultDto(row, sample.id, sample.userSample.userId);
                    dnaAgeResult = await this.dnaAgeResultModel.create(dnaAgeResultToCreate, { transaction });
                } catch (err) {
                    throw new UnprocessableEntityException({
                        message: this.translator.translate('CANNOT_PARSE_CSV'),
                        errorCode: 'CANNOT_PARSE_CSV',
                        statusCode: HttpStatus.BAD_REQUEST
                    });
                }

                const biomarkers = await this.usersBiomarkersService.getList([
                    { method: ['withAlternativeNames'] },
                    { method: ['byType', BiomarkerTypes.dnaAge] },
                    { method: ['byIsDeleted', false] },
                    { method: ['byIsActive', true] },
                    { method: ['withFilters'] }
                ], transaction);

                const resultsToCreate = [];

                biomarkers.forEach(biomarker => {
                    const foundAlternativName = biomarker.alternativeNames.find(alternativeName => !!row[alternativeName.name]);

                    if (!foundAlternativName) {
                        return;
                    }

                    const baseName = foundAlternativName.name.split('_')[0];
                    const recommendationRange = FilterRangeHelper.getRecommendationTypeByValue(biomarker.filters[0], parseFloat(row[foundAlternativName.name]));

                    resultsToCreate.push({
                        userId: sample.userSample.userId,
                        biomarkerId: biomarker.id,
                        value: parseFloat(row[foundAlternativName.name]).toFixed(2),
                        date: DateTime.utc().toISODate(),
                        recommendationRange,
                        percentile: FilterRangeHelper.formatDnaAgeDeviation(parseFloat(row[`${baseName}${PERCENTILE_SUFFIX}`])),
                        deviation: null,
                        unitId: biomarker.unitId,
                        filterId: biomarker.filters[0].id,
                        dnaAgeResultId: dnaAgeResult.id,
                    });
                });

                const createdResults = await this.userResultModel.bulkCreate(resultsToCreate, { transaction });

                await this.attachRecommendations(createdResults, sample.userSample.userId, transaction);
            });

            await Promise.all(promises);
        });
    }

    async attachRecommendations(userResults: UserResult[], userId: number, transaction?: Transaction): Promise<void> {
        const userRecommendationsToCreate = [];
        const filteredUserResults = userResults.filter(userResult => userResult.filterId && userResult.recommendationRange);
        const scopes = [];

        if (!filteredUserResults.length) {
            return;
        }

        scopes.push({ method: ['byFilterIdAndType', filteredUserResults.map(userResult => ({ filterId: userResult.filterId, type: userResult.recommendationRange }))] });

        const recommendations = await this.recommendationModel
            .scope(scopes)
            .findAll({ transaction });

        const userResultsMap = {};
        filteredUserResults.forEach(userResult => {
            userResultsMap[userResult.filterId] = userResult;
        });

        recommendations.forEach(recommendation => {
            recommendation.filterRecommendations.forEach(filterRecommendation => {
                if (userResultsMap[filterRecommendation.filterId]) {
                    userRecommendationsToCreate.push({
                        userId: userId,
                        recommendationId: recommendation.id,
                        userResultId: userResultsMap[filterRecommendation.filterId].id
                    });
                }
            });
        });

        await this.userRecommendationModel.bulkCreate(userRecommendationsToCreate, { transaction });

        if (recommendations.length) {
            await this.recommendationModel
                .scope([{ method: ['byId', recommendations.map(recommendation => recommendation.id)] }])
                .update({ isDeletable: false }, { transaction } as any);
        }
    }
}
