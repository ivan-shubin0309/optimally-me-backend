import { ApiProperty } from '@nestjs/swagger';
import { SessionDto } from '../../../sessions/src/models';
import { AdminUserDataDto } from './admin-user-data.dto';

export class AdminsSessionDto {

    @ApiProperty({ type: () => AdminUserDataDto, required: true })
    readonly user: AdminUserDataDto;

    @ApiProperty({ type: () => SessionDto, required: false })
    readonly session: SessionDto;

    constructor(accessToken: string, refreshToken: string, expiresAt: number, firstName: string, lastName: string) {
        this.session = new SessionDto(accessToken, refreshToken, expiresAt);
        this.user = new AdminUserDataDto(firstName, lastName);
    }
}
