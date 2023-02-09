import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository, Sequelize } from 'sequelize-typescript';
import { Sample } from './models/sample.entity';
import { GenerateSamplesDto } from './models/generate-samples.dto';
import { SampleHelper } from '../../common/src/resources/samples/sample-helper';
import { SAMPLE_CODE_LENGTH } from '../../common/src/resources/samples/constants';
import { UserSample } from './models/user-sample.entity';

@Injectable()
export class SamplesService extends BaseService<Sample> {
    constructor(
        @Inject('SAMPLE_MODEL') protected readonly model: Repository<Sample>,
        @Inject('USER_SAMPLE_MODEL') private readonly userSampleModel: Repository<UserSample>,
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
    ) { super(model); }

    async generateSamples(body: GenerateSamplesDto) {
        const arrayOfSamples = [];
        const step = 1000;
        const iterations = Math.ceil(body.quantity / step);

        for (let i = 0; i <= body.quantity; i++) {
            arrayOfSamples.push({
                sampleId: SampleHelper.generateSampleCode(SAMPLE_CODE_LENGTH),
                isActive: false
            });
        }

        for (let i = 0; i < iterations; i++) {
            await this.model.bulkCreate(arrayOfSamples.slice(i * step, (i * step) + step));
        }
    }

    async activateSample(sampleId: number, userId: number): Promise<void> {
        await this.dbConnection.transaction(async transaction => {
            await Promise.all([
                this.model
                    .scope([{ method: ['byId', sampleId] }])
                    .update({ isActive: true }, { transaction } as any),
                this.userSampleModel.create({ sampleId, userId }, { transaction })
            ]);
        });
    }
}
