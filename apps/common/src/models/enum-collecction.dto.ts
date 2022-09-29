import { ApiProperty } from '@nestjs/swagger';

export class CollectionDto {
    @ApiProperty({ type: () => String, required: true })
    readonly key: string;

    @ApiProperty({ type: () => Number, required: true })
    readonly value: number;

    constructor(key: string, value: number) {
        this.key = key;
        this.value = value;
    }
}