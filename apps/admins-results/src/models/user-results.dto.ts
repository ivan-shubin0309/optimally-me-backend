import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/src/models/pagination.dto';
import { UserResultDto } from './user-result.dto';
import { UserResult } from './user-result.entity';

export class UserResultsDto {
    @ApiProperty({ type: () => [UserResultDto] })
    readonly data: UserResultDto[];
    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(userResults: UserResult[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = userResults.map(userResult => new UserResultDto(userResult));
    }
}
