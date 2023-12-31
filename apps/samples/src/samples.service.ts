import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
import { FulfillmentCenterService } from '../../fulfillment-center/src/fulfillment-center.service';
import { TranslatorService } from 'nestjs-translator';
import { User } from '../../users/src/models';
import { SexTypes } from '../../common/src/resources/filters/sex-types';

@Injectable()
export class SamplesService extends BaseService<Sample> {
    constructor(
        @Inject('SAMPLE_MODEL') protected readonly model: Repository<Sample>,
        @Inject('USER_SAMPLE_MODEL') private readonly userSampleModel: Repository<UserSample>,
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
        private readonly fulfillmentCenterService: FulfillmentCenterService,
        private readonly translator: TranslatorService,
    ) { super(model); }

    async generateSamples(body: GenerateSamplesDto) {
        const arrayOfSamples = [];
        const step = 1000;
        const iterations = Math.ceil(body.quantity / step);

        for (let i = 0; i <= body.quantity; i++) {
            arrayOfSamples.push({
                sampleId: `${SAMPLE_PREFIX}${SampleHelper.generateSampleCode(SAMPLE_CODE_LENGTH - SAMPLE_PREFIX.length)}`,
                isActivated: false
            });
        }

        for (let i = 0; i < iterations; i++) {
            await this.model.bulkCreate(arrayOfSamples.slice(i * step, (i * step) + step));
        }
    }

    async activateSample(sample: Sample, user: User, userOtherFeature: OtherFeatureTypes): Promise<void> {
        if (!sample.testKitType) {
            const [sampleStatus] = await this.fulfillmentCenterService.getSampleStatus(sample.sampleId);

            if (!sampleStatus || !sampleStatus.product_name) {
                throw new BadRequestException({
                    message: this.translator.translate('FULFILLMENT_CENTER_SAMPLE_NOT_FOUND'),
                    errorCode: 'FULFILLMENT_CENTER_SAMPLE_NOT_FOUND',
                    statusCode: HttpStatus.BAD_REQUEST
                });
            }

            await sample.update({
                productName: sampleStatus?.product_name,
                labName: sampleStatus?.lab_name,
                labProfileId: sampleStatus?.lab_profile_id,
                orderSource: sampleStatus?.order_source,
                orderId: sampleStatus?.order_id,
                expireAt: sampleStatus?.expiry_date,
                testKitType: sampleStatus?.require_female_cycle_status
                    ? TestKitTypes.femaleHormones
                    : TestKitTypes.default
            });
        }

        if (sample.testKitType === TestKitTypes.femaleHormones && user.additionalField.sex === SexTypes.male) {
            throw new BadRequestException({
                message: this.translator.translate('USER_NOT_FEMALE'),
                errorCode: 'USER_NOT_FEMALE',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        if (sample.testKitType === TestKitTypes.femaleHormones && !userOtherFeature) {
            throw new BadRequestException({
                message: this.translator.translate('OTHER_FEATURE_REQUIRED'),
                errorCode: 'OTHER_FEATURE_REQUIRED',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        await this.dbConnection.transaction(async transaction => {
            await Promise.all([
                sample.update({
                    isActivated: true,
                }, { transaction }),
                this.userSampleModel.create({
                    sampleId: sample.id,
                    userId: user.id,
                    userOtherFeature
                }, { transaction })
            ]);
        });
    }
}
