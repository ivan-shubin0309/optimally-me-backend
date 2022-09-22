import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';
import { Category } from './category.entity';
import { PaginationDto } from '../../../common/src/models/pagination.dto';

export class CategoriesDto {
    @ApiProperty({ type: () => [CategoryDto] })
    readonly categories: CategoryDto[];

    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(categories: Category[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.categories = categories.map(category => new CategoryDto(category));
    }
}