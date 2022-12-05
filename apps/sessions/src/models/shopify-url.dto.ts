import { ApiProperty } from '@nestjs/swagger';

export class ShopifyUrlDto {
    constructor(url: string) {
        this.url = url;
    }

    @ApiProperty({ type: () => String, required: true })
    readonly url: string;
}