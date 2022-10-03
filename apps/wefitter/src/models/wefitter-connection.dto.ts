import { ApiProperty } from '@nestjs/swagger';

export class WefitterConnectionDto {
    constructor(data: any) {
        this.displayName = data.display_name;
        this.url = data.url;
        this.connected = data.connected;
        this.connectionSlug = data.connection_slug;
        this.imgUrl = data.img_url;
    }

    @ApiProperty({ type: () => String, required: true })
    readonly displayName: string;

    @ApiProperty({ type: () => String, required: true })
    readonly url: string;

    @ApiProperty({ type: () => String, required: true })
    readonly connected: string;

    @ApiProperty({ type: () => String, required: true })
    readonly connectionSlug: string;

    @ApiProperty({ type: () => String, required: true })
    readonly imgUrl: string;

}