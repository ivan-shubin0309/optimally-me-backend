import { ApiProperty } from '@nestjs/swagger';
import { LibraryFilterRecommendation } from './library-filter-recommendation.entity';


export class LibraryFilterRecommendationDto {
    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly filterId: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly recommendationId: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly type: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly recommendationOrder: number;

    constructor(entity: LibraryFilterRecommendation) {
        this.id = entity.id;
        this.filterId = entity.filterId;
        this.recommendationId = entity.recommendationId;
        this.type = entity.type;
        this.recommendationOrder = entity.recommendationOrder;
    }
}