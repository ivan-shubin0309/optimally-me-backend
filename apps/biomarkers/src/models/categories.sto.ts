import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';
import { Categories } from './categories.entity';

export class CategoriesDto {
    @ApiProperty({ type: () => [CategoryDto] })
    readonly categories: CategoryDto[];

    constructor(categories: Categories[]) {
        this.categories = categories.map(category => new CategoryDto(category.id, category.name));
    }
}