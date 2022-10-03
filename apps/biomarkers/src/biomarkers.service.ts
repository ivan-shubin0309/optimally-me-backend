import { Inject, Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { BaseService } from 'apps/common/src/base/base.service';
import { Biomarker } from './models/biomarker.entity';
import { BiomarkersFactory } from './biomarkers.factory';
import { CreateBiomarkerDto } from './models/create-biomarker.dto';
import { Filter } from './models/filters/filter.entity';
import { AlternativeName } from './models/alternativeNames/alternative-name.entity';

@Injectable()
export class BiomarkersService extends BaseService<Biomarker> {
    constructor(
        @Inject('BIOMARKER_MODEL') protected model: Repository<Biomarker>,
        readonly biomarkersFactory: BiomarkersFactory,
        @Inject('SEQUELIZE') readonly dbConnection: Sequelize,
        @Inject('FILTER_MODEL') readonly filterModel: Repository<Filter>,
        @Inject('ALTERNATIVE_NAME_MODEL') readonly alternativeNameModel: Repository<AlternativeName>,
    ) { super(model); }

    async create(body: CreateBiomarkerDto): Promise<Biomarker> {
        return this.dbConnection.transaction(transaction => {
            return this.biomarkersFactory.createBiomarker(body, transaction);
        });
    }

    async update(biomarker: Biomarker, body: CreateBiomarkerDto): Promise<Biomarker> {
        return this.dbConnection.transaction(async transaction => {
            const scopes: any[] = [{ method: ['byBiomarkerId', biomarker.id] }];

            await Promise.all([
                this.alternativeNameModel.scope(scopes).destroy({ transaction }),
                this.filterModel.scope(scopes).destroy({ transaction }),
            ]);

            await biomarker.update(body, { transaction });

            const promises = body.filters.map(filter => this.biomarkersFactory.attachFilter(filter, biomarker.id, transaction));

            if (body.alternativeNames && body.alternativeNames.length) {
                promises.push(this.biomarkersFactory.attachAlternativeNames(body.alternativeNames, biomarker.id, transaction));
            }

            await Promise.all(promises);

            return this.getOne(
                [{ method: ['byId', biomarker.id] }, 'includeAll'],
                transaction
            );
        });
    }
}

