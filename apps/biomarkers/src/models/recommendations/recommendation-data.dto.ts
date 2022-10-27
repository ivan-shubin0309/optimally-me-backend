import { CreateRecommendationDto } from './create-recommendation.dto';
import { Recommendation } from './recommendation.entity';

export class RecommendationDataDto {
    constructor(data: CreateRecommendationDto | Recommendation) {
        this.category = data.category;
        this.content = data.content;
        this.productLink = data.productLink;
        this.title = data.title;
        this.type = data.type;
    }

    category: number;
    content: string;
    title: string;
    type: number;
    productLink: string;
}