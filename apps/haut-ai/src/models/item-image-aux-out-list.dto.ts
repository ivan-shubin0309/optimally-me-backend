import { ApiProperty } from '@nestjs/swagger';
import { ItemImageAuxOutDto } from './item-image-aux-out.dto';

export class ItemImageAuxOutListDto {
    constructor(data: any[]) {
        this.data = data.map(item => new ItemImageAuxOutDto(item));
    }

    @ApiProperty({ type: () => [ItemImageAuxOutDto], required: true })
    readonly data: ItemImageAuxOutDto[];
}