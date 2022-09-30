import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'apps/common/src/base/base.dto';
import { Category } from './category.entity';

export class CategoryDto extends BaseDto<Category> {
    @ApiProperty({ type: () => String, required: true })
    readonly name: string;

    constructor(entity: Category) {
        super(entity);
        this.name = entity.name;
    }
}