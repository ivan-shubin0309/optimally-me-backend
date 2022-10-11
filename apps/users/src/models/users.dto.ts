import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/src/models/pagination.dto';
import { UserDto } from './user.dto';
import { User } from './user.entity';

export class UsersDto {
    @ApiProperty({ type: () => [UserDto] })
    readonly data: UserDto[];
    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(users: User[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = users.map(user => new UserDto(user));
    }
}
