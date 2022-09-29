import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'sequelize-typescript';

export class BaseDto<T extends Model> {
    constructor(entity: T) {
        this.id = entity.id;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => String, required: true })
    readonly createdAt: string;

    @ApiProperty({ type: () => String, required: true })
    readonly updatedAt: string;
}