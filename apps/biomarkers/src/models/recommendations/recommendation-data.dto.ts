import { CreateRecommendationDto } from './create-recommendation.dto';
import { Recommendation } from './recommendation.entity';

export class RecommendationDataDto {
    constructor(data: CreateRecommendationDto | Recommendation) {
        this.category = data.category || null;
        this.content = data.content || null;
        this.productLink = data.productLink || null;
        this.title = data.title || null;
        this.type = data.type || null;
        this.isAddToCartAllowed = typeof data.isAddToCartAllowed === 'boolean' ? data.isAddToCartAllowed : null;
        this.idealTimeOfDay = data.idealTimeOfDay || null;
    }

    category: number = null;
    content: string = null;
    title: string = null;
    type: number = null;
    productLink: string = null;
    isAddToCartAllowed: boolean = null;
    idealTimeOfDay: number = null;
}