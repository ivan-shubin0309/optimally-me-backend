import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FulfillmentCenterService } from './fulfillment-center.service';

@ApiTags('sirane')
@Controller('sirane')
export class FulfillmentCenterController {
    constructor(private readonly fulfillmentCenterService: FulfillmentCenterService) { }

    @Get()
    async sampleStatusesWebhook(): Promise<void> {
    }
}
