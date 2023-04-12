import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository, Sequelize } from 'sequelize-typescript';
import { Sample } from './models/sample.entity';
import { GenerateSamplesDto } from './models/generate-samples.dto';
import { SampleHelper } from '../../common/src/resources/samples/sample-helper';
import { SAMPLE_CODE_LENGTH } from '../../common/src/resources/samples/constants';
import { UserSample } from './models/user-sample.entity';
import { SAMPLE_PREFIX } from '../../common/src/resources/hl7/hl7-constants';
import { TestKitTypes } from '../../common/src/resources/hl7/test-kit-types';
import { OtherFeatureTypes } from '../../common/src/resources/filters/other-feature-types';

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
                sampleId: `${SAMPLE_PREFIX}${SampleHelper.generateSampleCode(SAMPLE_CODE_LENGTH - SAMPLE_PREFIX.length)}`,
                isActivated: false,
                testKitType: TestKitTypes.femaleHormones //TO DO remove on fulfillment center integration
            });
        }

        for (let i = 0; i < iterations; i++) {
            await this.model.bulkCreate(arrayOfSamples.slice(i * step, (i * step) + step));
        }
    }

    async activateSample(sampleId: number, userId: number, userOtherFeature: OtherFeatureTypes): Promise<void> {
        await this.dbConnection.transaction(async transaction => {
            await Promise.all([
                this.model
                    .scope([{ method: ['byId', sampleId] }])
                    .update({ 
                        isActivated: true,
                        testKitType: TestKitTypes.femaleHormones //TO DO remove on fulfillment center integration
                    }, { transaction } as any),
                this.userSampleModel.create({ 
                    sampleId, 
                    userId,
                    userOtherFeature
                }, { transaction })
            ]);
        });
    }
}
