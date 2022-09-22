import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.entity';

export class CategoryDto {
    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => String, required: true })
    readonly name: string;

    constructor(entity: Category) {
        this.id = entity.id;
        this.name = entity.name;
    }
}