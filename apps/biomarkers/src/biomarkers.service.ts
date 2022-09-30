import { Inject, Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { BaseService } from 'apps/common/src/base/base.service';
import { Biomarker } from './models/biomarker.entity';
import { BiomarkersFactory } from './biomarkers.factory';
import { CreateBiomarkerDto } from './models/create-biomarker.dto';

@Injectable()
export class BiomarkersService extends BaseService<Biomarker> {
    constructor(
        @Inject('BIOMARKER_MODEL') protected model: Repository<Biomarker>,
        readonly biomarkersFactory: BiomarkersFactory,
        @Inject('SEQUELIZE') readonly dbConnection: Sequelize,
    ) { super(model); }

    async create(body: CreateBiomarkerDto): Promise<Biomarker> {
        return this.dbConnection.transaction(transaction => {
            return this.biomarkersFactory.createBiomarker(body, transaction);
        });
    }
}

