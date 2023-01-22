import { ApiProperty } from '@nestjs/swagger';
import { UserResult } from '../../../admins-results/src/models/user-result.entity';
import { UserResultAverageDto } from './user-result-average.dto';

export class UserResultAveragesDto {
    @ApiProperty({ type: () => [UserResultAverageDto] })
    readonly data: UserResultAverageDto[];

    constructor(userResults: UserResult[]) {
        this.data = userResults.map(userResult => new UserResultAverageDto(userResult));
    }
}
