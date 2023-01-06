import { CreateRecommendationDto } from './create-recommendation.dto';
import { Recommendation } from './recommendation.entity';

export class RecommendationDataDto {
    constructor(data: CreateRecommendationDto | Recommendation) {
        this.category = data.category;
        this.content = data.content;
        this.productLink = data.productLink;
        this.title = data.title;
        this.type = data.type;
        this.isAddToCartAllowed = data.isAddToCartAllowed;
        this.idealTimeOfDay = data.idealTimeOfDay;
    }

    category: number = null;
    content: string = null;
    title: string = null;
    type: number = null;
    productLink: string = null;
    isAddToCartAllowed: boolean = null;
    idealTimeOfDay: number = null;
}