import { ApiProperty } from '@nestjs/swagger';
import { SessionDto } from '../../../sessions/src/models';
import { UserDto } from './user.dto';
import { User } from './user.entity';

export class UserSessionDto {
    constructor(session: SessionDto, user: User) {
        this.session = session;
        this.user = new UserDto(user);
    }

    @ApiProperty({ type: () => SessionDto, required: false })
    readonly session: SessionDto;

    @ApiProperty({ type: () => UserDto, required: true })
    readonly user: UserDto;
}
