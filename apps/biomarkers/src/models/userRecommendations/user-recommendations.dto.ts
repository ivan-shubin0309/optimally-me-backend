import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../../common/src/models/pagination.dto';
import { UserRecommendationDto } from './user-recommendation.dto';
import { UserRecommendation } from './user-recommendation.entity';

export class UserRecommendationsDto {
    @ApiProperty({ type: () => [UserRecommendationDto] })
    readonly data: UserRecommendationDto[];
    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(userRecommendations: UserRecommendation[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = userRecommendations.map(userRecommendation => new UserRecommendationDto(userRecommendation));
    }
}
