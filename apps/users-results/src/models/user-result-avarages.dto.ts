import { ApiProperty } from '@nestjs/swagger';
import { UserResult } from '../../../admins-results/src/models/user-result.entity';
import { UserResultAvarageDto } from './user-result-avarage.dto';

export class UserResultAvaragesDto {
    @ApiProperty({ type: () => [UserResultAvarageDto] })
    readonly data: UserResultAvarageDto[];

    constructor(userResults: UserResult[]) {
        this.data = userResults.map(userResult => new UserResultAvarageDto(userResult));
    }
}
