import { UserRoles } from '../../../common/src/resources/users';

export class SessionDataDto {
    constructor(data: any) {
        this.userId = data.userId;
        this.role = data.role;
        this.sessionId = data.sessionId;
        this.email = data.email;
    }

    readonly userId: number;
    readonly role: UserRoles;
    readonly sessionId: string;
    readonly email: string;
}