import { CreateRecommendationDto } from './create-recommendation.dto';

export class UpdateRecommendationDto {
    constructor(data: CreateRecommendationDto) {
        this.category = data.category;
        this.content = data.content;
        this.productLink = data.productLink;
        this.title = data.title;
        this.type = data.type;
    }

    readonly category: number;
    readonly content: string;
    readonly title: string;
    readonly type: number;
    readonly productLink: string;
}