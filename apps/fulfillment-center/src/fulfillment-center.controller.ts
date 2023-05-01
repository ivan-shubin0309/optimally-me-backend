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
    async sampleStatusesWebhook(@Body() body: PostSampleStatusDto): Promise<void> {
        await this.fulfillmentCenterService.signatureVerify(body.sample_id, body.signature);

        const sample = await this.samplesService.getOne([{ method: ['bySampleId', body.sample_id] }]);

            if (sample) {
                await sample.update({
                    productName: body?.product_name,
                    labName: body?.lab_name,
                    labProfileId: body?.lab_profile_id,
                    orderSource: body?.order_source,
                    orderId: body?.order_id,
                    expireAt: body?.expiry_date,
                    testKitType: body?.require_female_cycle_status
                        ? TestKitTypes.femaleHormones
                        : TestKitTypes.default
                });
            }
    }
}
