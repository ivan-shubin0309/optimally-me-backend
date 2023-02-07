import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { Sample } from './models/sample.entity';
import { GenerateSamplesDto } from './models/generate-samples.dto';

const ITERATION_STEP = 1000;

@Injectable()
export class SamplesService extends BaseService<Sample> {
    constructor(
        @Inject('SAMPLE_MODEL') protected readonly model: Repository<Sample>
    ) { super(model); }

    async generateSamples(body: GenerateSamplesDto) {
        for (let i = 0; i <= body.quantity; i += ITERATION_STEP) {

        }
    }
}
