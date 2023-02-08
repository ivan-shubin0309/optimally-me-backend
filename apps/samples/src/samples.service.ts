import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { Sample } from './models/sample.entity';
import { GenerateSamplesDto } from './models/generate-samples.dto';
import { SampleHelper } from '../../common/src/resources/samples/sample-helper';
import { SAMPLE_CODE_LENGTH } from '../../common/src/resources/samples/constants';

@Injectable()
export class SamplesService extends BaseService<Sample> {
    constructor(
        @Inject('SAMPLE_MODEL') protected readonly model: Repository<Sample>
    ) { super(model); }

    async generateSamples(body: GenerateSamplesDto) {
        const arrayOfSamples = [];
        const step = 1000;
        const iterations = Math.ceil(body.quantity / step);

        for (let i = 0; i <= body.quantity; i++) {
            arrayOfSamples.push({
                sampleId: SampleHelper.generateSampleCode(SAMPLE_CODE_LENGTH),
                isActive: true
            });
        }

        for (let i = 0; i < iterations; i++) {
            await this.model.bulkCreate(arrayOfSamples.slice(i * step, (i * step) + step));
        }
    }
}
