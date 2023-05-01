import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TestKitTypes } from '../../common/src/resources/hl7/test-kit-types';
import { Public } from '../../common/src/resources/common/public.decorator';
import { SamplesService } from '../../samples/src/samples.service';
import { PostSampleStatusDto } from './models/post-sample-status.dto';
import { FulfillmentCenterService } from './fulfillment-center.service';

@ApiTags('sirane')
@Controller('sirane')
export class FulfillmentCenterController {
    constructor(
        private readonly samplesService: SamplesService,
        private readonly fulfillmentCenterService: FulfillmentCenterService,
    ) { }

    @ApiOperation({ summary: 'Fulfillment center webhook' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Public()
    @Post()
    async sampleStatusesWebhook(@Body() body: PostSampleStatusDto[]): Promise<void> {
        const [firstItem] = body;
        await this.fulfillmentCenterService.signatureVerify(firstItem.sample_id, firstItem.signature);

        const promises = body.map(async (data) => {
            const sample = await this.samplesService.getOne([{ method: ['bySampleId', data.sample_id] }]);

            if (sample) {
                await sample.update({
                    productName: data?.product_name,
                    labName: data?.lab_name,
                    labProfileId: data?.lab_profile_id,
                    orderSource: data?.order_source,
                    orderId: data?.order_id,
                    expireAt: data?.expiry_date,
                    testKitType: data?.require_female_cycle_status
                        ? TestKitTypes.femaleHormones
                        : TestKitTypes.default
                });
            }
        });

        await Promise.all(promises);
    }
}
