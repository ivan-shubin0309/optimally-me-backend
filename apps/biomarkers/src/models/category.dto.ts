import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => String, required: true })
    readonly name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}