import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/src/models/pagination.dto';
import { UserResult } from '../../../admins-results/src/models/user-result.entity';

export class DatesListDto {
    @ApiProperty({ type: () => [String] })
    readonly data: string[];
    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(userResults: UserResult[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = userResults.map(userResult => userResult.get('date'));
    }
}